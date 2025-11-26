
# 14 — Importers (Resume / LinkedIn)

- **ResumeImporter**：PDF/DOCX → PDFToText/DocxToJson → Sections
- **LinkedinImportService.importFromPdf**：先 stub，解析姓名/Headline/Experience/Education/Skills
- 字段标准化：`{ person, experience[], education[], projects[], skills[] }`
- 解析成功后：填充 `ResumeEditorState` 并触发预览刷新
