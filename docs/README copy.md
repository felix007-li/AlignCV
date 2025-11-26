# AlignCV — Repo /docs + Docusaurus site (v1)

## 目录
- `/docs`：文档源（可直接给 Claude code 使用）
- `/docusaurus`：站点（读取上级目录的 `/docs`）
- `.github/workflows/deploy-docs-vercel.yml`：CI 部署

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
# 输出在 docusaurus/build
```

## Vercel 部署（通过 GitHub Actions）
在仓库 Settings → Secrets 配置：
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`（需与 Vercel 项目绑定）

推送到 main/master 或变更 docs/、docusaurus/ 即自动触发。

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
