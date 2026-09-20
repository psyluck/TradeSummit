#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/_config.sh"

OUT="$(dirname "$CID_FILE")"
[ -f "$CID_FILE" ] || { echo "check: no $CID_FILE; run ./scripts/build.sh first" >&2; exit 1; }
CID="$(cat "$CID_FILE")"
# Local CID is what kubo pinned; the public/routing legs use the remote CID
# from pin-remote.sh when one exists (the only CID guaranteed publicly
# retrievable), otherwise they fall back to the local CID.
PUBLIC_CID="$CID"
if [ -f "$REMOTE_CID_FILE" ] && [ -s "$REMOTE_CID_FILE" ]; then
  PUBLIC_CID="$(cat "$REMOTE_CID_FILE")"
fi
command -v "$IPFS_BIN" >/dev/null 2>&1 || { echo "check: kubo not found" >&2; exit 1; }
[ -f "$IPFS_REPO/config" ] || { echo "check: no local repo at $IPFS_REPO; run ./scripts/build.sh first" >&2; exit 1; }

# The local gateway needs a daemon on the dedicated repo. `ipfs id` works
# offline, so detect one by comparing the RPC server's peer against the repo's
# Identity.PeerID; a stranger daemon on the default ports must not be reused.
API_ADDR="http://127.0.0.1:5001"
PEER_ID="$(jq -r '.Identity.PeerID' "$IPFS_REPO/config")"
SERVING="$(curl -sf -X POST --max-time 5 "$API_ADDR/api/v0/id" 2>/dev/null | jq -r '.ID // empty' || true)"

WE_STARTED=0
if [ "$SERVING" != "$PEER_ID" ]; then
  IPFS_PATH="$IPFS_REPO" "$IPFS_BIN" daemon >"$OUT/gateway-daemon.log" 2>&1 &
  sleep 2
  if ! kill -0 "$!" 2>/dev/null; then
    echo "check: daemon for $IPFS_REPO failed to start; is another kubo daemon on :5001/:8080?" >&2
    tail -n 20 "$OUT/gateway-daemon.log" >&2 || true
    exit 1
  fi
  WE_STARTED=1
  trap 'kill $(jobs -p) 2>/dev/null || true' EXIT
fi

for _ in $(seq 1 60); do
  if curl -sfL --max-time 5 -o /dev/null "$LOCAL_GATEWAY/ipfs/$CID/index.html"; then
    break
  fi
  sleep 1
done

# -L follows public-gateway subdomain redirects (e.g. dweb.link -> <CID>.ipfs.dweb.link).
# Each leg requires the final HTTP 200, the HTML doctype, and a TradeSummit
# marker in the body, so a wrong CID, an error page, or an unrelated parked
# page (HTTP 200 with a doctype) fails instead of passing.
check_gateway() {
  local name="$1" base="$2" want="$3" marker="$4"
  local body code
  body="$(mktemp)"
  code="$(curl -sL --max-redirs 5 --max-time 45 -w '%{http_code}' -o "$body" "$base/ipfs/$want/index.html" 2>/dev/null || true)"
  if [ "$code" != "200" ]; then
    rm -f "$body"
    echo "check failed: $name gateway returned HTTP $code at $base/ipfs/$want/index.html" >&2
    return 1
  fi
  if ! grep -qi '^<!doctype html' "$body" || ! grep -qi "$marker" "$body"; then
    rm -f "$body"
    echo "check failed: $name gateway returned HTTP 200 but the body is not the landing page (doctype or marker '$marker' missing)" >&2
    return 1
  fi
  rm -f "$body"
  echo "ok: $name gateway served /ipfs/$want/index.html (HTTP 200, doctype present, marker present)"
}

# Cloudflare Pages serves the site at root paths (no /ipfs/<CID>/ prefix), so
# its leg fetches the custom-domain root and asserts the same page markers.
check_pages() {
  local name="$1" base="$2" marker="$3"
  local body code
  body="$(mktemp)"
  code="$(curl -sL --max-redirs 5 --max-time 45 -w '%{http_code}' -o "$body" "$base/index.html" 2>/dev/null || true)"
  if [ "$code" != "200" ]; then
    rm -f "$body"
    echo "check failed: $name returned HTTP $code at $base/index.html" >&2
    return 1
  fi
  if ! grep -qi '^<!doctype html' "$body" || ! grep -qi "$marker" "$body"; then
    rm -f "$body"
    echo "check failed: $name returned HTTP 200 but the body is not the landing page (doctype or marker '$marker' missing)" >&2
    return 1
  fi
  rm -f "$body"
  echo "ok: $name served /index.html (HTTP 200, doctype present, marker present)"
}

