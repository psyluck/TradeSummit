# TradeSummit: Cloudflare Pages runbook

Serve the landing page from `tradesummit.online` (apex) and
`www.tradesummit.online` over HTTPS using Cloudflare Pages (free tier). The
released package is uploaded once per deploy as a Pages deployment from the
publicly pinned CID staged by `scripts/build.sh`; the CID/IPFS layer stays the
canonical artifact (verifiable, immutable) while Pages does the serving.
Domain, zone, and hostnames all come from [`scripts/config.json`](config.json);
change them there, not in the scripts.

Steps that need money or an outside account are labeled **MANUAL (paid)** or
**MANUAL (account)**. Everything not labeled is local and automated by script.

## Prereqs

- Cloudflare account with the zone added (MANUAL account), verified ownership.
- `./scripts/build.sh` green (stages the seven shipped files, preflight-checks,
  computes the CID).
- `./scripts/publish.sh` green (pins the CID into the local repo).
- `scripts/config.json` has `cloudflare.zoneId` set and `CF_API_TOKEN` exported.
- For Pages deploys, a Pages-capable token: put `CF_PAGES_TOKEN='...'` in
  `scripts/out/cf.env` (git-ignored, mode 600) next to the existing
  `CF_API_TOKEN`.

Why Pages instead of the old plan: Cloudflare's Web3 IPFS gateway no longer
accepts new signups, and free public IPFS gateways (Pinata shared, dweb.link)
either rate-limit or refuse to serve HTML. Pages is free, first-party, and
serves the same `dist/` bytes over a clean HTTPS host.

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

## 1. Create the Pages project - one time

The Pages project is a direct-upload (non-git) project named after this repo
(`tradesummit-landing`), served at `tradesummit-landing.pages.dev`.

- `POST /accounts/{account_id}/pages/projects` with
  `{"name":"tradesummit-landing","production_branch":"main"}` using the
  `CF_PAGES_TOKEN`.
- The account id lives in the Pages token's scope; find it in the dashboard
  (Workers & Pages > account) or reuse the one in `scripts/out/cf.env`.

## 2. Deploy the staged package

Each release is an HTTP upload of the same bytes `build.sh` staged and the
same CID Pinata serves:

- `npx wrangler pages deploy scripts/out/dist --project-name tradesummit-landing
  --branch main` (needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`
  exported from `scripts/out/cf.env`). Wrangler owns the hashed-asset upload
  flow and prints the deployment URL, e.g.
  `https://de575b86.tradesummit-landing.pages.dev`.
- Requires the project from step 1 to already exist; wrangler creates it only
  if the name is free.
- The deploy updates the production deployment, so the `*.pages.dev` alias
  (`https://tradesummit-landing.pages.dev`) serves the new bytes immediately.

## 3. Attach custom domains - one time

- `POST /accounts/{account_id}/pages/projects/tradesummit-landing/domains` for
  each of `tradesummit.online` and `www.tradesummit.online`. Cloudflare
  validates ownership via HTTP and issues a Google cert automatically; the
  domain status moves `initializing -> active` in a minute or two.
- DNS records required (proxied, equivalent to a CNAME to the Pages project):
  only the zone's authoritative resolver matters, so a plain proxied CNAME from
  the hostname to `tradesummit-landing.pages.dev` (proxied + flattening, which
  Cloudflare supports on the apex) is what `check.sh` verifies. It replaces
  whatever parked/gateway records were on the hostname before:
  - `A tradesummit.online -> 2.57.91.91` (Hostinger parked) is replaced by the
    proxied CNAME/flattened apex record.
  - `CNAME www -> gateway.ipfs.io` (the old Web3-gateway pointer) is replaced by
    the Pages CNAME.
  - `TXT _dnslink.www...` and any leftover `_dnslink.tradesummit.online` are
    obsolete once Pages serves the content; the `dnslink.sh` record is kept only
    as the IPFS artifact pointer for pinning, not for serving.
- If a dashboard "Redirect Rule" or Page Rule still sends the apex to `www`,
  either keep it (apex -> www is fine) or delete it from
  "Rules > Redirect Rules" so both hostnames resolve to Pages directly.

## 4. Verify resolution

- `./scripts/check.sh` now treats the Cloudflare leg as a Pages origin: it
  fetches `https://www.tradesummit.online/index.html` (root path, not
  `/ipfs/<CID>/`, which Pages does not serve) and asserts HTTP 200, the HTML
  doctype, and the TradeSummit marker. The local + public IPFS legs still hit
  `/ipfs/<CID>/index.html` on the pinned content.
- Live end-to-end (after cert issuance):
  - `curl -sSL https://www.tradesummit.online/` and
    `curl -sSL https://tradesummit.online/` must both return the doctype-marker
    page, byte-identical to `scripts/out/dist/index.html` (`cmp` returns 0).
- The public IPFS gateway leg proves the CID is retrievable by anyone; the
  Pages leg proves the domain serves it.

## 5. Ship an update later

1. Commit the content change (the build drift guard refuses to publish an
   uncommitted tree).
2. `./scripts/build.sh` stages `dist/` and prints the CID (unchanged CID when
   content is unchanged).
3. `./scripts/publish.sh` pins the new CID locally; `./scripts/pin-remote.sh`
   uploads it to the pinning provider (remote CID recorded for checks).
4. `CF_API_TOKEN=... ./scripts/dnslink.sh` repoints the IPFS DNSLink TXT to the
   new CID (kept as the canonical IPFS pointer for pinning recovery).
5. `npx wrangler pages deploy scripts/out/dist --project-name tradesummit-landing
   --branch main` publishes the new bytes to the domain.
6. `./scripts/check.sh` verifies all three legs.

## 6. Manual / account steps at a glance

| Step | Tooling | Manual? |
| ---- | ------- | ------- |
| Move DNS to Cloudflare | Cloudflare + Hostinger | MANUAL (account) |
| Create the Pages project | REST API / dashboard | one time |
| Attach custom domains | REST API / dashboard | one time |
| DNS records on the zone | REST API / dashboard | one time |
| Deploy staged package | `npx wrangler pages deploy` | automated |
| Pin + DNSLink the CID | `./scripts/{publish,pin-remote,dnslink}.sh` | automated |
| Validate all legs | `./scripts/check.sh` | automated |
| Browse `.online` end-to-end | any browser | MANUAL (account) |
| Republish after rebuild | `npx wrangler pages deploy` | automated |

Note: Page Rules / Redirect Rules on the zone are the only remaining manual
DNS-adjacent step; nothing else needs the dashboard once the initial records
exist.