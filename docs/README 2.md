# AlignCV — Unified Docs Site (Docusaurus)

## 目录结构
- `/docs`：完整模块化文档（可直接给 Claude code 用）
- `/docusaurus`：站点工程，已启用：分组侧边栏、主题自定义、Algolia DocSearch（占位）
- `.github/workflows`：部署与 PR 构建检查

## 本地预览
```bash
cd docusaurus
npm i
npm run start
```

## 生产构建
```bash
cd docusaurus
npm run build
# 产物在 docusaurus/build
```

## Vercel 自动部署（GitHub Actions）
配置仓库 Secrets：
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 启用 Algolia DocSearch
在 `docusaurus/docusaurus.config.ts` 替换：
```ts
algolia: {
  appId: 'YOUR_APP_ID',
  apiKey: 'YOUR_SEARCH_API_KEY',
  indexName: 'aligncv_docs',
  contextualSearch: true
}
```
并在 Algolia 后台爬取 `https://docs.aligncv.com`（或你的部署域名）。
