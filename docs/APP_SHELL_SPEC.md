# AlignCV — App Shell (/app/*)

- 访问 `https://www.aligncv.com/app/home` 显示应用壳：上方 64px 顶栏 + 左侧 240px 竖直导航。
- 左侧导航：Dashboard / Resume / Cover Letter；底部为个人信息按钮（进入资料与账单）。
- 右侧为内容区：
  - /app/home：两张快捷卡片（Resume、Cover Letter），下方是 Recent items 列表。
  - /app/resume：左上“Create new resume”卡，下面是已编辑的 Resume 列表/网格。
  - /app/cover-letter：同上，展示 Cover Letter 列表。
- 与之前 Editor 线框兼容：网格/列表项点击进入具体编辑器（/dashboard/resume-editor/:id 亦可）。
