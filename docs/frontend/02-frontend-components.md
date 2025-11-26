
# 02 — Frontend Components (by Feature)

## Shell
- **TopNav**：Home / Resume{Templates,Examples} / Cover Letter{Templates,Examples} / Pricing / FAQ / Dashboard(右侧)
- **DashboardShell**：左侧竖栏（Dashboard、Resume、CoverLetter、底部 Profile/Settings）

## Resume Editor
- **LeftEditor**：
  - Header Buttons：`Upload existing resume`、`Import from LinkedIn`
  - SectionList：Experience / Education / Skills / Projects / Summary / Links…
  - SectionItem：
    - RichText + Bullets
    - **AI Suggestions**：显示 3 张建议卡（Apply 按钮触发 `ApplySuggestion(sectionId, suggestionId)`）
- **PreviewPane**：1:1 画布（A4/Letter），从 `UiState` Token 渲染
- **StylePanel**（预览下方工具条单行拉条）：
  - Templates（缩略图切换模板，**内容保留**）
  - Font（族） / FontSize / LineHeight / Palette（主色）

## Cover Letter Editor
- 类似结构，减少段落类型。

## Templates Drawer
- Grid 缩略图（SVG），点击变更 `UiState.templateId` → `tokensToCssVars()` 应用到预览

## Internationalization
- 右上角 Locale 切换（`en`, `es-MX`, `es-AR`, `es-CL`, `pt-BR`, `fr-CA`），影响 UI 文案与默认行业关键词。
