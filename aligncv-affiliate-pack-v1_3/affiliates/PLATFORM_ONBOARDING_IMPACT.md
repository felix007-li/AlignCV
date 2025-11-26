# Impact Onboarding — 三语配置清单 (EN / 中文 / FR‑CA)
_Last updated: 2025-11-16_

## EN — Setup
- **Contract**: 30% CPS on first paid; cookie 30d; last‑click
- **Event type**: `first_paid`
- **Tracking**:
  - **S2S Postback** (recommended): send JSON to `{'ADV_POSTBACK_URL': 'https://api.aligncv.com/affiliates/postback'}`
  - Include: `partner_id`, `click_id`, `amount`, `currency`, `tx`, `ts`
  - Sign with HMAC (shared secret); add header `x-aff-signature`
- **Validation**: dedupe by `tx`, reverse commissions on refunds/chargebacks/fraud (90d)

## 中文 — 设置
合约：**首笔 30%**，Cookie 30 天，最后点击；事件：`first_paid`；追踪：**服务端回传**（推荐），带 `partner_id/click_id/amount/currency/tx/ts` 与 HMAC 签名；按 `tx` 去重；退款/拒付/作弊 90 天内冲销。

## FR‑CA — Paramètres
Contrat 30 % première transaction; cookie 30 j; dernier clic. Suivi : postback serveur (HMAC), dédoublonnage par `tx`, réversions sous 90 j.
