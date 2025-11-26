
# 50 — Claude Code Prompts — Frontend

> 直接复制到 Claude code 执行。

## 生成 NGXS Slices（auth/resume/jd/checkout/ui）
```
你是资深 Angular/NGXS 工程师。根据 docs/frontend/03-frontend-ngxs-state.md 的模型，生成 5 个 slices 的 .ts 文件（actions/selectors/reducer），并写最小单测。
要求：Angular 17+ standalone；严格类型；actions 带 payload interface。
```
## 生成 Editor & StylePanel 组件
```
参照 docs/frontend/04-frontend-editor-wireframe.md，实现 LeftEditor/PreviewPane/StylePanel 三组件。
- LeftEditor: section 卡片 + AI suggestions(3) + Upload/LinkedIn 按钮。
- PreviewPane: 1:1 A4/Letter，tokensToCssVars 应用。
- StylePanel: 单行工具条：Templates/Font/FontSize/LineHeight/Palette。
```
