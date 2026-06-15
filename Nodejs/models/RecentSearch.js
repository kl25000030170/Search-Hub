const mongoose = require('mongoose');

const RecentSearchSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  keyword: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RecentSearch', RecentSearchSchema, 'recent_searches');
