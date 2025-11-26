# 前端 / Editor + Preview + StylePanel

## 目标
- 左 Editor：每段 3 条 AI 建议卡片 + 顶部 Upload/LinkedIn；右 1:1 Preview；下方 StylePanel 单行 Toolbar（Templates/Font/Size/Line/Palette），切模板不改内容；路由 /app/resume/:id/editor 与 /app/cover-letter/:id/editor。

## 上下文（建议提供）
- docs/frontend/04-editor-wireframe.md
- docs/frontend/02-components.md

## 统一输出协议
```
仅输出以下两块：
FILES:
<相对路径>
```ext
<完整文件内容>
```
NOTES:
- <影响面/后续动作/注意事项>

```

## 约束
- 组件 standalone；Editor 导入 CommonModule/FormsModule；状态改动通过 NGXS；样式参数写入 CSS 变量

## 交付物
- src/app/ui/left-editor/left-editor.component.ts
- src/app/ui/preview-pane/preview-pane.component.ts
- src/app/ui/style-panel/style-panel.component.ts
- src/app/pages/editor.page.ts

## 验收标准（AC）
- 页面渲染无报错；Apply 建议能合并内容；样式变更实时反映在预览

## 自测命令
- `cd frontend && npm run build`
- `cd frontend && npm run start`

## 常见坑
- 忘记导入 Forms/CommonModule；StylePanel 与预览未绑定；切模板清空内容

## 示例指令
```
make cc-editor
```
