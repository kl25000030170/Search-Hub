const mongoose = require('mongoose');

const SearchLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  keyword: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: false,
    default: 'General'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: false
  },
  sessionId: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('SearchLog', SearchLogSchema, 'search_logs');
