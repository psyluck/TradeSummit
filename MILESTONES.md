# MILESTONES

## M1 — Landing: Launch App redirect ships (2026-09-21)

- Artifact HEAD: f325dba (DNS leg appended to the gate)
- index.html:24  redirect anchor -> void(0)  (no scroll-jack)
- main.js: PROD_LAUNCH = https://app.tradesummit.online/  (wireLaunchApp wired)

- Repo-controlled legs: CHECKED (local, public, cloudflare gateways: HTTP 200, doctype, marker)
- DNS leg: app.tradesummit.online RESOLVES (CNAME live) — portal-created
- ORIGIN LEG: https://app.tradesummit.online/ -> HTTP 522  (NOT serving; no Pages custom-domain binding yet)  => GATE_EXIT=1
- Pinata: free-tier note only (CID pinned; reachable via other gateways)

- Status: redirect logic SHIPPED; end-to-end app delivery PENDING origin binding (portal-side).

