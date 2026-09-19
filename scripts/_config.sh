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
CF_ZONE_ID="$(jq -r '.cloudflare.zoneId // empty' "$CONFIG")"
CF_DNSLINK_HOST="$(jq -r '.cloudflare.dnslinkHost // empty' "$CONFIG")"
CF_GATEWAY_HOST="$(jq -r '.cloudflare.gatewayHost // empty' "$CONFIG")"
CF_API_BASE="https://api.cloudflare.com/client/v4"

# Optional local secrets: a git-ignored env file under scripts/out/. If
# present it is sourced so CF_API_TOKEN never has to be pasted per-command.
CF_ENV="$ROOT/scripts/out/cf.env"
[ -f "$CF_ENV" ] && . "$CF_ENV"
CF_TOKEN_ENV="${CF_API_TOKEN:-}"

# Remote pinning provider (free tier default: Pinata). API + gateway bases and
# the upload endpoint live in scripts/config.json under "pinning".
DOMAIN="$(jq -r '.domain' "$CONFIG")"
PIN_PROVIDER="$(jq -r '.pinning.provider // empty' "$CONFIG")"
PIN_API_BASE="$(jq -r '.pinning.apiBase // empty' "$CONFIG")"
PIN_UPLOAD_ENDPOINT="$(jq -r '.pinning.uploadEndpoint // empty' "$CONFIG")"
PIN_NETWORK="$(jq -r '.pinning.network // "public"' "$CONFIG")"
PIN_GATEWAY_BASE="$(jq -r '.pinning.gatewayBase // empty' "$CONFIG")"
REMOTE_CID_FILE="$(dirname "$CID_FILE")/remote-cid.txt"

# Remote pinning secrets live in the same git-ignored place as cf.env.
PIN_ENV="$ROOT/scripts/out/remote.env"
[ -f "$PIN_ENV" ] && . "$PIN_ENV"
PINATA_JWT="${PINATA_JWT:-}"