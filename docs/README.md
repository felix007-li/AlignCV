# v2.7 Add‑ons — Bulk Content Generator + Paywall A/B (Angular)

## 一键打补丁（拷到你的现有 Angular 工程）
```bash
# 假设你的工程目录名为 aligncv
bash ./scripts/patch-into.sh aligncv
# 然后在工程内运行
cd aligncv
npm run dev
```

## 模板/范例批量生成器
- 脚本：`scripts/generate-content.js`
- 目标目录：`frontend/src/assets/content`
- 生成：`templates/<locale>/<city>/<role>.json` 与 `examples/...`，并更新 `manifest.json`
- 默认生成 ~120 条，可通过 `--count=` 调整

**用法：**
```bash
node scripts/generate-content.js ./frontend/src/assets/content --count=300
# 生成完后，Angular 可直接访问：
# /templates/<locale>/<city>/<role>
# /examples/<locale>/<city>/<role>
```

## 前端渲染内容页
- `ContentService` + `ContentPage` 会按路由加载对应 JSON 并以 `innerHTML` 渲染（已做安全绕过 UI）。

## 付费墙 A/B 多变体
- 组件：`paywall-dialog`，变体：A/B/C（标题、按钮文案、说明略有差异）
- 随机分配：`ABService`（`localStorage` 持久化），事件：
  - `paywall_impression`（展示）
  - `paywall_cta_click`（不同 CTA 点击）
  - 还沿用 `export_attempt`
- 集成位置：`EditorPage` 顶部 **Export** 按钮 → 打开付费墙

> 价格由 `PriceClient`（命中 `/api/prices?lang=...`）拉取；未配置 Stripe 时使用回退价位：$1.99 / $2.99 / $7.99。

## 注意
- 这是**增量包**。你可以先应用 v2.6 ULTRA，然后运行本补丁脚本；如无 v2.6，也可把 `src` 里的文件参考合并。

# v2.8 Add‑ons — i18n Paywall (A/B/C) + Industry/Seniority Content Generator

## 一键打补丁
```bash
# 假设你的工程目录名为 resume-suite
bash ./scripts/patch-into.sh resume-suite
cd resume-suite && npm run dev
```

## i18n 付费墙多变体
- 组件：`paywall-dialog` 改为使用 Transloco 文案：`paywall.variant.{A|B|C}.*`
- 合并脚本：`scripts/merge-i18n.js` 会把本包的 i18n 合并进 `src/assets/i18n/*.json`
- 语言覆盖：en-CA, fr-CA, es-MX, es-AR, es-CL, pt-BR（可按需继续扩）

## 模板/范例批量生成（含行业/资历维度）
- 脚本：`scripts/generate-content.js`
- 路径：`assets/content/{templates|examples}/{locale}/{city}/{role}/{industry}/{level}.json`
- Manifest：`assets/content/manifest.json` 含维度说明
- 路由访问：`/templates/:locale/:city/:role/:industry/:level`（兼容旧 3 段路径）

**用法示例：**
```bash
node scripts/generate-content.js ./src/assets/content --count=500 --industries=fintech,healthcare,retail --levels=junior,mid,senior
# 访问：/templates/en-CA/toronto/software-engineer/fintech/junior
```

> 注意：如你已做 SSR 预渲染，请在生成内容后重新跑 prerender。
