
# AlignCV — Architecture & Runbooks (Unified Docs)
_Last updated: 2025-11-14 04:24_

使用左侧侧边栏浏览模块化文档；也可直接把各模块 MD 交给 **Claude code** 生成代码。

deploy-docs-vercel.yml：当 docs/ 或 docusaurus/ 变化时自动构建并部署到 Vercel；也可手动触发。

docs-build-check.yml：PR 构建校验（确保文档能成功 npm run build），防止坏的改动进主分支。

启用步骤（一次性）

在 GitHub 仓库 Settings → Secrets and variables → Actions 新建三个机密：

VERCEL_TOKEN

VERCEL_ORG_ID

VERCEL_PROJECT_ID

把上面的 yml 放到：.github/workflows/

推到 main/master 或开 PR，就会自动跑。
