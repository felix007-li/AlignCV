
# 51 — Claude Code Prompts — Backend

## 生成 Fastify 服务骨架
```
你是资深 Node/Fastify 工程师。根据 docs/backend/10-backend-architecture.md 和 11/12/13/14，生成服务：
- /api/ai/suggestions
- /api/jd/detect, /api/jd/keywords
- /api/import/resume, /api/import/linkedin
- /api/checkout/create, /api/stripe/webhook
要求：TypeScript、zod 校验、winston 日志、错误处理中间件、Stripe 幂等键。
```
