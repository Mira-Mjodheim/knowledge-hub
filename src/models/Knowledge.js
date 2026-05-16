```javascript
const mongoose = require('mongoose');

const knowledgeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  categories: [
    {
      type: String,
      trim: true
    }
  ],
  tags: [
    {
      type: String,
      trim: true
    }
  ],
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

const Knowledge = mongoose.model('Knowledge', knowledgeSchema);

module.exports = Knowledge;
```