#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG="$ROOT/scripts/config.json"
IPFS_BIN="${IPFS:-ipfs}"

[ -f "$CONFIG" ] || { echo "check: no $CONFIG" >&2; exit 1; }
OUT="$(dirname "$ROOT/$(jq -r .cidFile "$CONFIG")")"
IPFS_REPO="$ROOT/$(jq -r .ipfsRepo "$CONFIG")"
CID_FILE="$ROOT/$(jq -r .cidFile "$CONFIG")"
[ -f "$CID_FILE" ] || { echo "check: no $CID_FILE; run ./scripts/build.sh first" >&2; exit 1; }
CID="$(cat "$CID_FILE")"
LOCAL_GATEWAY="$(jq -r .gateways.local "$CONFIG")"
PUBLIC_GATEWAY="$(jq -r .gateways.public "$CONFIG")"
command -v "$IPFS_BIN" >/dev/null 2>&1 || { echo "check: kubo not found" >&2; exit 1; }
[ -d "$IPFS_REPO" ] || { echo "check: no local repo at $IPFS_REPO; run ./scripts/build.sh first" >&2; exit 1; }

# The local gateway needs the daemon; start it on the dedicated repo when absent.
# `ipfs id` works offline (it reads the repo keys), so probe the RPC API instead.
API_ADDR="http://127.0.0.1:5001"
WE_STARTED=0
if ! curl -sf --max-time 3 -o /dev/null "$API_ADDR/api/v0/version"; then
  IPFS_PATH="$IPFS_REPO" "$IPFS_BIN" daemon >"$OUT/gateway-daemon.log" 2>&1 &
  WE_STARTED=1
fi
if [ "$WE_STARTED" -eq 1 ]; then
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