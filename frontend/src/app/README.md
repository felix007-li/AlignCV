# AlignCV — MDX→HTML + Angular 渲染 + Prerender 注入（v1）

## 安装依赖
```bash
npm i gray-matter markdown-it
npm i -D fast-glob
```

## 批量转 HTML
```bash
node scripts/mdx-to-html.mjs --in content --out dist-mdx --manifest content/manifest.json
```

## 合并 prerender 路由
```bash
node scripts/merge-prerender-routes.mjs --routes dist-mdx/prerender/routes.txt --angular angular.json
```

## Angular 运行时渲染
- 复制到 `src/app/`：
  - `src/app/services/mdx-loader.service.ts`
  - `src/app/pipes/safe-html.pipe.ts`
  - `src/app/seo/seo-page.component.ts`
  - `src/app/seo/seo-page.component.html`
  1. ererer
- 路由：`{ path: 'l/:locale/:kind/:sub/:slug', loadComponent: () => import('./seo/seo-page.component').then(m => m.SeoPageComponent) }`
- 确保 `content/` 可被访问（assets 或后端静态路径）。

## package.json 建议追加
```json
{
  "devDependencies": {
    "fast-glob": "^3.3.2"
  },
  "dependencies": {
    "gray-matter": "^4.0.3",
    "markdown-it": "^14.1.0"
  },
  "scripts": {
    "mdx:html": "node scripts/mdx-to-html.mjs --in content --out dist-mdx --manifest content/manifest.json",
    "mdx:routes": "node scripts/merge-prerender-routes.mjs --routes dist-mdx/prerender/routes.txt --angular angular.json"
  }
}
```

## 一键流程
```bash
npm run mdx:html
npm run mdx:routes
# 然后执行 Angular 的 prerender（取决于你的配置）
```
