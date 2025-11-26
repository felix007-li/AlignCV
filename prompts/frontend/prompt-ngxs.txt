# 前端 / NGXS 五切片（auth/resume/jd/checkout/ui）

## 目标
- 生成 5 个 slice：模型、actions、selectors、初始状态；resume 含 UpdateSection/ApplySuggestion/SelectSection；checkout 含 OpenCheckout/SetCheckoutUrl。

## 上下文（建议提供）
- docs/frontend/03-ngxs.md
- docs/frontend/02-components.md

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
- 纯函数 reducer；selectors 返回不可变值；Angular 17 standalone 结构；类型明确，无 any

## 交付物
- src/app/state/auth.state.ts
- src/app/state/resume.state.ts
- src/app/state/jd.state.ts
- src/app/state/checkout.state.ts
- src/app/state/ui.state.ts

## 验收标准（AC）
- `cd frontend && npm run typecheck` 通过；`ng build` 成功

## 自测命令
- `cd frontend && npm run typecheck`
- `cd frontend && npm run build`

## 常见坑
- 在 action 里做副作用；selectors 返回可变引用；忘记导出 actions

## 示例指令
```
make cc-ngxs
```
