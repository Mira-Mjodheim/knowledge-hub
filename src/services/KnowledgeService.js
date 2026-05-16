```javascript
const { Knowledge } = require('../models/Knowledge');
const { User } = require('../models/User');
const mongo = require('../db/mongo');

const resolvers = require('../resolvers/index');
const KnowledgeResolver = require('../resolvers/KnowledgeResolver');

const KnowledgeService = {
  async getAllKnowledges() {
    try {
      const knowledges = await Knowledge.find().populate('author', '_id name');
      return knowledges;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getKnowledgeById(id) {
    try {
      const knowledge = await Knowledge.findById(id).populate('author', '_id name');
      if (!knowledge) {
        throw new Error('Connaissance non trouvée');
      }
      return knowledge;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async createKnowledge(data) {
    try {
      const { title, description, content, author } = data;
      const knowledge = new Knowledge({ title, description, content, author });
      await knowledge.save();
      return knowledge;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async updateKnowledge(id, data) {
    try {
      const knowledge = await Knowledge.findByIdAndUpdate(id, data, { new: true });
      if (!knowledge) {
        throw new Error('Connaissance non trouvée');
      }
      return knowledge;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async deleteKnowledge(id) {
    try {
      await Knowledge.findByIdAndRemove(id);
      return { message: 'Connaissance supprimée avec succès' };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = KnowledgeService;
```