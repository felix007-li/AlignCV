# AlignCV App Shell 安装指南

1) 拷贝 `angular/app-shell` 与 `angular/pages/*` 到你的项目目录（如 `src/app/`）。
2) 将 `app.routes.ts.snippet.md` 中的路由合入你的路由表（确保启用 Standalone 组件）。
3) 在 `main.ts`/`app.config.ts` 使用 `provideRouter(routes)`（若尚未设置）。
4) 打开 `figma/frames/*.svg` 查看 /app/home、/app/resume、/app/cover-letter 的布局。
5) 后续可将列表数据接入 NGXS 或服务端 API，并把“New”按钮跳到模板选择器。

可选：为侧边栏加路由激活样式与权限守卫（如需登录）。
