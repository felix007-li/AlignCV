# 运维 / 预检（checks）

## 目标
- Prettier、类型检查、Angular 构建 smoke、（可选）Playwright；PR/Push 触发的 checks.yml。

## 上下文（建议提供）
- docs/ops/40-preflight.md

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
- 无 secrets 也能跑；E2E 可跳过或最小化

## 交付物
- .github/workflows/checks.yml
- tests/e2e/*（如需）
- playwright.config.ts（如需）

## 验收标准（AC）
- PR 检查通过；本地 format:check/tsc OK

## 自测命令
- `npm run format:check`
- `cd frontend && npm run typecheck`
- `cd backend && npm run typecheck`

## 常见坑
- 把外部服务强行跑在 PR；Playwright 缺浏览器依赖

## 示例指令
```
make cc-checks
```
