// Minimal provider wrapper (Claude / OpenAI) using fetch (Node 18+). Return array of suggestions.
function buildPrompt(payload){
  const { text='', lang='en', keywords=[], missing=[], filters={} } = payload;
  const f = { ...{ requireNumber:true, requireVerb:true, wordMin:10, wordMax:22, star:false, injectMissingKeywords:true }, ...filters };
  return `Write 3 concise resume bullet variants in ${lang} for: "${text}".
- Begin with strong action verbs.
- Keep ${f.wordMin}-${f.wordMax} words.
- Include a number/metric if missing.
- If possible, include keywords: ${keywords.join(', ')}; and inject missing: ${missing.join(', ')}.
- Output as plain list, one per line, no extra commentary.`;
}
async function callClaude(prompt, key){
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-3-5-sonnet-latest', max_tokens: 300, messages: [{ role: 'user', content: prompt }] })
  });
  const data = await resp.json();
  const text = data?.content?.[0]?.text || '';
  return text.split(/\n+/).map(l=>l.replace(/^[-•]\s?/, '').trim()).filter(Boolean).slice(0,5);
}
async function callOpenAI(prompt, key){
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.6, max_tokens: 250 })
  });
  const data = await resp.json();
  const text = data?.choices?.[0]?.message?.content || '';
  return text.split(/\n+/).map(l=>l.replace(/^[-•]\s?/, '').trim()).filter(Boolean).slice(0,5);
}
exports.llmProviderSuggest = async function(provider, payload){
  try{
    const prompt = buildPrompt(payload);
    if(provider==='claude' && process.env.ANTHROPIC_API_KEY){ return await callClaude(prompt, process.env.ANTHROPIC_API_KEY); }
    if(provider==='openai' && process.env.OPENAI_API_KEY){ return await callOpenAI(prompt, process.env.OPENAI_API_KEY); }
    return null;
  }catch(e){ console.error('[llm] error', e.message); return null; }
};