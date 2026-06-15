const mongoose = require('mongoose');

const AdminAnalyticsSchema = new mongoose.Schema({
  totalSearches: {
    type: Number,
    default: 0
  },
  totalUsers: {
    type: Number,
    default: 0
  },
  topKeyword: {
    type: String,
    default: ''
  },
  topCategory: {
    type: String,
    default: ''
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AdminAnalytics', AdminAnalyticsSchema, 'admin_analytics');
