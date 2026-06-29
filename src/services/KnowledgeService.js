const { Knowledge } = require('../models/Knowledge');

const KnowledgeService = {
  async getAllKnowledges() {
    const knowledges = await Knowledge.find().populate('createdBy', '_id username');
    return knowledges;
  },

  async getKnowledgeById(id) {
    const knowledge = await Knowledge.findById(id).populate('createdBy', '_id username');
    if (!knowledge) throw new Error('Connaissance non trouvée');
    return knowledge;
  },

  async createKnowledge(data) {
    const { title, description, categories, tags, createdBy } = data;
    const knowledge = new Knowledge({ title, description, categories, tags, createdBy });
    await knowledge.save();
    return knowledge;
  },

  async updateKnowledge(id, data) {
    const knowledge = await Knowledge.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
    if (!knowledge) throw new Error('Connaissance non trouvée');
    return knowledge;
  },

  async deleteKnowledge(id) {
    await Knowledge.findByIdAndDelete(id);
    return { message: 'Connaissance supprimée avec succès' };
  },
};

module.exports = KnowledgeService;
