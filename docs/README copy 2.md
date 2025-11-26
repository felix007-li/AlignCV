# AlignCV — ALL-IN-ONE v3.1.1（CC 驱动 + 可运行 + 细化版 Prompts 并入）
更新：2025-11-15 05:11

在 v3.1 基础上合入 **prompts-detailed/**（示例级详细提示词），并更新 Makefile 的 `cc-*` 目标默认携带这些上下文。
同时保留可运行的 Angular + NGXS 前端、Fastify/Stripe 后端、CI 工作流与发布脚本。

## 快速开始
```bash
# 并行跑前后端
npm i
npm run dev    # frontend:4200 + backend:8080

# 或分别启动
cd frontend && npm i && npm run start
cd backend  && npm i && npm run start
```
## Claude code（CC）一键生成
```bash
make cc-ngxs      # 生成/更新 NGXS 五切片（含详细上下文）
make cc-editor    # 生成 Editor/Preview/StylePanel
make cc-i18n      # i18n + SEO + MDX + prerender
make cc-pricing   # 定价+A/B+Checkout
make cc-backend   # Fastify/Stripe/AI/JD/导入
make cc-mdx       # 80+ MDX + prerender 列表
make cc-checks    # 预检（prettier/tsc/e2e/actions）
make cc-ship      # 上架（ship 脚本 + release workflow）
```

详见：`RUNBOOK-CC-v1-PLUS.md`、`recipes/ccx-samples.md`
