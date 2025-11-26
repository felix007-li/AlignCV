# Tracking Specs · 追踪规范 · Spécifications de suivi
_Last updated: 2025-11-16_

UTM: `utm_source=aff&utm_medium={network}&utm_campaign={partner_id}&aff_sub={click_id}`  
Postback JSON (first‑paid): `{ "event":"first_paid","partner_id":"...","click_id":"...","amount":2.99,"currency":"CAD","tx":"...","ts":"...ISO" }`

Stripe bridge (TypeScript) included with security notes (HMAC signing, idempotency by `tx`, IP allow‑list).
