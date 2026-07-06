/**
 * Embedding & LLM service — calls DeepSeek API for semantic search and tag suggestions.
 */
const DEEPSEEK_BASE = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

let fetch;
try {
  fetch = require('node-fetch');
} catch {
  fetch = global.fetch; // Node 18+
}

/**
 * Generate an embedding vector for a text.
 * Returns an array of floats (typically 1536-dimensional).
 */
async function embed(text) {
  if (!DEEPSEEK_KEY) {
    // Fallback: lightweight bag-of-words embedding for dev without API key
    return bowEmbed(text);
  }

  const resp = await fetch(`${DEEPSEEK_BASE}/embeddings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      input: text.slice(0, 8000), // trim to token limit
    }),
  });

  if (!resp.ok) {
    console.warn('Embedding API failed, falling back to BoW');
    return bowEmbed(text);
  }

  const data = await resp.json();
  return data.data?.[0]?.embedding || bowEmbed(text);
}

/**
 * Fallback: simple bag-of-words embedding (256-dim).
 * Useful when no API key or API is down.
 */
function bowEmbed(text) {
  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 1);
  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;

  // Hash words into 256 dimensions
  const vec = new Array(256).fill(0);
  for (const [word, count] of Object.entries(freq)) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) hash = ((hash << 5) - hash + word.charCodeAt(i)) | 0;
    const idx = Math.abs(hash) % 256;
    vec[idx] += count;
  }

  // Normalize
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map(v => v / norm);
}

/**
 * Cosine similarity between two embedding vectors.
 */
function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

/**
 * Suggest tags for a knowledge entry using the LLM.
 */
async function suggestTags(title, content) {
  if (!DEEPSEEK_KEY) return [];

  const prompt = `Given this knowledge entry, suggest 3-5 relevant tags (lowercase, single words or short phrases). Return ONLY a JSON array of strings — no markdown, no explanation.

Title: ${title}
Content: ${content.slice(0, 1000)}

Example: ["machine-learning", "python", "nlp"]`;

  try {
    const resp = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'system', content: 'You return ONLY JSON arrays of tags. Never use markdown.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 100,
      }),
    });

    if (!resp.ok) return [];
    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content || '[]';
    // Handle markdown fences
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

module.exports = { embed, cosineSimilarity, suggestTags };
