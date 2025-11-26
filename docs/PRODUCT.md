# 产品规划（v2.6–v2.8 实装）

## 关键能力
1. **编辑器 + 左侧建议**
   - 行级 AI 建议（强动词/数字/字数/STAR/缺词注入）
   - 批量生成候选；一键替换
2. **JD 解析**
   - 自动语言检测（EN/FR/ES/PT）
   - 关键词、缺失关键词、风险提示
3. **导入**
   - PDF（pdf-parse）/ DOCX（mammoth）/ LinkedIn JSON
   - 自动填充 Profile（姓名/邮箱/电话/链接）+ 生成基础 blocks
4. **多语言与地区化**
   - Transloco 切换；长尾模板/范例（城市/行业/资历）
5. **商业化**
   - Stripe Checkout：一次性 14天 **$0.99**，月订阅 **$2.99**
   - 多币种（USD/CAD/EUR/MXN/ARS/CLP/BRL）
6. **SEO/SSR**
   - 预渲染助手：从 manifest 生成 routes（3/5 段）
7. **A/B 实验**
   - Paywall A/B/C 多变体（i18n 文案）
   - dataLayer 事件：`export_attempt`、`paywall_impression|cta_click`、`ai_suggest_*`

## 路线图（建议）
- v2.9：简历评分（ATS/Lexicon/读ability），导出 DOCX 模板主题；分享链接（只读）。
- v3.0：职位抓取 + 一键投递（合作集成）；团队版（导师/教务）。

## 合规与隐私
- 仅在用户明确导入时处理简历文档；默认本地处理提示，云端调用需 Consent。
- 支持用户删除数据；日志与埋点仅记匿名事件与语言/地区。
