
# 11 — REST/GraphQL APIs (Sketch)

- `POST /api/ai/suggestions` → `{ section, locale, industry, keywords? }` → `[{ id, text, toneTag }]`
- `POST /api/jd/detect` → `{ text }` → `{ lang }`
- `POST /api/jd/keywords` → `{ text, lang }` → `{ keywords: string[] }`
- `POST /api/import/resume` → `multipart/form-data` file → `{ person, sections, meta }`
- `POST /api/import/linkedin` → file → `{ profile, sections }`
- `POST /api/checkout/create` → `{ plan:'pass14'|'monthly', currency }` → `{ url }`
- `POST /api/stripe/webhook`（签名验证）→ 更新订单、license 到期时间/订阅状态
