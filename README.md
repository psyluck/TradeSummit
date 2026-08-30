# TradeSummit

Decentralized, non-custodial trading platform built on Hyperliquid L1 and
settled exclusively in USDC.

- Execution on Hyperliquid's order book; trades and settlement are one atomic,
  verifiable operation with no custody in the middle
- Settlement exclusively in USDC, unified across chains
- A hard 10x leverage cap keeps the platform structurally conservative
- Landing site served from IPFS via an Unstoppable Domain (`tradesummit.crypto`)

## Repository

Phase 1 ships the static marketing landing page (no backend, no build step) and
its reproducible deploy pipeline. The site is plain HTML/CSS/JS so it stays
self-contained, dependency-free, and IPFS-deployable.

- `index.html`, `styles.css`, `main.js` - page, live market terminal, ticker
- `assets/logos/` - brand mark and partner logos
- `scripts/` - deploy tooling: build, publish, check, plus a UD runbook
- `AGENTS.md` - project and workflow conventions for AI agents

## Build, publish, check

Requires the kubo IPFS node (Arch package: `omarchy pkg add kubo`).

```sh
./scripts/build.sh    # stage the six shipped files, preflight, compute the CID
./scripts/publish.sh  # pin the CID into the local kubo repo
./scripts/check.sh    # fetch the CID from the local + public gateway (HTTP 200 + doctype)
```

The pipeline is reproducible: identical content produces an identical CID
`bafybeifgvydl3fhjswo64depqslyyzwxjmcx3hws4u2vmdlmuxm6s3pzom` on every run and
across a clean checkout. `scripts/out/` holds build output and the dedicated
kubo repo and is gitignored.

Deployment steps (Unstoppable Domain claim, IPFS record, resolution check) are
in `scripts/runbook-UD.md`; paid and account-based steps are marked manual.

## Roadmap

Phase 2 plans the platform core, all native Hyperliquid + USDC: a CCTP-based
USDC settlement rail, an actor-model Erlang WebSocket gateway, a type-safe
Haskell portfolio-margin risk core with the hard 10x cap, a low-latency Rust
execution and bridge layer, and signed order flow against Hyperliquid testnet
with verified fills.

## License

Proprietary. All rights reserved. See `LICENSE`.