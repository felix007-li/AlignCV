
# 01 — Frontend Architecture (Angular + NGXS)

## Tech Stack
- Angular 17+（Standalone Components）
- NGXS（Slices：`auth` / `resume` / `jd` / `checkout` / `ui`）
- Tailwind（UI）
- Angular Router（SSR/Prerender就绪）
- HttpClient（后端 API、内容加载）

## High-level
```
[AppShell]
 ├─ TopNav (Home / Resume / Cover Letter / Pricing / FAQ + Dashboard CTA)
 └─ /app
    ├─ DashboardShell (LeftRail: Dashboard, Resume, CoverLetter, Profile)
    │   ├─ ResumeList / CoverLetterList
    │   └─ Recent Activity
    ├─ ResumeEditorPage (/app/resume/:id/editor)
    │   ├─ LeftEditor (sections + AI suggestions + Upload/Import buttons)
    │   ├─ PreviewPane (A4/Letter 1:1)
    │   └─ StylePanel (Templates, Font, FontSize, LineHeight, Palette)
    └─ CoverLetterEditorPage (/app/cover-letter/:id/editor)
```

## Data Flow (NGXS)
- `ResumeEditorState`：当前简历的 sections/selection/dirty/lastSaved
- `UiState`：当前模板 Token、字体/字号/行高/调色板、暗色模式
- `JdState`：简历/JD 语言检测、关键词提取、命中率
- `CheckoutState`：当前价格（$0.99/14d, $2.99/mo）、订单状态
- `AuthState`：用户、Plan、地区/locale

## Claude code 入口（生成代码）
- 参考 `03-frontend-ngxs-state.md` 与 `04-frontend-editor-wireframe.md` 的 Prompt 区块。
