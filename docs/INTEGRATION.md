# Integrate the Demo into your Angular app

1) 运行我给的初始化脚本创建工程（或用你现有的 Angular 18 工程）。
2) 将 `/frontend/src/app/**` 合并到你的 `src/app/` 中（覆盖同名文件）。
3) 确保已安装：`@ngxs/store @ngxs/storage-plugin @ngxs/logger-plugin @angular/cdk @angular/material`。
4) 在 `main.ts` 使用 `bootstrapApplication(AppComponent, appConfig)`，并使用本包的 `app.config.ts` 与 `app.routes.ts`。
5) 启动后端桩：
```bash
cd backend
npm i
npm start  # http://localhost:8787
```
6) 前端代理（可选）：在 Angular `proxy.conf.json` 中将 `/api/*` 代理到 `http://localhost:8787`。

现在访问 `/editor/demo`，点 **Export** 会弹出 $1.99 学生弹窗；选择价格后会调用 `CheckoutState` 并显示 mock URL。
