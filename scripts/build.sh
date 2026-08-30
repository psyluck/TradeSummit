#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG="$ROOT/scripts/config.json"
IPFS_BIN="${IPFS:-ipfs}"

[ -f "$CONFIG" ] || { echo "build: no $CONFIG" >&2; exit 1; }
DIST="$ROOT/$(jq -r '.distDir' "$CONFIG")"
IPFS_REPO="$ROOT/$(jq -r '.ipfsRepo' "$CONFIG")"
CID_FILE="$ROOT/$(jq -r '.cidFile' "$CONFIG")"
LAST_CID="$(dirname "$CID_FILE")/last-cid.txt"

FORCE=0
for arg in "$@"; do
  case "$arg" in
    --force) FORCE=1 ;;
    *) echo "unknown option: $arg" >&2; exit 1 ;;
  esac
done

# Drift protection: refuse to publish anything but the committed tree unless forced
if [ "$FORCE" -ne 1 ] && [ -n "$(git -C "$ROOT" status --porcelain)" ]; then
  echo "refusing: working tree is not clean; commit the change or pass --force" >&2
  git -C "$ROOT" status --porcelain >&2 || true
  exit 1
fi

# Fresh staging each run so nothing stale survives
rm -rf "$DIST"
mkdir -p "$DIST"

# Stage the six shipped paths from the committed tree (scripts/ is tooling,
# never part of the package)
git -C "$ROOT" archive HEAD index.html styles.css main.js assets/logos | tar -x -C "$DIST"

EXPECTED="assets/logos/hyperliquid.svg
assets/logos/tradesummit-mark.svg
assets/logos/usdc.svg
index.html
main.js
styles.css"

# Preflight (a): staged set must be exactly the six shipped files
STAGED="$(cd "$DIST" && find . -type f | sort | sed 's|^\./||')"
if [ "$STAGED" != "$EXPECTED" ]; then
  echo "preflight failed: staged file set is not the six shipped files" >&2
  diff <(printf '%s\n' "$EXPECTED") <(printf '%s\n' "$STAGED") >&2 || true
  exit 1
fi

# Preflight (b): no absolute or protocol-slash asset references. Data fetch
# endpoints in main.js (CoinGecko/CoinCap) are runtime calls, not assets, and
# do not match src/href/url() so they are intentionally left alone.
ASSET_RE="(src|href)=[\"']?(https?:|//)|url\([\"']?(https?:|//)"
if grep -Ern "$ASSET_RE" --include='*.html' --include='*.css' --include='*.js' "$DIST"; then
  echo "preflight failed: absolute or protocol-slash asset reference found" >&2
  exit 1
fi

# Preflight (c): no untracked files outside scripts/ (would silently miss the
# package)
UNTRACKED="$(cd "$ROOT" && git status --porcelain | awk '$1 == "??" {print $2}')"
LEAK="$(printf '%s\n' "$UNTRACKED" | awk -F/ 'NF && $1 != "scripts" {print}')"
if [ -n "$LEAK" ]; then
  echo "preflight failed: untracked files outside scripts/ (commit or ignore them):" >&2
  printf '%s\n' "$LEAK" >&2
  exit 1
fi

# CID computation via kubo on a dedicated repo, so runs stay self-contained
if ! command -v "$IPFS_BIN" >/dev/null 2>&1; then
  echo "preflight failed: kubo not found (install with: omarchy pkg add kubo)" >&2
  exit 1
fi
if [ ! -d "$IPFS_REPO" ]; then
  mkdir -p "$IPFS_REPO"
  IPFS_PATH="$IPFS_REPO" "$IPFS_BIN" init --empty-repo >/dev/null 2>&1
fi
CID="$(IPFS_PATH="$IPFS_REPO" "$IPFS_BIN" add -r --quieter --cid-version=1 --hash=sha2-256 --pin=false "$DIST")"
printf '%s\n' "$CID" > "$CID_FILE"

# Drift guard against the last published CID; the first run just records it
if [ -f "$LAST_CID" ]; then
  LAST="$(cat "$LAST_CID")"
  if [ "$CID" != "$LAST" ] && [ "$FORCE" -ne 1 ]; then
    echo "refusing: CID drifted ($LAST -> $CID); commit the content or pass --force" >&2
    exit 1
  fi
fi
printf '%s\n' "$CID" > "$LAST_CID"

echo "ok: staged $(printf '%s\n' "$STAGED" | wc -l | tr -d ' ') files at $DIST, CID=$CID"