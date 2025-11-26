
# 12 — Stripe Payments (14-Day Pass $0.00, after Monthly $2.99)

## Price Mapping (multi-currency)
- pass14: USD 0.00 / CAD 0.00（示例）
- monthly: USD 2.99 / CAD 3.99 / MXN 59 / BRL 12.90 / CLP 2490 / ARS 2990（示例）

> 在 Stripe Dashboard 建立 `price_xxx`，在后端维护 `plan→currency→priceId` 映射。

## Checkout Flow
1. 前端选择计划与币种 → 调用 `/api/checkout/create`
2. 后端创建 Session（`mode: payment | subscription`）
3. 成功回调 → 前端进入 `success`，等待 Webhook 确认
4. Webhook `checkout.session.completed` / `invoice.paid` → 标记 license 或订阅 active

## Webhooks
- `checkout.session.completed`
- `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`
