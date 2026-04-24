require('dotenv').config();
const express = require('express');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Allow requests from the Vite dev server
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.post('/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'text is required.' });
  }

  const prompt = `You are an AI assistant that analyzes stakeholder requests and converts them into structured business insights.

Return ONLY a valid JSON object with this structure:

{
  "category": "string",
  "key_issues": ["string"],
  "suggested_actions": ["string"]
}

Rules:
- Be specific and actionable
- Avoid generic terms like "improve" or "review"
- Suggested actions must be concrete steps a team can execute
- Keep responses concise
- No explanations
- Only valid JSON

Request:
"${text.trim()}"`;

  let parsed;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Groq error:', detail);
      return res.status(502).json({ error: 'OpenAI request failed.', detail });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? '';

    try {
      parsed = JSON.parse(raw);
    } catch {
      // Strip markdown fences the model sometimes adds
      const cleaned = raw.replace(/```json\s*/i, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    if (
      typeof parsed.category !== 'string' ||
      !Array.isArray(parsed.key_issues) ||
      !Array.isArray(parsed.suggested_actions)
    ) {
      return res.status(502).json({ error: 'Unexpected AI response structure.', raw });
    }
  } catch (err) {
    console.error('Analyze error:', err.message);
    return res.status(500).json({ error: 'Failed to analyze request.', detail: err.message });
  }

  const stmt = db.prepare(
    'INSERT INTO submissions (request_text, category, key_issues, suggested_actions) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(
    text.trim(),
    parsed.category,
    JSON.stringify(parsed.key_issues),
    JSON.stringify(parsed.suggested_actions)
  );

  res.json({
    id: result.lastInsertRowid,
    request_text: text.trim(),
    category: parsed.category,
    key_issues: parsed.key_issues,
    suggested_actions: parsed.suggested_actions,
    created_at: new Date().toISOString(),
  });
});

app.get('/submissions', (req, res) => {
  const rows = db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all();
  res.json(
    rows.map(r => ({
      ...r,
      key_issues: JSON.parse(r.key_issues),
      suggested_actions: JSON.parse(r.suggested_actions),
    }))
  );
});

app.listen(PORT, () => console.log(`API server → http://localhost:${PORT}`));
