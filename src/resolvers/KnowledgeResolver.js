const { KnowledgeModel } = require('../models');
const { validate } = require('CValidator');

const knowledgeResolver = {
  Query: {
    async knowledge(_, { _id }) {
      if (_id) {
        return KnowledgeModel.findById(_id).populate('author').exec();
      }
      return KnowledgeModel.find().populate('author').exec();
    },
  },
  Mutation: {
    async createKnowledge(_, { title, content, authorId }) {
      validate({ title, content, authorId }, {
        title: 'required',
        content: 'required',
        authorId: 'required|exists:users,_id',
      });

      const knowledge = new KnowledgeModel({
        title,
        content,
        author: authorId,
      });
      return knowledge.save();
    },
    async updateKnowledge(_, { _id, title, content }) {
      validate({ _id, title, content }, {
        _id: 'required|exists:knowledge,_id',
        title: 'required',
        content: 'required',
      });

      return KnowledgeModel.findByIdAndUpdate(_id, { title, content }, { new: true });
    },
    async deleteKnowledge(_, { _id }) {
      validate({ _id }, {
        _id: 'required|exists:knowledge,_id',
      });

      return KnowledgeModel.findByIdAndRemove(_id);
    },
  },
};

module.exports = knowledgeResolver;
