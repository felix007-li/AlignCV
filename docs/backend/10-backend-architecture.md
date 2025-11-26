
# 10 — Backend Architecture

## Tech Stack
- Node.js 20 + Fastify/Express（二选一）
- Stripe（Checkout + Webhooks，多币种）
- Storage：PostgreSQL（用户/档案/订单）、S3 兼容对象存储（导入文件）
- Auth：JWT（短期）+ Refresh Token；或接入 Auth provider

## Services
- **/api/ai/suggestions**：根据 section 与 JD 关键词生成 3 条建议（可接 Claude/OpenAI；留 Adapter 接口）
- **/api/jd/detect**、**/api/jd/keywords**：语言检测（es/pt/fr/en）与关键词提取（词库 + 统计）
- **/api/import/resume**：解析 PDF/DOCX（结构化）
- **/api/import/linkedin**：解析 LinkedIn PDF（stub）
- **/api/checkout/create**：根据计划（$0.00/14d、$2.99/mo）创建 Stripe Checkout Session
- **/api/stripe/webhook**：订单状态同步

## Modules
- `auth`, `resume`, `coverletter`, `billing`, `importer`, `jd`, `ai`
