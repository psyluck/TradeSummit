#!/usr/bin/env bash
# pin-remote.sh - upload the staged package to a free remote pinning service
# (default Pinata) and record the remote CID as the canonical one for the
# DNSLink record and the public gateway check.
#
# Uploads through the Pinata v3 Files API (uploads.pinata.cloud/v3/files): one
# `file` part per staged file with its relative path in the filename, plus
# `network=public`, which yields the same directory DAG kubo computes, so the
# remote CID matches the local build CID byte for byte. The legacy
# /pinning/pinFileToIPFS endpoint rejects multi-entry directory uploads. The
# remote upload is what makes the CID publicly retrievable; the local kubo pin
# (from publish.sh) remains for local recovery and bit-level comparison.
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

ARGS=(-sS --fail-with-body --max-time 600 -H "Authorization: Bearer $PINATA_JWT" -F "network=$PIN_NETWORK")
while IFS= read -r rel; do
  [ -n "$rel" ] || continue
  ARGS+=(-F "file=@$DIST/$rel;filename=$rel")
done <<<"$FILES"
ARGS+=(-F "name=$DOMAIN landing")

RESP="$(curl "${ARGS[@]}" "$PIN_API_BASE$PIN_UPLOAD_ENDPOINT")"
REMOTE="$(jq -r '.data.cid // empty' <<<"$RESP")"
if [ -z "$REMOTE" ]; then
  echo "pin-remote: upload failed; response:" >&2
  printf '%s\n' "$RESP" >&2
  exit 1
fi

printf '%s\n' "$REMOTE" > "$REMOTE_CID_FILE"
echo "pin-remote: pinned $REMOTE via $PIN_PROVIDER ($(printf '%s\n' "$FILES" | wc -l | tr -d ' ') files)"
echo "pin-remote: remote CID recorded at $REMOTE_CID_FILE; dnslink.sh and check.sh will use it"