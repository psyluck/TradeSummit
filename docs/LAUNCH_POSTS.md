# Launch posts

Ready-to-publish copy for the launch. Canonical URL: https://www.tradesummit.online
Tag @HyperliquidX on the posts that describe the venue so the thread reaches
their audience.

## X (Twitter) thread

Post in order as a single thread.

### 1

```
TradeSummit is live.

A non-custodial trading floor for digital assets: Hyperliquid order execution,
USDC settlement, and a verifiable risk core underneath.

Trade on a ledger you can trust.
https://www.tradesummit.online
```

### 2

```
No store of funds.

TradeSummit orchestrates and authorizes. Your keys sign, and you remain
custodian. The platform never holds what you own.
```

### 3

```
One transparent fee.

4.8 bps all-in taker fee at Hyperliquid's base tier: the 4.5 bps Hyperliquid
base plus a 0.3 bps TradeSummit builder fee. No deposit fees, no subscriptions,
no VIP tiers.

https://www.tradesummit.online/#pricing
```

### 4

```
Built on @HyperliquidX.

Orders match on Hyperliquid's on-chain L1 order book, settle atomically in
USDC, and carry a hard 30x leverage cap enforced by a type-safe risk core.
```

### 5

```
Ready to trade directly on Hyperliquid's order book?

Open the terminal and execute on an on-chain, deterministic L1.

https://www.tradesummit.online
```

## Discord

Post in the announcements channel.

```
@everyone TradeSummit is live.

A non-custodial trading floor for digital assets, built on Hyperliquid.

- Order execution on Hyperliquid's on-chain L1 order book
- USDC settlement, with trade and settlement as one atomic operation
- 4.8 bps all-in taker fee at the base tier: 4.5 bps Hyperliquid base plus a
  0.3 bps builder fee
- Hard 30x leverage cap, enforced by a verifiable risk core
- A provable audit trail: every state change is hash-linked and independently
  verifiable
- No store of funds: your keys sign, you remain custodian

No deposit fees, no subscriptions, no VIP tiers.

Open the terminal: https://www.tradesummit.online

Not investment advice. Digital asset trading involves risk.
```

## Telegram

Post in the main channel.

```
TradeSummit is live.

Non-custodial trading on Hyperliquid's on-chain order book, settled in USDC.

- 4.8 bps all-in taker fee (4.5 bps Hyperliquid base + 0.3 bps builder fee)
- Hard 30x leverage cap
- No store of funds: you remain custodian
- No deposit fees, no subscriptions, no VIP tiers

Open the terminal: https://www.tradesummit.online

Not investment advice. Digital asset trading involves risk.
```

## Checklist before posting

- Confirm https://www.tradesummit.online serves HTTP 200 and the link preview
  renders the Open Graph image and title (run `./scripts/check.sh`, then re-scrape
  the URL in the X composer).
- Confirm the pricing on `/#pricing` still reads 4.8 bps all-in (4.5 bps
  Hyperliquid base + 0.3 bps builder fee), matching `BUILDER_FEE_BPS = 3` in
  the terminal (`app/frontend/app/src/signing.ts`).
- Keep the five X posts a single thread; only the first post needs the link and
  the last post repeats the call to action.
- Tag @HyperliquidX once, in the post that describes the venue (post 4).
