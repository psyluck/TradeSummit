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
// The target is read from the Worker's environment (GATEWAY_HEALTH_URL) so the
// host is config, not a literal buried in code. There is no fallback: an unset
// or malformed target fails the invocation loudly rather than silently pinging
// nothing, because a keep-alive that quietly no-ops is worse than one that
// errors.
//
// The scheduled event and the fetch handler share one probe. The scheduled
// path is the product; the fetch path exists so a manual `curl` of the Worker
// URL can confirm the probe works and see the last result, which is how this
// gets verified without waiting for the next cron tick.

const DEFAULT_TIMEOUT_MS = 10000;

// A health probe is only meaningful if it distinguishes a healthy gateway from
// a broken one. A 200 with a body that is not the gateway's `{"status":"ok"}`
// is treated as unhealthy: a parked page, a proxy error page, or any other
// 200 body must not read as "warm".
function healthy(status, body) {
  if (status !== 200) return false;
  try {
    return JSON.parse(body).status === "ok";
  } catch {
    return false;
  }
}

async function probe(url, timeoutMs) {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "user-agent": "tradesummit-keepalive" },
      signal: controller.signal,
      // Never let Cloudflare serve a cached 200 for a probe whose whole point
      // is to generate origin traffic.
      cf: { cacheTtl: 0, cacheEverything: false },
    });
    const body = await response.text();
    return {
      ok: healthy(response.status, body),
      status: response.status,
      ms: Date.now() - started,
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
  return { url, timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS };
}

export default {
  async scheduled(_event, env, ctx) {
    const { url, timeoutMs } = readConfig(env);
    ctx.waitUntil(
      probe(url, timeoutMs).then((result) => {
        if (result.ok) {
          console.log(`keepalive ok: ${url} ${result.status} in ${result.ms}ms`);
        } else {
          console.error(
            `keepalive failed: ${url} status=${result.status} in ${result.ms}ms${result.error ? ` error=${result.error}` : ""}`,
          );
        }
      }),
    );
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
    const result = await probe(config.url, config.timeoutMs);
    return new Response(JSON.stringify(result), {
      status: result.ok ? 200 : 502,
      headers: { "content-type": "application/json" },
    });
  },
};
