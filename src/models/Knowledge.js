const mongoose = require('mongoose');

const knowledgeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    trim: true
  },
  categories: [{ type: String, trim: true }],
  tags: [{ type: String, trim: true }],
  embedding: {
    type: [Number],
    default: undefined,
    select: false // don't return in normal queries (large vectors)
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Text index for hybrid search (semantic + text)
knowledgeSchema.index({ title: 'text', content: 'text', description: 'text' });

const Knowledge = mongoose.model('Knowledge', knowledgeSchema);

module.exports = Knowledge;
