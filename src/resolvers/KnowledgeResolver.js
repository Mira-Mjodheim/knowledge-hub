const { Knowledge } = require('../models');
const knowledgeService = require('../services/KnowledgeService');

const knowledgeResolver = {
  Query: {
    async knowledge(_, { id }) {
      return id
        ? Knowledge.findById(id).populate('createdBy').exec()
        : Knowledge.find().populate('createdBy').sort('-createdAt').exec();
    },
    async knowledges() {
      return Knowledge.find().populate('createdBy').sort('-createdAt').exec();
    },
    async searchKnowledge(_, { query, limit, threshold }) {
      return knowledgeService.search(query, { limit, threshold });
    },
    async suggestTags(_, { title, content }) {
      return knowledgeService.getSuggestedTags(title, content);
    },
  },
  Knowledge: {
    relevance: (parent) => parent._score || null,
  },
  Mutation: {
    async createKnowledge(_, { title, content, description, authorId }) {
      return knowledgeService.create({ title, content, description, createdBy: authorId });
    },
    async updateKnowledge(_, { id, title, content, description }) {
      return knowledgeService.update(id, { title, content, description });
    },
    async deleteKnowledge(_, { id }) {
      const result = await Knowledge.findByIdAndDelete(id).exec();
      if (!result) throw new Error('Connaissance non trouvée');
      return true;
    },
  },
};

module.exports = knowledgeResolver;
