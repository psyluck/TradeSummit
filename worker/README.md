# TradeSummit keep-alive Worker

A Cloudflare Worker on a cron trigger that issues an external `GET` to the
Render gateway's `/health` so the free-tier instance sees real inbound traffic
and does not spin down.

## Why this exists

The gateway runs on Render's free tier, which sleeps after a period of inbound
inactivity. The Erlang side already self-pings its own `/health` on localhost
(`backend/gateway/src/gw_keepalive.erl`, gated by `GW_SELF_PING`), but a
loopback request is not the platform's sleep signal: Render decides sleep on
external reachability. This Worker is that external signal. Together the two
cover both cases, the in-instance tick and the out-of-instance reach.

This lives in the landing repo because that repo already owns the Cloudflare
zone tooling (`scripts/dnslink.sh`, `scripts/check.sh`, the Pages runbook) and
the `tradesummit.online` zone. The gateway host it pings is configured in
`scripts/config.json` under `keepalive`.

## Layout

- `src/index.js` - the Worker. One probe shared by the scheduled handler (the
  product) and the fetch handler (so a manual `curl` can verify it).
- `wrangler.toml` - the deploy manifest: name, cron, and `GATEWAY_HEALTH_URL`.
- `test/index.test.js` - a plain Node script (no runner in this repo) covering
  the health classification, config validation, and the scheduled path.

## The target

`GATEWAY_HEALTH_URL` is not a secret. It is the public gateway origin the
terminal already connects to, and `/health` discloses nothing but its own
liveness. It is set in `wrangler.toml` `[vars]` and must stay identical to
`keepalive.healthUrl` in `scripts/config.json`; `./scripts/check.sh` fails if
the two drift. A missing or non-https target fails the invocation loudly rather
than silently pinging nothing.

## Deploy - MANUAL (account)

Needs a Workers-capable Cloudflare token. One time to create, then redeploy on
change:

```sh
cd worker
npx wrangler deploy   # creates/updates the Worker and its cron trigger
```

The cron (`*/5 * * * *`, every 5 minutes) is declared in `wrangler.toml`, so the
deploy registers it; no dashboard step. Render's free-tier sleep threshold is
15 minutes, so a 5-minute cadence keeps the instance comfortably awake with room
for a missed tick.

## Verify

Local, no Cloudflare needed:

```sh
node worker/test/index.test.js            # unit tests, offline
npx wrangler dev --test-scheduled         # then in another shell:
curl http://127.0.0.1:8787/               # fetch probe: {"ok":true,"status":200,...}
curl "http://127.0.0.1:8787/__scheduled?cron=*/5+*+*+*+*"   # fire the cron once
```

Live, after deploy:

```sh
curl https://tradesummit-keepalive.<subdomain>.workers.dev/
```

A `{"ok":true,"status":200,...}` proves the Worker reached the gateway. A cold
start can exceed the 10s probe timeout and report `{"ok":false,"status":0,...}`;
that is the free tier waking up, and the next tick is green. To check the last
result without waiting for a tick, read the Worker logs in the Cloudflare
dashboard (Workers & Pages > tradesummit-keepalive > Logs) or `npx wrangler tail`.
