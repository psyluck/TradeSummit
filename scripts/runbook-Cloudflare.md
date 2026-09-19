# TradeSummit: Cloudflare DNSLink runbook

Serve the landing page from `tradesummit.online` over HTTPS using Cloudflare's
IPFS gateway. The domain resolves through Cloudflare's edge to the CID pinned
by `scripts/publish.sh`, so repointing it only takes a config file plus the
post-publish step updating a DNS record. Domain, zone, and gateway hostnames
all come from [`scripts/config.json`](config.json); change them there, not in
the scripts.

Steps that need money or an outside account are labeled **MANUAL (paid)** or
**MANUAL (account)**. Everything not labeled is local and automated by script.

## Prereqs

- Cloudflare account with the zone added (MANUAL account), verified ownership.
- `./scripts/build.sh` green (stages the six shipped files, preflight-checks,
  computes the CID).
- `./scripts/publish.sh` green (pins the CID into the local repo).
- `scripts/config.json` has `cloudflare.zoneId` set and `CF_API_TOKEN` exported.

## 0. Move DNS to Cloudflare - MANUAL (account)

- **MANUAL (account)** Register `tradesummit.online` at Hostinger (already
  owned; this runbook assumes it).
- **MANUAL (account)** In Cloudflare, add the site `tradesummit.online`. Follow
  the onboarding: Cloudflare shows two nameservers (for example
  `ada.ns.cloudflare.com` / `noah.ns.cloudflare.com`).
- **MANUAL (account)** In the Hostinger DNS panel, replace the default
  nameservers with the two from Cloudflare, and save. Propagation takes minutes
  to hours.
- **MANUAL (account)** Back in Cloudflare, wait for the "active" status
  (their onboarding polls for it). Once active, find the zone id on the domain
  overview page and write it into `cloudflare.zoneId` in
  `scripts/config.json`.

## 1. Register the DNSLink record - MANUAL (account), one time

Cloudflare's IPFS gateway reads the `_dnslink.<host>` TXT record in the zone
to learn which CID to serve. Record it once; every subsequent deploy updates
it via the automated step.

- **MANUAL (account)** In the Cloudflare dashboard open the zone, go to
  "DNS > Records" and add:
  - Type: `TXT`
  - Name: `_dnslink` (Cloudflare appends the zone so it becomes
    `_dnslink.tradesummit.online`)
  - Content: `dnslink=/ipfs/<CID>` with the CID from `scripts/out/cid.txt`
  - TTL: `Auto` (the automated step below sets 120; either is fine, the deploy
    step overwrites it)

Alternatively, run `./scripts/dnslink.sh` once with the zone id and token set;
it creates the record if missing. Either path ends with the TXT record present.

## 2. Create the IPFS gateway - MANUAL (account), one time

- **MANUAL (account)** In the Cloudflare dashboard open the zone, go to
  "Web3", click Create Gateway:
  - Hostname: `www.tradesummit.online` (a subdomain of the zone; the apex can
    forward to it)
  - Type: IPFS
  - DNSLink: `/ipns/tradesummit.online` points the gateway at the DNSLink
    record above. (If you set this to a bare `/ipfs/<CID>` the gateway serves
    that CID directly and ignores the TXT record; use the `/ipns/` form so the
    TXT record drives which CID is served.)
- This creates a proxied `CNAME` to `ipfs.cloudflare.com` plus the TXT record
  expected by the gateway.

## 3. Point the apex at the gateway - MANUAL (account), one time

- **MANUAL (account)** In the Cloudflare "Rules > Redirect Rules" (or the
  classic "Forwarding URL" Page Rule):
  - From: `tradesummit.online/*`
  - To: `https://www.tradesummit.online$1` (301 permanent)
- Alternatively point the apex directly at the gateway with a proxied
  `CNAME`-flattened record; the redirect keeps the URL on the `www` hostname.

### 3.5 Pin the package to a free pinning service (required for public checks)

The local kubo pin is on a private node: not reachable from Cloudflare's edge
or public gateways, so serving `_dnslink` would 404. `./scripts/pin-remote.sh`
uploads the staged package to the free Pinata tier, making its CID publicly
retrievable. That remote CID becomes the canonical published CID used by
`dnslink.sh` and the public legs of `check.sh`; the local pin stays for
recovery.

- **MANUAL (account)** Create a free Pinata account, generate an API key with
  the `pinFileToIPFS` permission, and copy the JWT.
- Store it locally, never in git: put `PINATA_JWT='...'` in
  `scripts/out/remote.env` (git-ignored, mode 600).
- `./scripts/pin-remote.sh` uploads and records the remote CID at
  `scripts/out/remote-cid.txt`.
- `./scripts/dnslink.sh` and `./scripts/check.sh` prefer the remote CID when
  present.

## 4. Verify resolution

- Pre-publish smoke, fully automated:
  - `./scripts/check.sh` fetches `/ipfs/<CID>/index.html` from the local node
    gateway and the public gateway in `scripts/config.json`, asserting HTTP 200
    plus the HTML doctype.
- **MANUAL (account)** After the record propagates, open
  `https://www.tradesummit.online` in a normal browser and confirm the page
  loads. That is the real end-to-end proof.
- Raw-content check independent of the gateway:
  - `curl https://www.tradesummit.online/index.html` must return the
    TradeSummit page, matching the same bytes as `scripts/out/dist/index.html`
    (`cmp` returns 0).

## 5. Ship an update later

1. Commit the content change (the build drift guard refuses to publish an
   uncommitted tree).
2. `./scripts/build.sh` prints the new CID (it refuses to drift the CID unless
   the change is committed and the DNSLink updates).
3. `./scripts/publish.sh` pins the new CID.
4. `CF_API_TOKEN=... ./scripts/dnslink.sh` updates the TXT record to the new
   CID. The gateway serves the new content without further steps.

## 6. Manual / account steps at a glance

| Step | Tooling | Manual? |
| ---- | ------- | ------- |
| Move DNS to Cloudflare | Cloudflare + Hostinger | MANUAL (account) |
| Register the DNSLink TXT record | Cloudflare dashboard or `./scripts/dnslink.sh` | one time |
| Create the IPFS gateway | Cloudflare Web3 dashboard | MANUAL (account) |
| Apex redirect | Cloudflare Rules | MANUAL (account) |
| Validate CID on local + public network | `./scripts/check.sh` | automated |
| Browse `.online` end-to-end | any browser | MANUAL (account) |
| Repoint record after rebuild | `./scripts/dnslink.sh` | automated |

Note: remote pinning services (Pinata, Filebase) are optional extras; the local
kubo node and Cloudflare's gateway are enough for the record to work.