# 8x Amazon rebuild

A rebuild of the Amazon.com storefront for the 8x 24-hour assignment.

- **Live link:** https://app-gray-nu-73.vercel.app
- **Repo:** https://github.com/Sanskriti0805/8x-amazon

Not affiliated with Amazon. No real orders, accounts, or payments — everything runs in the browser.

## What it does

A complete shopping flow, signed out or signed in:

- **Home** — category cards and a department grid
- **Search** (`/s`) — keyword + category search, filters (customer rating, brand, Prime), and sorting (featured, price, rating, most reviewed)
- **Product** (`/p/:id`) — gallery, color variants, price with list-price savings, quantity, Add to Cart / Buy Now
- **Cart** — quantity steppers, delete, free-shipping threshold, live subtotal
- **Checkout** — shipping address + test-card form with validation, order summary with tax and shipping
- **Confirmation** — order number, delivery estimate, itemized summary
- **Orders** — order history with "Buy it again"
- **Sign in / Create account** — local-only demo auth

State (cart, orders, user, address) persists in `localStorage`.

## Tech

Vite + React + TypeScript, React Router, plain CSS. No backend; a seeded catalog lives in `src/data/products.ts`.

## Run locally

```bash
cd app
npm install
npm run dev
```

Build: `npm run build` · Lint: `npm run lint`

## Scope

Built first: the core browse → cart → checkout → order path, because that is the product.
Left out: Prime, seller tools, returns, review posting, real payments and recommendations — deliberately, to keep the shopping flow polished within the time.

## Agent capture

Prompts and responses for this build are captured automatically to `.agent-logs/` via Claude Code hooks (`.claude/settings.json` → `.claude/hooks/capture.js`). See `CAPTURE-TEST.md`.
