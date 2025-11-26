# 后端 / Fastify + Stripe + AI/JD/Import

## 目标
- 路由：/api/ai/suggestions、/api/jd/*、/api/import/*、/api/checkout/create、/api/stripe/webhook；raw body 验签、价目映射、幂等键。

## 上下文（建议提供）
- docs/backend/10-arch.md
- docs/backend/11-apis.md
- docs/backend/12-stripe.md
- docs/backend/13-ai-jd.md
- docs/backend/14-importers.md

## 统一输出协议
```
仅输出以下两块：
FILES:
<相对路径>
```ext
<完整文件内容>
```
NOTES:
- <影响面/后续动作/注意事项>

```

## 约束
- zod 校验；`STRIPE_WEBHOOK_SKIP_VERIFY=1` 支持；统一错误结构

## 交付物
- src/billing/stripe.ts
- src/billing/checkout.controller.ts
- src/billing/webhook.controller.ts
- src/routes/ai.controller.ts
- src/routes/jd.controller.ts
- src/routes/import.controller.ts

## 验收标准（AC）
- 启动 OK；payments smoke 可过（或被跳过）；错误码一致

## 自测命令
- `cd backend && npm i && npm run start`
- `cd payments-tests && npm i && BACKEND_BASE_URL=http://127.0.0.1:8080 npm test`

## 常见坑
- 日志泄露 secret；webhook 未捕获异常；未设置 idempotency key

## 示例指令
```
make cc-backend
```
