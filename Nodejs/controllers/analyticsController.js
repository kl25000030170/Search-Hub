const mongoose = require('mongoose');
const SearchLog = require('../models/SearchLog');
const SearchHistory = require('../models/SearchHistory');
const TrendingKeyword = require('../models/TrendingKeyword');
const PopularCategory = require('../models/PopularCategory');
const AdminAnalytics = require('../models/AdminAnalytics');

// GET /api/admin/dashboard
exports.getAdminDashboard = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        totalSearches: 0,
        todaysSearches: 0,
        mostActiveUser: 'N/A',
        mostPopularCategory: 'N/A',
        mostSearchedKeyword: 'N/A',
        topTrendingSearches: [],
        recentActivity: [],
        popularCategories: [],
        searchTrends: []
      });
    }

    // 1. Total Searches
    const totalSearches = await SearchLog.countDocuments();

    // 2. Today's Searches
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todaysSearches = await SearchLog.countDocuments({
      timestamp: { $gte: startOfToday }
    });

    // 3. Most Active User
    const activeUserAgg = await SearchLog.aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    let mostActiveUser = 'N/A';
    if (activeUserAgg.length > 0) {
      const activeUserId = activeUserAgg[0]._id;
      // Find the email for this userId from SearchHistory
      const historyDoc = await SearchHistory.findOne({ userId: activeUserId });
      mostActiveUser = historyDoc ? historyDoc.email : `User ID: ${activeUserId}`;
    }

    // 4. Most Popular Category
    const topCategoryDoc = await PopularCategory.findOne().sort({ count: -1 });
    const mostPopularCategory = topCategoryDoc ? topCategoryDoc.category : 'N/A';

    // 5. Most Searched Keyword
    const topKeywordDoc = await TrendingKeyword.findOne().sort({ count: -1 });
    const mostSearchedKeyword = topKeywordDoc ? topKeywordDoc.keyword : 'N/A';

    // 6. Top Trending Searches
    const topTrendingSearches = await TrendingKeyword.find().sort({ count: -1 }).limit(5);

    // 7. Recent User Activity
    const recentActivity = await SearchHistory.find().sort({ timestamp: -1 }).limit(10);

    // Also get popular category list for charts
    const popularCategoriesChart = await PopularCategory.find().sort({ count: -1 }).limit(5);

    // 8. 7-day Search Trends
    const searchTrends = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const startOfDay = new Date(d);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);

      const count = await SearchLog.countDocuments({
        timestamp: { $gte: startOfDay, $lte: endOfDay }
      });

      searchTrends.push({
        day: daysOfWeek[d.getDay()],
        searches: count
      });
    }

    return res.status(200).json({
      totalSearches,
      todaysSearches,
      mostActiveUser,
      mostPopularCategory,
      mostSearchedKeyword,
      topTrendingSearches: topTrendingSearches.map(tk => ({ term: tk.keyword, count: tk.count })),
      recentActivity: recentActivity.map(act => ({
        userId: act.userId,
        email: act.email,
        keyword: act.keyword,
        category: act.category,
        timestamp: act.timestamp
      })),
      popularCategories: popularCategoriesChart.map(cat => ({ name: cat.category, searches: cat.count })),
      searchTrends
    });

  } catch (error) {
    console.error('Error fetching admin dashboard statistics:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
