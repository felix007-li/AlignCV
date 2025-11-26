
# 41 — Deploy & Runtime

## Frontend
- Vercel（SSR/Edge 或纯静态）
- 环境变量：API_BASE、STRIPE_PK、FEATURE_FLAGS

## Backend
- Fly.io（Docker）或任意容器平台；`fly.toml` 示例已提供
- 环境变量：`STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET`, `DATABASE_URL`, `S3_*`

## Domain
- aligncv.com / www.aligncv.com（前端）
- api.aligncv.com（后端）
