
# 60 — Roadmap & Risks

## M1（本周）
- 前端壳、NGXS slices、Editor/Preview/StylePanel MVP
- Fastify 基础 + Stripe Checkout（USD/CAD）
- 前 20 条 SEO MDX 路由打样 + prerender

## M2（+2 周）
- LATAM/FR-CA 全量 100+ MDX
- AI suggestions v1（LLM 接入）+ 关键词词库
- 导入器（PDF/DOCX/LinkedIn）可用

## M3（+1 月）
- 多币种完整映射 + 成本监控
- e2e + 覆盖率门槛 + Sentry/OTel
- 推荐模板策略与个性化首选

## 风险
- 第三方 LLM 费用波动 → 提供本地模板 fallback
- Stripe 本地币种税费差异 → 监控退款率
- 导入器兼容性（PDF/Docx） → 提供手工修复路径
