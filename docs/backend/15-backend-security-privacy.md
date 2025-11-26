
# 15 — Security & Privacy

- **PII**：最小化采集；上传文件仅用于解析，过期清理
- **Auth**：JWT + Refresh；重要操作服务端二次校验
- **Stripe**：Webhook 验签 + 幂等键
- **XSS**：Markdown 渲染统一走 DOMPurify（SSR/浏览器一致）
- **存储**：简历文本加密 at-rest（可选），访问控制按用户隔离
