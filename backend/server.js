const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/jd/analyze', (req, res) => {
  const jd = (req.body && req.body.jd) || '';
  const tokens = jd.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  const keywords = Array.from(new Set(tokens.filter(t => t.length > 3))).slice(0, 8);
  const result = {
    keywords,
    hard_skills: keywords.slice(0,3),
    soft_skills: ['communication','teamwork'],
    missing_keywords: ['leadership','impact'].filter(k => !keywords.includes(k)),
    risks: ['Avoid tables/columns; keep ATS‑safe formatting'],
    bullets: ['Led X to achieve Y by doing Z','Built A that reduced B by C%']
  };
  res.json(result);
});

app.post('/api/checkout/session', (req, res) => {
  const { type, priceId } = req.body || {};
  res.json({ url: `https://checkout.mock/redirect?type=${type}&price=${priceId}` });
});

app.post('/api/render', (req, res) => {
  const { resumeId, format } = req.body || {};
  res.json({ url: `https://download.mock/${resumeId}.${format || 'pdf'}` });
});

app.listen(8787, () => console.log('Stub backend on http://localhost:8787'));
