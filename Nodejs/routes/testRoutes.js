const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SearchHistory = require('../models/SearchHistory');

// GET /api/test
router.get('/test', (req, res) => {
  return res.status(200).json({ status: 'OK' });
});

// GET /api/test/db
router.get('/test/db', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    if (!isConnected) {
      return res.status(500).json({ mongodb: 'Disconnected', error: 'Database connection is not ready' });
    }

    // 1. Insert sample search history
    const sample = new SearchHistory({
      userId: 'test-user-id',
      email: 'test_db@example.com',
      keyword: 'test_sample_keyword_123',
      category: 'Test'
    });
    const saved = await sample.save();

    // 2. Retrieve sample search history
    const found = await SearchHistory.findOne({ _id: saved._id });
    if (!found) {
      throw new Error('Could not retrieve sample document after insertion');
    }

    // 3. Delete sample search history
    await SearchHistory.findByIdAndDelete(saved._id);

    return res.status(200).json({ mongodb: 'Connected' });

  } catch (error) {
    console.error('Test DB verification failed:', error);
    return res.status(500).json({ mongodb: 'Error', details: error.message });
  }
});

module.exports = router;
