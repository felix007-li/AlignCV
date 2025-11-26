# 技术栈与架构

## 前端（Angular + NGXS）
- **框架**：Angular（standalone components），Tailwind。
- **状态**：NGXS 切片 `auth/resume/profile/jd/checkout/ui`；StoragePlugin 持久化。
- **多语言**：@ngneat/transloco，语言记忆到 localStorage。
- **组件**：
  - `jd-suggest-advanced`（行级建议 + 批量）
  - `import-resume`（导入 PDF/DOCX/LinkedIn）
  - `paywall-dialog`（A/B/C + i18n 文案）
  - `profile-form`（左栏 Profile）
- **路由**：`/editor/:id`、`/pricing`、`/templates/...`、`/examples/...`（5 段含行业/资历）
- **SEO/SSR**：`ng add @angular/ssr` + prerender；路由由 `routes-from-manifest.js` 自动生成。

## 后端（Node/Express）
- **API**：
  - `/api/jd/analyze`：语言检测、关键词/缺词提取
  - `/api/ai/suggest`：调用 LLM（Claude/OpenAI），失败回退启发式
  - `/api/import/{pdf|docx|linkedin}`：导入解析 → Profile & Resume
  - `/api/prices`、`/api/checkout/session`、`/api/stripe/webhook`
- **第三方**：Stripe、Anthropic/OpenAI、pdf-parse、mammoth
- **部署**：前后端分离（Cloudflare Pages/Vercel + Fly/Render），或容器化。

## 事件埋点（dataLayer）
- `ai_suggest_open/generate/view/apply/bulk_generate/filter_change`
- `export_attempt`
- `paywall_impression/paywall_cta_click`

## 测试/质量
- 单元：Jest + Angular Testing Library（组件交互、状态）
- 合约：Supertest（/api）
- 端到端：Playwright（导入→建议→导出→付费墙）

## 安全
- Stripe Webhook 校验；输入校验与大小限制（PDF/DOCX ≤ 15MB）。
- LLM Key 仅在后端；前端不暴露密钥。
