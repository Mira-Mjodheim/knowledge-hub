const { Knowledge } = require('../models');

const knowledgeResolver = {
  Query: {
    async knowledge(_, { id }) {
      return id
        ? Knowledge.findById(id).populate('createdBy').exec()
        : Knowledge.find().populate('createdBy').exec();
    },
    async knowledges() {
      return Knowledge.find().populate('createdBy').exec();
    },
  },
  Mutation: {
    async createKnowledge(_, { title, content, authorId }) {
      const knowledge = new Knowledge({
        title,
        content,
        createdBy: authorId,
      });
      const saved = await knowledge.save();
      return Knowledge.findById(saved._id).populate('createdBy').exec();
    },
    async updateKnowledge(_, { id, title, content }) {
      const updated = await Knowledge.findByIdAndUpdate(
        id,
        { title, content, updatedAt: new Date() },
        { new: true }
      ).populate('createdBy').exec();
      if (!updated) throw new Error('Connaissance non trouvée');
      return updated;
    },
    async deleteKnowledge(_, { id }) {
      const result = await Knowledge.findByIdAndDelete(id).exec();
      if (!result) throw new Error('Connaissance non trouvée');
      return true;
    },
  },
};

module.exports = knowledgeResolver;
