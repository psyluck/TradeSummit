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
- Build: none (static site)
- Production server: static hosting (IPFS, nginx, or CDN)
- Lint: none configured
- Format: none configured
- Tests: no unit test runner configured; the test gate is off

## Commit rules

- Use conventional commit messages (`feat:`, `fix:`, `chore:`)
- Keep commits focused (one change per commit)
- No AI attribution in commit messages