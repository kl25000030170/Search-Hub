const mongoose = require('mongoose');

const TrendingKeywordSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('TrendingKeyword', TrendingKeywordSchema, 'trending_keywords');
