# AlignCV — ALL-IN-ONE v3.1.3（离线完整版）
更新：2025-11-15 05:41

- 在 v3.1.2 基础上 **内置完整 prompts-detailed/**（可直接作为 Claude code 的上下文）。
- 保留并扩展 subagents（8 角色）与 Make 目标（cc-review-gate / cc-security / cc-e2e / cc-release-notes / cc-orchestrate-baton）。
- 自带最小可跑 FE（Angular 17 + NGXS）/ BE（Fastify + Stripe stub）与 CI/发布工作流。

## 快速开始
```bash
npm i
npm run dev  # 前后端并行（frontend:4200 / backend:8080）
```

## 常用 CC 目标
```bash
make cc-editor
make cc-ngxs
make cc-i18n
make cc-pricing
make cc-backend
make cc-mdx
make cc-checks
make cc-ship
# Subagents
make cc-review-gate
make cc-security
make cc-e2e
make cc-release-notes
make cc-orchestrate-baton
```
