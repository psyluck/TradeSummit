# AGENTS.md

Instructions for AI coding agents working in this project.

## Project

TradeSummit - a single-page marketing site for a non-custodial trading app
powered by Hyperliquid (perpetual DEX) and settled in USDC. This
repository contains only the landing page: static HTML/CSS/JS, no framework,
no build step.

Goals: explain the product, build trust (non-custodial, security-focused,
institutional look), and capture waitlist signups. The page must stay
self-contained and relative-path-safe so it can deploy to IPFS and be served
from an Unstoppable Domain without a backend.

## Read for context

- `index.html` - page structure: hero, features, how-it-works, security,
  waitlist form, trustbar, footer
- `styles.css` - jade/winter-green dark theme driven by CSS custom properties
- `main.js` - live crypto ticker (CoinGecko primary, CoinCap fallback), the
  terminal panel clock, waitlist form handling, nav and scroll-reveal behavior
- `assets/logos/` - brand mark and partner SVG logos (Hyperliquid, USDC)

## Conventions

- Match the existing markup, naming, and tone; do not introduce build tooling
- Preserve the visual style: dark jade theme, restrained institutional look
- The ticker renders live prices with an offline snapshot fallback; keep that
  fallback working
- Keep every asset reference relative and every feature side-effect free so the
  site stays IPFS-deployable

## Commands

- Dev server: `python3 -m http.server 8000` (open http://localhost:8000)
- Build: `./scripts/build.sh` (stages the seven site paths from git HEAD, preflight-checks, computes IPFS CID, writes to `scripts/out/dist/`)
- Publish: `./scripts/publish.sh` (pins the CID into the local kubo repo and lists pins)
- Pin remote: `./scripts/pin-remote.sh` (uploads the staged package to the pinning provider, records the remote CID)
- DNSLink: `CF_API_TOKEN=... ./scripts/dnslink.sh` (upserts the `_dnslink.tradesummit.online` TXT record to the new CID; requires `cloudflare.zoneId` in `scripts/config.json`)
- Pages deploy: `CLOUDFLARE_API_TOKEN=$(grep CF_PAGES_TOKEN scripts/out/cf.env | cut -d= -f2) CLOUDFLARE_ACCOUNT_ID=... npx wrangler pages deploy scripts/out/dist --project-name tradesummit-landing --branch main` (publishes the dist to `tradesummit-landing.pages.dev`, wired to `tradesummit.online` and `www`)
- Check: `./scripts/check.sh` (requires `build` + `publish`; asserts HTTP 200 + doctype: local + public IPFS gateways on `/ipfs/<CID>/index.html`, Cloudflare leg on the Pages root `https://www.tradesummit.online/index.html`)
- Runbook: `scripts/runbook-Cloudflare.md` (Cloudflare zone, Pages project, custom domains, pinning + DNSLink; paid/account steps marked manual). Legacy UD path: `scripts/runbook-UD.md`
- Production server: Cloudflare Pages on `tradesummit.online` + `www` (free tier; the IPFS CID stays the canonical artifact, pinned to Pinata and DNSLink-recorded but no longer the serving mechanism); the legacy alias was Unstoppable Domains `tradesummit.crypto`
- Lint: none configured
- Format: none configured
- Tests: no unit test runner configured; the test gate is off
- Verify: `./scripts/check.sh`

## Commit rules

- Use conventional commit messages (`feat:`, `fix:`, `chore:`)
- Keep commits focused (one change per commit)
- No AI attribution in commit messages