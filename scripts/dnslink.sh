#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/_config.sh"

if [ ! -f "$CID_FILE" ]; then
  echo "dnslink: no $CID_FILE; run ./scripts/build.sh first" >&2
  exit 1
fi
CID="$(cat "$CID_FILE")"
# Prefer the remote-pinned CID when present: pin-remote.sh uploads the package
# to the pinning service, making that CID publicly retrievable, so the DNSLink
# record (and therefore Cloudflare's gateway) must point at it, not the local
# kubo CID which is not reachable from the public network.
if [ -f "$REMOTE_CID_FILE" ] && [ -s "$REMOTE_CID_FILE" ]; then
  CID="$(cat "$REMOTE_CID_FILE")"
  echo "dnslink: using remote CID from $REMOTE_CID_FILE" >&2
fi

if [ -z "$CF_ZONE_ID" ]; then
  echo "dnslink: cloudflare.zoneId is empty in $CONFIG; fill it from the Cloudflare dashboard (domain overview)" >&2
  exit 1
fi
if [ -z "$CF_DNSLINK_HOST" ]; then
  echo "dnslink: cloudflare.dnslinkHost is empty in $CONFIG" >&2
  exit 1
fi
if [ -z "$CF_TOKEN_ENV" ]; then
  echo "dnslink: CF_API_TOKEN is not set; create a Cloudflare API token with Zone:DNS:Edit and export it" >&2
  exit 1
fi

RECORD_NAME="_dnslink.$CF_DNSLINK_HOST"
CONTENT="dnslink=/ipfs/$CID"
PROXIED="false"

api() {
  # api METHOD PATH [DATA]; inside, curl follows the CF v4 API
  local method="$1" path="$2" data="${3:-}"
  local args=(-sS --fail-with-body -X "$method")
  args+=(-H "Authorization: Bearer $CF_TOKEN_ENV")
  args+=(-H "Content-Type: application/json")
  args+=(--max-time 30)
  if [ -n "$data" ]; then
    args+=(-d "$data")
  fi
  curl "${args[@]}" "$CF_API_BASE$path"
}

LIST_OUT="$(api GET "/zones/$CF_ZONE_ID/dns_records?type=TXT&name=$RECORD_NAME")"
RECORD_ID="$(jq -r '.result[0].id // empty' <<<"$LIST_OUT")"

PAYLOAD="$(jq -n \
  --arg type "TXT" \
  --arg name "$RECORD_NAME" \
  --arg content "$CONTENT" \
  --arg ttl "120" \
  --arg proxied "$PROXIED" \
  '{type:$type,name:$name,content:$content,ttl:($ttl|tonumber),proxied:($proxied=="true")}')"

if [ -n "$RECORD_ID" ]; then
  api PUT "/zones/$CF_ZONE_ID/dns_records/$RECORD_ID" "$PAYLOAD" >/dev/null
  echo "dnslink: updated TXT $RECORD_NAME -> $CONTENT"
else
  api POST "/zones/$CF_ZONE_ID/dns_records" "$PAYLOAD" >/dev/null
  echo "dnslink: created TXT $RECORD_NAME -> $CONTENT"
fi

# Verify the record round-trips through the API
VERIFY="$(api GET "/zones/$CF_ZONE_ID/dns_records?type=TXT&name=$RECORD_NAME")"
VERIFIED="$(jq -r '.result[] | select(.content == $c) | .content' --arg c "$CONTENT" <<<"$VERIFY")"
if [ "$VERIFIED" != "$CONTENT" ]; then
  echo "dnslink: verification failed; expected content $CONTENT" >&2
  exit 1
fi
echo "dnslink: verified $CF_DNSLINK_HOST resolves to CID $CID"