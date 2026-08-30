# TradeSummit: Unstoppable Domains runbook

Serve the landing page from `tradesummit.crypto` on an Unstoppable Domain
(UD). The domain record points at the IPFS CID computed and published by the
scripts, so repointing it only takes a config change plus a manual record save
whenever the CID changes. Domain
`tradesummit.crypto`, gateway and CID paths all come from
[`scripts/config.json`](config.json); change them there, not in the scripts.

Steps that need money or an outside account are labeled **MANUAL (paid)** or
**MANUAL (account)**. Everything not labeled is local and automated by script.

## Prereqs

- kubo installed (`omarchy pkg add kubo`).
- `./scripts/build.sh` green (stages the six shipped files, preflight-checks,
  computes the CID).
- `./scripts/publish.sh` green (pins the CID into the local repo).
- `./scripts/check.sh` green (proves the CID serves from the local node
  gateway and the configured public gateway).
- The deployed CID is the single line printed by build, also kept in
  `scripts/out/cid.txt` (`cidFile` in config).

## 1. Claim the domain - MANUAL (paid)

- **MANUAL (paid)** Purchase `tradesummit.crypto` in the Unstoppable Domains
  marketplace (an account, wallet, and payment are required; no script can do
  this).
- **MANUAL (account)** Once owned, the domain appears under your UD account.
  You must keep the owner wallet that controls the domain, because the next
  step signs through it.

## 2. Point the IPFS record at the CID

- Run `./scripts/build.sh` and read the CID from `scripts/out/cid.txt`.
- **MANUAL (account)** In the UD dashboard open your domain, go to the
  "Website" or "IPFS" settings, paste the CID into the IPFS record, and save.
  Propagation takes minutes to hours.
- Why the record is manual: updating a UD record needs the owner wallet and
  account session. This step is not automatable without the user's credentials.

## 3. Verify resolution

- Pre-publish smoke, fully automated:
  - `./scripts/check.sh` fetches `/ipfs/<CID>/index.html` from the local node
    gateway and the public gateway in `scripts/config.json`, asserting HTTP 200
    plus the HTML doctype.
  - The public half only passes when the content is truly on the public IPFS
    network (your node online and advertising, or a pinning service holding the
    CID). A fresh local-only repo 504s that check by design, so run the daemon
    or pin away from the local-only sandbox before treating it as green.
- **MANUAL (account)** After the record propagates, open the domain in a
  browser that resolves `.crypto` natively (Unstoppable Browser) or with the
  UD browser extension, and confirm the page loads. That is the real
  end-to-end proof.
- Raw-content check independent of UD:
  - `curl https://<public gateway>/ipfs/<CID>/index.html` must return the
    TradeSummit page, matching the same bytes as `scripts/out/dist/index.html`
    (`cmp` returns 0).

## 4. Ship an update later

1. Commit the content change (the build drift guard refuses to publish an
   uncommitted tree).
2. `./scripts/build.sh` prints the new CID (it refuses to drift the CID unless
   the change is committed and the CID record updates).
3. `./scripts/publish.sh` pins the new CID.
4. **MANUAL (account)** Update the UD IPFS record to the new CID as in step 2.

## 5. Manual / account steps at a glance

| Step | Tooling | Manual? |
| ---- | ------- | ------- |
| Claim `tradesummit.crypto` | UD marketplace | MANUAL (paid) |
| Keep owner wallet | UD / wallet | MANUAL (account) |
| Save IPFS record = CID | UD dashboard | MANUAL (account) |
| Validate CID on public network | `./scripts/check.sh` | automated |
| Browse `.crypto` end-to-end | Unstoppable Browser / extension | MANUAL (account) |
| Repoint record after rebuild | UD dashboard | MANUAL (account) |

Note: remote pinning services (Pinata, Filebase) and UD's resolution API key
are Phase 2 optional extras; documented here only so they are on the radar,
not required for the record to work.