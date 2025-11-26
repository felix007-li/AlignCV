# AlignCV — Editor Demo v2 (Upload + LinkedIn)

**新增**：左侧顶部两个长按钮 —— “Upload existing resume” 与 “Import LinkedIn profile (PDF)”。  
**数据流**：按钮 → 调用对应 Service → 派发 NGXS `ImportResumePayload` / `ImportLinkedIn` → 写入 `ResumeEditorState.sections` → 右侧预览即时更新。

## 快速集成
1. 复制 `angular/` 文件到你的 `src/app/`。
2. 保持 v1 的 NGXS 注册与路由 `/app/demo`。
3. 在你的 `Editor` 页面替换为本 v2 的 demo 页面或合并 `top-actions` 区域。

> 注意：导入服务为占位实现；上线时替换为你的后端解析/LinkedIn 导入逻辑。
