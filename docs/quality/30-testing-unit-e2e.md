
# 30 — Testing (Unit / E2E)

## Unit
- 前端：组件/NGXS reducer/effects；`@angular/testing-library`
- 后端：Service/Controller；Mock Stripe/LLM/Importer

## E2E
- Playwright：
  - 路由：/ → /resume → /app/resume/:id/editor
  - 操作：导入 → AI 建议 → 应用 → 样式切换 → 结账跳转（mock）

## Gate in CI
- PR 必须通过：lint + unit + e2e-smoke
