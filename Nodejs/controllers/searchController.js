const mongoose = require('mongoose');
const SearchLog = require('../models/SearchLog');
const SearchHistory = require('../models/SearchHistory');
const RecentSearch = require('../models/RecentSearch');
const TrendingKeyword = require('../models/TrendingKeyword');
const PopularCategory = require('../models/PopularCategory');
const AdminAnalytics = require('../models/AdminAnalytics');

// POST /api/search
exports.logSearch = async (req, res) => {
  try {
    const { userId, email, keyword, category, sessionId } = req.body;

    if (!userId || !keyword) {
      return res.status(400).json({ error: 'userId and keyword are required' });
    }

    if (mongoose.connection.readyState !== 1) {
      console.warn('MongoDB not connected. Bypassing search logging.');
      return res.status(200).json({ message: 'Database disconnected, search logging bypassed' });
    }

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const cleanCategory = category || 'General';

    // 1. Store raw Search Log
    const searchLog = new SearchLog({
      userId,
      keyword,
      category: cleanCategory,
      ipAddress,
      sessionId
    });
    await searchLog.save();

    // 2. Store User Search History (if email is provided)
    const searchHistory = new SearchHistory({
      userId,
      email: email || 'anonymous@example.com',
      keyword,
      category: cleanCategory
    });
    await searchHistory.save();

    // 3. Upsert Recent Search (only keep the latest timestamp for a unique user+keyword combination)
    await RecentSearch.findOneAndUpdate(
      { userId, keyword },
      { timestamp: new Date() },
      { upsert: true, new: true }
    );

    // Limit recent searches count to 10 entries per user
    const userRecentCount = await RecentSearch.countDocuments({ userId });
    if (userRecentCount > 10) {
      const oldestRecents = await RecentSearch.find({ userId })
        .sort({ timestamp: 1 })
        .limit(userRecentCount - 10);
      const idsToDelete = oldestRecents.map(doc => doc._id);
      await RecentSearch.deleteMany({ _id: { $in: idsToDelete } });
    }

    // 4. Update Trending Keyword Count
    await TrendingKeyword.findOneAndUpdate(
      { keyword: keyword.trim() },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    // 5. Update Popular Category Count
    await PopularCategory.findOneAndUpdate(
      { category: cleanCategory.trim() },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    // 6. Update Aggregated Admin Analytics
    await updateAdminAnalytics();

    return res.status(201).json({
      message: 'Search logged successfully',
      log: searchLog
    });

  } catch (error) {
    console.error('Error logging search:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/search/history/:userId
exports.getSearchHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        history: [],
        searchCount: 0,
        frequentlySearched: []
      });
    }

    const history = await SearchHistory.find({ userId }).sort({ timestamp: -1 });
    const searchCount = await SearchHistory.countDocuments({ userId });

    // Aggregate frequently searched keywords for this user
    const frequentlySearched = await SearchHistory.aggregate([
      { $match: { userId } },
      { $group: { _id: '$keyword', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const formattedFrequent = frequentlySearched.map(item => ({
      keyword: item._id,
      count: item.count
    }));

    return res.status(200).json({
      history,
      searchCount,
      frequentlySearched: formattedFrequent
    });

  } catch (error) {
    console.error('Error fetching search history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/search/recent/:userId
exports.getRecentSearches = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json([]);
    }

    const recents = await RecentSearch.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit);

    return res.status(200).json(recents);

  } catch (error) {
    console.error('Error fetching recent searches:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/search/trending
exports.getTrendingKeywords = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json([]);
    }

    const trending = await TrendingKeyword.find().sort({ count: -1 }).limit(limit);
    return res.status(200).json(trending);
  } catch (error) {
    console.error('Error fetching trending keywords:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/search/categories
exports.getPopularCategories = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json([]);
    }

    const categories = await PopularCategory.find().sort({ count: -1 }).limit(limit);
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching popular categories:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/search/suggestions
exports.getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(200).json([]);
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json([]);
    }

    const prefix = q.trim();
    // Case-insensitive match for keywords starting with query
    const regex = new RegExp('^' + escapeRegex(prefix), 'i');

    const matches = await TrendingKeyword.find({ keyword: regex })
      .sort({ count: -1 })
      .limit(10);

    const suggestions = matches.map(m => m.keyword);
    return res.status(200).json(suggestions);

  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/search/history/:id
exports.deleteHistoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ message: 'Database disconnected, delete bypassed' });
    }

    const result = await SearchHistory.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Search history entry not found' });
    }

    return res.status(200).json({ message: 'Search history entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting history entry:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/search/history/user/:userId
exports.clearUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ message: 'Database disconnected, clear bypassed' });
    }

    await SearchHistory.deleteMany({ userId });
    await RecentSearch.deleteMany({ userId });

    return res.status(200).json({ message: 'All user search history cleared successfully' });
  } catch (error) {
    console.error('Error clearing user history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper: Update aggregated statistics for admin dashboard
async function updateAdminAnalytics() {
  try {
    const totalSearches = await SearchLog.countDocuments();
    
    // Count unique userIds from search history
    const uniqueUsersAgg = await SearchHistory.aggregate([
      { $group: { _id: '$userId' } },
      { $count: 'count' }
    ]);
    const totalUsers = uniqueUsersAgg.length > 0 ? uniqueUsersAgg[0].count : 0;

    // Get top trending keyword
    const topKeywordDoc = await TrendingKeyword.findOne().sort({ count: -1 });
    const topKeyword = topKeywordDoc ? topKeywordDoc.keyword : '';

    // Get top popular category
    const topCategoryDoc = await PopularCategory.findOne().sort({ count: -1 });
    const topCategory = topCategoryDoc ? topCategoryDoc.category : '';

    // Upsert the single admin analytics document
    await AdminAnalytics.findOneAndUpdate(
      {},
      {
        totalSearches,
        totalUsers,
        topKeyword,
        topCategory,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error('Failed to update admin analytics:', err);
  }
}

// Regex escape helper
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
