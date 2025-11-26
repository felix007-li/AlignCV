# 运维 / 上架（ship）

## 目标
- ship/：env-check.sh、version-bump.mjs、release-notes.md、rollback.md；Actions：release.yml（手动触发）。

## 上下文（建议提供）
- docs/ops/50-ship.md
- docs/backend/12-stripe.md

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
- 严格 env 校验；显式失败提示；回滚文档完善

## 交付物
- ship/env-check.sh
- ship/version-bump.mjs
- ship/release-notes.md
- ship/rollback.md
- .github/workflows/release.yml

## 验收标准（AC）
- 缺环境即失败并列出变量名；build-all 成功；打 tag + Release 成功

## 自测命令
- `bash ship/env-check.sh`

## 常见坑
- 把 release 绑定 push 导致频繁发版；没有回滚说明

## 示例指令
```
make cc-ship
```
