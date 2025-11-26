
# 04 — Editor Wireframe & Behaviors

## 布局
- **导航栏**：左边是返回按钮，中间是用户名字的resume或cover letter，右边是语言选择和下载按钮
- **左**：Editor（上方有两个大的方形按钮按Upload existing resume和Import from LinkedIn，Section 卡片列出),各个sessions如personal details,profile,education,employment,skills,languages,courses,certificates,source attribution等，下方有可添加新sessions的按钮，以添加新sessions
- **右**：预览（1:1 A4/Letter）还原左边编辑器的内容
- **右预览下方工具条**：StylePanel（Templates / Font / Size / Line Height / Palette）

## 行为
- 切换模板：仅更新 `UiState.templateId` 与 CSS 变量；**内容不变**。
- 每个 Section 的 **AI suggestions (3)**：
  - `GetSuggestions(section)` 调用后端 `/api/ai/suggestions`；
  - 点击 `Apply` → 触发 NGXS `ApplySuggestion(sectionId)`，合并到文本或替换选区。
- “Upload existing resume”：接受 PDF/DOCX → `ImportService.parse(file)` 返回结构化字段，填充左侧与右侧预览。
- “Import from LinkedIn”：上传导出的 PDF → `LinkedinImportService.importFromPdf(file)`（stub）。
