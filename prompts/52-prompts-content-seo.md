
# 52 — Claude Code Prompts — Content & SEO

## 生成 MDX 渲染器与 Prerender 脚本对接
```
基于 docs/content-seo/20-content-mdx-and-prerender.md，完成：
- mdx-to-json.mjs 集成到构建，按 locale/kind 切片
- Angular SSR 路由 /l/:locale/:kind/:sub/:slug 渲染前注入 frontmatter
- 将 routes.txt 合入 angular.json 的 prerender 配置
```
