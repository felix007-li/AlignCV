
# 20 — MDX Content & Prerender

- 100+ 篇 MDX（`/content/<locale>/<kind>/<sub>/<slug>.mdx`），frontmatter 含：
  - `templateId`, `seo_route`, `route`（CTA → 编辑器）
- 脚本：`mdx-to-html.mjs`、`mdx-to-json.mjs`、`merge-prerender-routes.mjs`、`patch-universal.mjs`
- SEO 路由：`/l/:locale/:kind/:sub/:slug`

**Build**：
```bash
node scripts/mdx-to-json.mjs --in content --out dist-mdx/json
node scripts/merge-prerender-routes.mjs --routes dist-mdx/prerender/routes.txt --angular angular.json
ng run <project>:prerender
```
