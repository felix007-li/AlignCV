
# 05 — Routing & Navigation

- `/` → Home（介绍流程）
- `/resume` → Landing（说明 + CTA）
  - `/resume/templates`、`/resume/examples`
- `/cover-letter` → Landing
  - `/cover-letter/templates`、`/cover-letter/examples`
- `/pricing`、`/faq`
- `/app/home` → App Shell（左侧竖栏：Dashboard / Resume / CoverLetter / bottom Profile）
  - `/app/resume/:id/editor`
  - `/app/cover-letter/:id/editor`
- `/l/:locale/:kind/:sub/:slug` → **SEO 静态页（MDX 渲染）**
