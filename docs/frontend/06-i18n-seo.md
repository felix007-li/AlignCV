
# 06 — i18n & SEO

## Locales
- `en`, `es-MX`, `es-AR`, `es-CL`, `pt-BR`, `fr-CA`

## SEO 内容
- 使用 **MDX**（仅 Markdown 功能）生成城市×行业长尾；frontmatter 含 `templateId`、`seo_route`、`route`。

## Prerender
- 通过脚本把 `prerender/routes.txt` 合并入 `angular.json`。
- SSR/Prerender 后，保留 CTA 跳转到 `/app/.../new?template=...&locale=...`。
