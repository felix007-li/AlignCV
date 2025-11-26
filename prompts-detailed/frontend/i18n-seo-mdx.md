# 前端 / i18n + SEO + MDX（prerender）

## 目标
- Locales: en, es-MX, es-AR, es-CL, pt-BR, fr-CA；MDX→JSON→prerender；路由 `/l/:locale/:kind/:sub/:slug`。

## 上下文（建议提供）
- docs/frontend/05-routing.md
- docs/frontend/06-i18n-seo.md
- docs/content/20-mdx-prerender.md

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
- frontmatter 必含 title/description/locale/industry/city/templateId/route；三段脚本闭环；合并而非覆盖 angular.json routes

## 交付物
- scripts/mdx-to-json.mjs
- scripts/generate-prerender-routes.mjs
- scripts/merge-prerender-routes.mjs

## 验收标准（AC）
- routes 生成正确且成功合并到 angular.json

## 自测命令
- `node scripts/mdx-to-json.mjs --in content --out dist-mdx/json --routes-out dist-mdx/prerender/routes.txt`
- `node scripts/generate-prerender-routes.mjs --in dist-mdx/json --out dist-mdx/prerender/routes.txt`
- `node scripts/merge-prerender-routes.mjs --routes dist-mdx/prerender/routes.txt --angular frontend/angular.json`

## 常见坑
- frontmatter 缺字段；覆盖 angular.json；routes 重复导致 prerender 失败

## 示例指令
```
make cc-i18n
```
