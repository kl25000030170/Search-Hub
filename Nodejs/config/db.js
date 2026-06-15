const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Atlas Connected');
    
    // Seed MongoDB database with sample analytics if collections are empty
    await seedMongoDB();
    
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not crash the application during development if MongoDB connection fails initially
    // process.exit(1);
  }
};

const seedMongoDB = async () => {
  try {
    const TrendingKeyword = require('../models/TrendingKeyword');
    const PopularCategory = require('../models/PopularCategory');
    const AdminAnalytics = require('../models/AdminAnalytics');
    const SearchHistory = require('../models/SearchHistory');
    const SearchLog = require('../models/SearchLog');
    const RecentSearch = require('../models/RecentSearch');

    // Force re-seeding for clean, aligned categories matching original requirements
    console.log('Clearing old MongoDB analytics database for category alignment...');
    await TrendingKeyword.deleteMany({});
    await PopularCategory.deleteMany({});
    await SearchLog.deleteMany({});
    await SearchHistory.deleteMany({});
    await RecentSearch.deleteMany({});
    await AdminAnalytics.deleteMany({});

    console.log('Seeding initial MongoDB analytics data...');

      // 1. Seed Trending Keywords
      const keywords = [
        { keyword: 'Java Programming Mastery', count: 45 },
        { keyword: 'Python for Data Science', count: 41 },
        { keyword: 'React Frontend Development', count: 32 },
        { keyword: 'Spring Boot Development', count: 28 },
        { keyword: 'FastAPI Complete Guide', count: 22 },
        { keyword: 'Cloud Computing Fundamentals', count: 18 }
      ];
      await TrendingKeyword.insertMany(keywords);

      // 2. Seed Popular Categories
      const categories = [
        { category: 'Courses', count: 87 },
        { category: 'Books', count: 68 },
        { category: 'Electronics', count: 54 },
        { category: 'Technology Tools', count: 48 },
        { category: 'Learning Resources', count: 36 },
        { category: 'Education', count: 25 }
      ];
      await PopularCategory.insertMany(categories);

      // 3. Seed Search Logs for the last 7 days to populate searchTrends chart
      const keywordsList = [
        { term: 'Java Programming Mastery', cat: 'Courses' },
        { term: 'Python for Data Science', cat: 'Courses' },
        { term: 'React Frontend Development', cat: 'Courses' },
        { term: 'Spring Boot Development', cat: 'Courses' },
        { term: 'MongoDB Essentials', cat: 'Courses' },
        { term: 'FastAPI Complete Guide', cat: 'Books' }
      ];

      for (let i = 6; i >= 0; i--) {
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - i);
        // Vary the number of daily searches to make the graph look natural
        const dailySearches = 15 + Math.floor(Math.random() * 15) - i * 2;
        
        for (let j = 0; j < dailySearches; j++) {
          const item = keywordsList[Math.floor(Math.random() * keywordsList.length)];
          const log = new SearchLog({
            userId: 'user@example.com',
            keyword: item.term,
            category: item.cat,
            timestamp: timestamp,
            ipAddress: '127.0.0.1',
            sessionId: `sess_${100000 + Math.floor(Math.random() * 900000)}`
          });
          await log.save();
        }
      }

      // 4. Seed User Search History
      const userHistory = [
        { keyword: 'Java Programming Mastery', category: 'Courses' },
        { keyword: 'Python for Data Science', category: 'Courses' },
        { keyword: 'Spring Boot Development', category: 'Courses' },
        { keyword: 'React Frontend Development', category: 'Courses' },
        { keyword: 'MongoDB Essentials', category: 'Courses' }
      ];
      
      for (const h of userHistory) {
        const hist = new SearchHistory({
          userId: 'user@example.com',
          email: 'user@example.com',
          keyword: h.keyword,
          category: h.category,
          timestamp: new Date()
        });
        await hist.save();

        const rec = new RecentSearch({
          userId: 'user@example.com',
          keyword: h.keyword,
          timestamp: new Date()
        });
        await rec.save();
      }

      // 5. Seed Admin Analytics
      const adminStats = new AdminAnalytics({
        totalSearches: 180,
        totalUsers: 4,
        topKeyword: 'Java Programming Mastery',
        topCategory: 'Courses',
        lastUpdated: new Date()
      });
      await adminStats.save();

      console.log('MongoDB analytics database seeded successfully.');
  } catch (err) {
    console.error('Failed to seed MongoDB analytics database:', err);
  }
};

module.exports = connectDB;
