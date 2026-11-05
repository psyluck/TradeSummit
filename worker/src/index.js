// TradeSummit keep-alive Worker.
//
// The gateway runs on a Render free-tier instance, which sleeps after a period
// of inbound inactivity. The Erlang side already self-pings its own /health on
// localhost (gw_keepalive), but a loopback request is not the platform's wake
// signal: Render decides sleep on external traffic. This Worker is that
// external signal. A cron trigger issues a GET to the live gateway health
// endpoint on a fixed schedule, so the free instance sees real inbound traffic
// and stays warm without a paid plan.
//
// The same invocation also probes /metrics when an operator token is configured,
// so uptime and error counters are read on the same cadence as liveness. A
// failed probe, or a metrics read that cannot be authorized, triggers a
// webhook alert when ALERT_WEBHOOK_URL is set. The Worker stays stateless: it
// does not persist previous samples, so alerting is edge-triggered on the
// current invocation rather than on a transition.
//
// Targets are read from the Worker's environment so hosts and tokens are
// config, not literals buried in code. There is no fallback for the health
// URL: an unset or malformed target fails the invocation loudly rather than
// silently pinging nothing, because a keep-alive that quietly no-ops is worse
// than one that errors.

const DEFAULT_TIMEOUT_MS = 10000;

function healthy(status, body) {
  if (status !== 200) return false;
  try {
    return JSON.parse(body).status === "ok";
  } catch {
    return false;
  }
}

async function probe(url, timeoutMs, headers = {}) {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "user-agent": "tradesummit-keepalive", ...headers },
      signal: controller.signal,
      cf: { cacheTtl: 0, cacheEverything: false },
    });
    const body = await response.text();
    return {
      ok: healthy(response.status, body),
      status: response.status,
      ms: Date.now() - started,
      body,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      ms: Date.now() - started,
      error: err instanceof Error ? err.message : String(err),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function probeMetrics(url, token, timeoutMs) {
  if (!token) {
    return { configured: false, ok: true, skipped: true, status: 0, ms: 0 };
  }
  const result = await probe(url, timeoutMs, {
    authorization: `Bearer ${token}`,
    "x-metrics-token": token,
  });
  let parsed = null;
  try {
    parsed = JSON.parse(result.body ?? "");
  } catch {
    parsed = null;
  }
  const ok = result.ok && parsed !== null && parsed.status === "ok";
  return {
    configured: true,
    ok,
    skipped: false,
    status: result.status,
    ms: result.ms,
    uptimeMs: parsed?.node_uptime_ms ?? null,
    connections: parsed?.connections ?? null,
    error: ok ? undefined : (result.error ?? (result.status === 0 ? "network error" : `unexpected response (${result.status})`)),
  };
}

function readConfig(env) {
  const url = env?.GATEWAY_HEALTH_URL;
  if (!url) {
    throw new Error("GATEWAY_HEALTH_URL is not set on this Worker");
  }
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`GATEWAY_HEALTH_URL is not a valid URL: ${url}`);
  }
  if (parsed.protocol !== "https:") {
    throw new Error(`GATEWAY_HEALTH_URL must be https, got ${parsed.protocol}`);
  }
  const timeoutMs = Number(env?.PROBE_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);
  const resolvedTimeout = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS;

  const metricsUrl = env?.GATEWAY_METRICS_URL
    ? String(env.GATEWAY_METRICS_URL)
    : url.replace(/\/health\/?$/, "/metrics");
  let metricsParsed;
  try {
    metricsParsed = new URL(metricsUrl);
  } catch {
    throw new Error(`GATEWAY_METRICS_URL is not a valid URL: ${metricsUrl}`);
  }
  if (metricsParsed.protocol !== "https:") {
    throw new Error(`GATEWAY_METRICS_URL must be https, got ${metricsParsed.protocol}`);
  }

  const webhookUrl = env?.ALERT_WEBHOOK_URL ? String(env.ALERT_WEBHOOK_URL) : null;
  if (webhookUrl) {
    let webhookParsed;
    try {
      webhookParsed = new URL(webhookUrl);
    } catch {
      throw new Error(`ALERT_WEBHOOK_URL is not a valid URL: ${webhookUrl}`);
    }
    if (webhookParsed.protocol !== "https:") {
      throw new Error(`ALERT_WEBHOOK_URL must be https, got ${webhookParsed.protocol}`);
    }
  }

  const metricsToken = env?.GATEWAY_METRICS_TOKEN ? String(env.GATEWAY_METRICS_TOKEN) : null;

  return {
    url,
    timeoutMs: resolvedTimeout,
    metricsUrl,
    metricsToken,
    webhookUrl,
  };
}

async function runProbes(config) {
  const health = await probe(config.url, config.timeoutMs);
  const healthResult = {
    ok: health.ok,
    status: health.status,
    ms: health.ms,
    error: health.ok ? undefined : (health.error ?? `unexpected response (${health.status})`),
  };
  const metrics = await probeMetrics(config.metricsUrl, config.metricsToken, config.timeoutMs);
  const ok = healthResult.ok && metrics.ok;
  return { ok, health: healthResult, metrics };
}

async function sendAlert(config, result) {
  if (!config.webhookUrl) return;
  try {
    await fetch(config.webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": "tradesummit-keepalive" },
      body: JSON.stringify({
        source: "tradesummit-keepalive",
        ok: result.ok,
        timestamp: new Date().toISOString(),
        health: result.health,
        metrics: result.metrics,
      }),
    });
  } catch (err) {
    console.error(`alert webhook failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export default {
  async scheduled(_event, env, ctx) {
    let config;
    try {
      config = readConfig(env);
    } catch (err) {
      console.error(`keepalive config error: ${err.message}`);
      return;
    }
    const work = (async () => {
      const result = await runProbes(config);
      if (result.ok) {
        console.log(
          `keepalive ok: ${config.url} ${result.health.status} in ${result.health.ms}ms` +
            (result.metrics.configured ? `; metrics ${result.metrics.status} in ${result.metrics.ms}ms` : ""),
        );
      } else {
        console.error(
          `keepalive failed: health=${result.health.status} in ${result.health.ms}ms` +
            (result.health.error ? ` error=${result.health.error}` : "") +
            (result.metrics.configured
              ? `; metrics=${result.metrics.status} in ${result.metrics.ms}ms${result.metrics.error ? ` error=${result.metrics.error}` : ""}`
              : ""),
        );
      }
      await sendAlert(config, result);
    })();
    ctx.waitUntil(work);
  },

  async fetch(_request, env) {
    let config;
    try {
      config = readConfig(env);
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
    const result = await runProbes(config);
    return new Response(JSON.stringify({
      ok: result.ok,
      status: result.health.status,
      ms: result.health.ms,
      error: result.health.error,
      health: result.health,
      metrics: result.metrics,
    }), {
      status: result.ok ? 200 : 502,
      headers: { "content-type": "application/json" },
    });
  },
};
