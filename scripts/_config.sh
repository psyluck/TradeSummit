#!/usr/bin/env bash
# Shared config loader for the deploy scripts. Sourced, not executed; the lone
# owner of the scripts/config.json contract (paths + gateways).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG="$ROOT/scripts/config.json"
IPFS_BIN="${IPFS:-ipfs}"

[ -f "$CONFIG" ] || { echo "$0: no $CONFIG; deploy scripts need scripts/config.json" >&2; exit 1; }

DIST="$ROOT/$(jq -r '.distDir' "$CONFIG")"
IPFS_REPO="$ROOT/$(jq -r '.ipfsRepo' "$CONFIG")"
CID_FILE="$ROOT/$(jq -r '.cidFile' "$CONFIG")"
LAST_CID="$(dirname "$CID_FILE")/last-cid.txt"
LOCAL_GATEWAY="$(jq -r '.gateways.local' "$CONFIG")"
PUBLIC_GATEWAY="$(jq -r '.gateways.public' "$CONFIG")"