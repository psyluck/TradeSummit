#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/_config.sh"

OUT="$(dirname "$CID_FILE")"
[ -f "$CID_FILE" ] || { echo "check: no $CID_FILE; run ./scripts/build.sh first" >&2; exit 1; }
CID="$(cat "$CID_FILE")"
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
# The check still requires the final HTTP 200 plus the HTML doctype, so a wrong CID
# or a redirect to an error page fails instead of passing.
check_gateway() {
  local name="$1" base="$2"
  local body code
  body="$(mktemp)"
  code="$(curl -sL --max-redirs 5 --max-time 45 -w '%{http_code}' -o "$body" "$base/ipfs/$CID/index.html")"
  if [ "$code" != "200" ] || ! grep -qi '^<!doctype html' "$body"; then
    rm -f "$body"
    echo "check failed: $name gateway returned HTTP $code at $base/ipfs/$CID/index.html" >&2
    return 1
  fi
  rm -f "$body"
  echo "ok: $name gateway served /ipfs/$CID/index.html (HTTP 200, doctype present)"
}

check_gateway "local" "$LOCAL_GATEWAY"
check_gateway "public" "$PUBLIC_GATEWAY"
echo "ok: both gateways verified for CID $CID"