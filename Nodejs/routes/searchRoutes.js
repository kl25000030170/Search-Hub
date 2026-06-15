const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.post('/', searchController.logSearch);
router.get('/history/:userId', searchController.getSearchHistory);
router.get('/recent/:userId', searchController.getRecentSearches);
router.get('/trending', searchController.getTrendingKeywords);
router.get('/categories', searchController.getPopularCategories);
router.get('/suggestions', searchController.getSearchSuggestions);
router.delete('/history/:id', searchController.deleteHistoryItem);
router.delete('/history/user/:userId', searchController.clearUserHistory);

module.exports = router;
