// Unit tests for the keep-alive Worker. No test runner in this repo, so this is
// a plain Node script: it imports the Worker, stubs global fetch, and asserts
// the probe logic (health classification, URL validation, fail-loud on missing
// config). Run with `node worker/test/index.test.js`.

import assert from "node:assert/strict";
import worker from "../src/index.js";

let passed = 0;
let failed = 0;
function check(name, fn) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      passed += 1;
      console.log(`  ok: ${name}`);
    })
    .catch((err) => {
      failed += 1;
      console.log(`  FAIL: ${name}: ${err.message}`);
    });
}

function fakeFetch(handler) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return handler(url, init);
  };
  return calls;
}

function jsonResponse(status, body) {
  return {
    status,
    text: async () => body,
  };
}

function env(overrides = {}) {
  return {
    GATEWAY_HEALTH_URL: "https://gw.example/health",
    PROBE_TIMEOUT_MS: "1000",
    ...overrides,
  };
}

// A minimal ExecutionContext; scheduled uses ctx.waitUntil.
function ctx() {
  const waited = [];
  return { waited, waitUntil: (p) => waited.push(p) };
}

async function run() {
  console.log("keepalive worker tests");

  await check("fetch returns 200 and ok when the gateway answers status ok", async () => {
    fakeFetch(() => jsonResponse(200, '{"status":"ok"}'));
    const res = await worker.fetch(new Request("https://w/"), env());
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ok, true);
    assert.equal(body.status, 200);
  });

  await check("fetch returns 502 when the gateway is down (status 0)", async () => {
    fakeFetch(() => {
      throw new Error("connection refused");
    });
    const res = await worker.fetch(new Request("https://w/"), env());
    assert.equal(res.status, 502);
    const body = await res.json();
    assert.equal(body.ok, false);
    assert.match(body.error, /connection refused/);
  });

  await check("fetch treats a 200 with a non-gateway body as unhealthy", async () => {
    fakeFetch(() => jsonResponse(200, "<!doctype html><title>parked</title>"));
    const res = await worker.fetch(new Request("https://w/"), env());
    assert.equal(res.status, 502);
    assert.equal((await res.json()).ok, false);
  });

  await check("fetch treats a non-200 status as unhealthy", async () => {
    fakeFetch(() => jsonResponse(503, '{"status":"starting"}'));
    const res = await worker.fetch(new Request("https://w/"), env());
    assert.equal(res.status, 502);
    assert.equal((await res.json()).ok, false);
  });

  await check("fetch fails loud with 500 when GATEWAY_HEALTH_URL is missing", async () => {
    fakeFetch(() => jsonResponse(200, '{"status":"ok"}'));
    const res = await worker.fetch(new Request("https://w/"), env({ GATEWAY_HEALTH_URL: undefined }));
    assert.equal(res.status, 500);
    assert.match((await res.json()).error, /GATEWAY_HEALTH_URL is not set/);
  });

  await check("fetch rejects a non-https target", async () => {
    fakeFetch(() => jsonResponse(200, '{"status":"ok"}'));
    const res = await worker.fetch(
      new Request("https://w/"),
      env({ GATEWAY_HEALTH_URL: "http://gw.example/health" }),
    );
    assert.equal(res.status, 500);
    assert.match((await res.json()).error, /must be https/);
  });

  await check("fetch rejects a malformed URL", async () => {
    fakeFetch(() => jsonResponse(200, '{"status":"ok"}'));
    const res = await worker.fetch(
      new Request("https://w/"),
      env({ GATEWAY_HEALTH_URL: "not a url" }),
    );
    assert.equal(res.status, 500);
    assert.match((await res.json()).error, /not a valid URL/);
  });

  await check("scheduled probes the configured URL exactly once", async () => {
    const calls = fakeFetch(() => jsonResponse(200, '{"status":"ok"}'));
    const c = ctx();
    worker.scheduled({}, env(), c);
    assert.equal(c.waited.length, 1, "scheduled must hand the probe to waitUntil");
    await Promise.all(c.waited);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://gw.example/health");
    assert.equal(calls[0].init.method, "GET");
  });

  await check("scheduled never throws when the probe fails (cron must not crash)", async () => {
    fakeFetch(() => {
      throw new Error("network down");
    });
    const c = ctx();
    worker.scheduled({}, env(), c);
    await Promise.all(c.waited);
    assert.equal(c.waited.length, 1);
  });

  console.log(`\nRESULT: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

run();
