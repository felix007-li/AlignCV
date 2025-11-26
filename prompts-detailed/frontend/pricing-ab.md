# 前端 / 定价 + Checkout + A/B

## 目标
- 价格：$0.00/14D、$2.99/月、学生$1.99；打点 checkout_open/checkout_success；A/B 变体影响文案。

## 上下文（建议提供）
- docs/quality/31-analytics-ab.md
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
- 错误处理与重试；副作用在 action 外部封装；记录 plan/currency/variant

## 交付物
- src/app/pages/pricing.page.ts
- src/app/state/checkout.state.ts

## 验收标准（AC）
- Stripe 跳转成功；埋点被触发；变体持久化

## 自测命令
- `cd frontend && npm run build`

## 常见坑
- 未校验返回体；变体未持久化；漏学生价

## 示例指令
```
make cc-pricing
```
