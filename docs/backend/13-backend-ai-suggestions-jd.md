
# 13 — AI Suggestions & JD Parsing

## Adapter Interface
```ts
interface AiSuggestionProvider {
  suggest(input: { section:string; locale:string; industry?:string; keywords?:string[] }): Promise<{id:string,text:string,toneTag:string}[]>;
}
```
- 默认实现：调用外部 LLM（Claude/OpenAI）；
- 可选：离线模板+关键词拼接（低成本 fallback）。

## JD Parsing
- `DetectLang`：规则 + 轻量模型（es/pt/fr/en）
- `ExtractKeywords`：停用词表 + 词频/TF-IDF + 行业词库（LATAM/FR-CA 扩展）
- 匹配度：`matchScore = overlap(keywords, resumeTokens)`
