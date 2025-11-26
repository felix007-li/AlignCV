# Server Examples — Stripe → Affiliate Postback
_Last updated: 2025-11-16_

## Run locally
```bash
pnpm add express stripe node-fetch@2 @types/express @types/node -D
# or npm i ...
export STRIPE_SECRET_KEY=sk_live_xxx
export STRIPE_WEBHOOK_SECRET=whsec_xxx
export AFF_POSTBACK_URL=https://api.aligncv.com/affiliates/postback
export AFF_POSTBACK_SECRET=aff_hmac_secret
ts-node server/examples/stripe-aff-postback.ts
```

## Metadata propagation
- Put `partner_id` / `click_id` into **Checkout Session** or **Subscription/Price line metadata**.
- We only send **first_paid**: `checkout.session.completed` (one‑time) and `invoice.payment_succeeded` where `billing_reason=subscription_create`.

## Security
- Sign body with HMAC SHA‑256 header `x-aff-signature`.
- Dedupe by `tx` id; for production use Redis/DB.
