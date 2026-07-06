const Knowledge = require('../models/Knowledge');
const { embed, cosineSimilarity, suggestTags } = require('./embedding');

class KnowledgeService {
  /**
   * Create a knowledge entry with auto-generated embedding and tags.
   */
  async create({ title, content, description, createdBy }) {
    const combined = `${title}\n${description || ''}\n${content || ''}`.slice(0, 8000);

    const [embedding, tags] = await Promise.all([
      embed(combined),
      suggestTags(title, content || description || ''),
    ]);

    const entry = new Knowledge({
      title,
      content: content || '',
      description,
      embedding,
      tags: tags.length > 0 ? [...new Set(tags)] : undefined,
      createdBy,
    });

    return entry.save();
  }

  /**
   * Update a knowledge entry, regenerating embedding and tags.
   */
  async update(id, { title, content, description }) {
    const entry = await Knowledge.findById(id);
    if (!entry) return null;

    if (title !== undefined) entry.title = title;
    if (content !== undefined) entry.content = content;
    if (description !== undefined) entry.description = description;

    const combined = `${entry.title}\n${entry.description || ''}\n${entry.content || ''}`.slice(0, 8000);

    const [embedding, tags] = await Promise.all([
      embed(combined),
      suggestTags(entry.title, entry.content || entry.description || ''),
    ]);

    entry.embedding = embedding;
    if (tags.length > 0) entry.tags = [...new Set(tags)];
    entry.updatedAt = new Date();

    return entry.save();
  }

  /**
   * Semantic search: find entries most similar to query.
   */
  async search(query, { limit = 10, threshold = 0.2 } = {}) {
    if (!query || !query.trim()) return [];

    const queryVec = await embed(query);

    // Fetch all entries with embeddings
    const entries = await Knowledge.find({})
      .select('+embedding')
      .populate('createdBy', '_id username email')
      .lean();

    // Score by cosine similarity
    const scored = entries
      .filter(e => e.embedding && e.embedding.length > 0)
      .map(e => ({
        ...e,
        _score: cosineSimilarity(queryVec, e.embedding),
      }))
      .filter(e => e._score >= threshold)
      .sort((a, b) => b._score - a._score)
      .slice(0, limit);

    // Remove embedding from response (large vector)
    for (const e of scored) delete e.embedding;

    return scored;
  }

  /**
   * Get suggested tags for a title/content pair (without creating an entry).
   */
  async getSuggestedTags(title, content) {
    return suggestTags(title, content);
  }
}

module.exports = new KnowledgeService();
