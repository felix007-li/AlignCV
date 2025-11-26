
# 40 — CI/CD Workflows

- GitHub Actions：
  - deploy-frontend-vercel.yml（Secrets 预检 + Vercel CLI）
  - deploy-backend-fly.yml（Secrets 预检 + flyctl）
  - pr-check.yml（lint+build 前后端）
- 可选：e2e.yml（Playwright）与 coverage 阈值
