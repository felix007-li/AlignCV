# AlignCV — Angular Universal + Security + Precompile Pipeline (v1)

## 包含内容
- 两套 SSR 服务器模板：
  - `server-express-universal.ts`（适用于 Angular ≤16 的 @nguniversal/express-engine）
  - `server-ssr.ts`（适用于 Angular ≥17 的 @angular/ssr CommonEngine）
- SSR/浏览器通用的 **SafeMarkdownService**（DOMPurify 高净化 + highlight.js 高亮 + anchors/footnotes/外链属性）
- **MDX 预编译**脚本：将 `content/**/*.mdx` 生成 **locale/kind 切片 JSON**（含 `html` 与 `frontmatter`）
- **angular.json 补丁**脚本：自动添加 `server` 与 `prerender` 目标
- 更新版 **SEO 页**组件，直接使用安全渲染服务

## 安装依赖
```bash
npm i @nguniversal/express-engine express @angular/ssr
npm i dompurify isomorphic-dompurify jsdom highlight.js markdown-it markdown-it-anchor markdown-it-footnote markdown-it-link-attributes
npm i -D fast-glob gray-matter
```

## 预编译（推荐用于 SEO 大量页面）
```bash
node scripts/mdx-to-json.mjs --in content --out dist-mdx/json
# 输出 dist-mdx/json/<locale>/<kind>.json
```

## Angular Universal 接入
```bash
# 自动补齐 angular.json 的 server/prerender 目标
node scripts/patch-universal.mjs --angular angular.json --project <你的项目名>

# 常见构建流程
ng build --configuration=production
ng run <project>:server:production
ng run <project>:prerender
```

## 使用 SafeMarkdownService（运行时渲染）
- 复制文件到你的 `src/app/` 路径：
  - `src/app/services/safe-markdown.service.ts`
  - `src/app/seo/seo-page.component.ts`
  - `src/app/seo/seo-page.component.html`
- 引入全局样式（示例）
```css
@import 'highlight.js/styles/github.css';
```