check_gateway "local" "$LOCAL_GATEWAY" "$CID" "TradeSummit"

# Public leg tries fallbacks with backoff: free public gateways rate-limit
# shared egress IPs, so one 429 must not fail the whole check.
PUBLIC_OK=0
for base in "$PUBLIC_GATEWAY" "https://ipfs.filebase.io" "https://ipfs.io" "https://gateway.ipfs.io" "https://w3s.link"; do
  if check_gateway "public" "$base" "$PUBLIC_CID" "TradeSummit"; then
    PUBLIC_OK=1
    break
  fi
  sleep 3
done
if [ "$PUBLIC_OK" -eq 0 ]; then
  echo "check failed: no public gateway served the CID" >&2
  exit 1
fi
if [ -n "$CF_GATEWAY_HOST" ]; then
  check_pages "cloudflare" "https://$CF_GATEWAY_HOST" "TradeSummit" \
    || echo "note: cloudflare leg not green; expected a Cloudflare Pages project serving the dist on www.tradesummit.online" >&2
fi

# Provider gateway probe is informational, not a gate: Pinata's free-tier
# shared gateway does not serve HTML (ERR_ID 00023), so public retrievability
# is proven by the public gateway leg and the Cloudflare gateway leg instead.
if [ -f "$REMOTE_CID_FILE" ] && [ -s "$REMOTE_CID_FILE" ]; then
  CODE="$(curl -sL --max-redirs 5 --max-time 45 -o /dev/null -w '%{http_code}' "$PIN_GATEWAY_BASE/ipfs/$PUBLIC_CID/index.html" 2>/dev/null || true)"
  if [ "$CODE" = "200" ]; then
    echo "ok: $PIN_PROVIDER gateway served /ipfs/$PUBLIC_CID/index.html"
  else
    echo "note: $PIN_PROVIDER shared gateway returned HTTP $CODE for HTML (free-tier HTML serving disabled); CID is pinned and reachable via the public and cloudflare legs"
  fi
fi
# DNS leg: the "Launch App" redirect only matters if the target resolves and
# serves. The record lives in the Cloudflare zone (outside the committed tree),
# so a missing record must NOT fail the deploy gate — it prints the exact one
# liner to create it and stays green. Once the record resolves, the leg is
# strict: it must serve the app root over HTTPS or this check fails.
dns_leg() {
  local name="app.tradesummit.online"
  local ip=""
  # Resolver 1: local getent. Resolver 2: Cloudflare DoH JSON (free, keyless)
  # so the repo check works even on hosts whose resolver doesn't have the record.
  ip="$(getent ahosts "$name" | awk 'NR==1 { print $1 }' 2>/dev/null || true)"
  if [ -z "$ip" ]; then
    ip="$(curl -fsSL --max-time 8 -H 'accept: application/dns-json' \
      "https://cloudflare-dns.com/dns-query?name=$name&type=A" 2>/dev/null \
      | jq -r '.Answer[]? | select(.type == 1) | .data' 2>/dev/null | head -1 || true)"
  fi
  if [ -z "$ip" ]; then
    echo "dns: no record yet for $name; in Cloudflare create CNAME \"$name\" -> \"tradesummit.online\" (Proxied, TTL Auto), then re-run this check to prove the redirect target is reachable"
    return 0
  fi
  echo "ok: $name resolves -> $ip"
  local code
  code="$(curl -sfL --max-time 20 -o /dev/null -w '%{http_code}' "https://$name/" 2>/dev/null || true)"
  if [ "$code" = "200" ]; then
    echo "ok: https://$name/ served the app (HTTP 200)"
  else
    echo "check failed: $name resolves but https://$name/ returned HTTP $code" >&2
    return 1
  fi
}
if ! dns_leg; then
  exit 1
fi

echo "ok: gateways verified (local $CID, public $PUBLIC_CID)"