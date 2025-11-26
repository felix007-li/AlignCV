# AlignCV Navbar（含 Home）集成说明

- 新增 “Home” 菜单项，指向 `/`（用于介绍网站与制作简历/求职信流程）。
- Figma 线框新增：`home-how-it-works.svg`，包含 4 步流程示意。

## 步骤
1) 将 `angular/navbar/` 拷贝到项目（如 `src/app/shared/navbar/`）。
2) 在 `app.component.html` 放置：
```html
<aligncv-navbar></aligncv-navbar>
<router-outlet></router-outlet>
```
3) 确认根路由 `path: ''` 指向 Home 组件；或暂用占位组件。
4) Figma：导入 `figma/frames/*with-home*.svg` 与 `home-how-it-works.svg`。
