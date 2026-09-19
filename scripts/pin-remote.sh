#!/usr/bin/env bash
# pin-remote.sh - upload the staged package to a free remote pinning service
# (default Pinata) and record the remote CID as the canonical one for the
# DNSLink record and the public gateway check.
#
# The remote upload is what makes the CID publicly retrievable: Cloudflare's
# IPFS gateway and public gateways can then fetch content even though the local
# kubo node is not reachable from the public network. The remote CID becomes
# the published identity; the local kubo pin (from publish.sh) remains for
# local recovery and bit-level comparison.
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/_config.sh"

if [ -z "$PIN_PROVIDER" ] || [ -z "$PIN_API_BASE" ] || [ -z "$PIN_UPLOAD_ENDPOINT" ] || [ -z "$PIN_GATEWAY_BASE" ]; then
  echo "pin-remote: incomplete pinning config in $CONFIG" >&2
  exit 1
fi
[ -d "$DIST" ] || { echo "pin-remote: no staged package at $DIST; run ./scripts/build.sh first" >&2; exit 1; }
[ -f "$DIST/index.html" ] || { echo "pin-remote: $DIST has no index.html; run ./scripts/build.sh first" >&2; exit 1; }
if [ -z "$PINATA_JWT" ]; then
  echo "pin-remote: PINATA_JWT is not set; create a free Pinata API key with pinFileToIPFS and store it in scripts/out/remote.env" >&2
  exit 1
fi

FILES="$(cd "$DIST" && find . -type f | sort | sed 's|^\./||')"
[ -n "$FILES" ] || { echo "pin-remote: no files to upload" >&2; exit 1; }

ARGS=(-sS --fail-with-body --max-time 600 -H "Authorization: Bearer $PINATA_JWT")
while IFS= read -r rel; do
  [ -n "$rel" ] || continue
  ARGS+=(-F "file=@$DIST/$rel;filename=$rel")
done <<<"$FILES"
ARGS+=(-F "pinataOptions={\"wrapWithDirectory\":true,\"cidVersion\":1}")
ARGS+=(-F "pinataMetadata={\"name\":\"$DOMAIN landing\"}")

RESP="$(curl "${ARGS[@]}" "$PIN_API_BASE$PIN_UPLOAD_ENDPOINT")"
REMOTE="$(jq -r '.IpfsHash // empty' <<<"$RESP")"
if [ -z "$REMOTE" ]; then
  echo "pin-remote: upload failed; response:" >&2
  printf '%s\n' "$RESP" >&2
  exit 1
fi

printf '%s\n' "$REMOTE" > "$REMOTE_CID_FILE"
echo "pin-remote: pinned $REMOTE via $PIN_PROVIDER ($(printf '%s\n' "$FILES" | wc -l | tr -d ' ') files)"
echo "pin-remote: remote CID recorded at $REMOTE_CID_FILE; dnslink.sh and check.sh will use it"