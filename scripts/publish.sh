#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/_config.sh"

if [ ! -f "$CID_FILE" ]; then
  echo "publish: no $CID_FILE; run ./scripts/build.sh first" >&2
  exit 1
fi
CID="$(cat "$CID_FILE")"
if ! command -v "$IPFS_BIN" >/dev/null 2>&1; then
  echo "publish: kubo not found (install with: omarchy pkg add kubo)" >&2
  exit 1
fi
if [ ! -d "$IPFS_REPO" ]; then
  echo "publish: no local repo at $IPFS_REPO; run ./scripts/build.sh first" >&2
  exit 1
fi

PINS="$(IPFS_PATH="$IPFS_REPO" "$IPFS_BIN" pin ls --type=recursive --quiet)"
if printf '%s\n' "$PINS" | grep -qx "$CID"; then
  echo "publish: $CID already pinned"
else
  IPFS_PATH="$IPFS_REPO" "$IPFS_BIN" pin add --recursive "$CID" >/dev/null
fi

echo "publish: pinned $CID"
IPFS_PATH="$IPFS_REPO" "$IPFS_BIN" pin ls