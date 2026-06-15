import axiosInstance from './axiosInstance';

// PRESERVED FOR FUTURE REVIEW-2 INTEGRATION (Node.js + MongoDB Analytics)
/*
export const analyticsApi = {
  // POST /api/search
  logSearch: (data) => {
    return axiosInstance.post('/search', data);
  },

  // GET /api/search/history/:userId
  getSearchHistory: (userId) => {
    return axiosInstance.get(`/search/history/${userId}`);
  },

  // GET /api/search/recent/:userId
  getRecentSearches: (userId) => {
    return axiosInstance.get(`/search/recent/${userId}`);
  },

  // GET /api/search/trending
  getTrendingKeywords: () => {
    return axiosInstance.get('/search/trending');
  },

  // GET /api/search/categories
  getPopularCategories: () => {
    return axiosInstance.get('/search/categories');
  },

  // GET /api/search/suggestions?q=query
  getSuggestions: (query) => {
    return axiosInstance.get('/search/suggestions', { params: { q: query } });
  },

  // DELETE /api/search/history/:id
  deleteSearchHistoryItem: (id) => {
    return axiosInstance.delete(`/search/history/${id}`);
  },

  // DELETE /api/search/history/user/:userId
  deleteUserSearchHistory: (userId) => {
    return axiosInstance.delete(`/search/history/user/${userId}`);
  },

  // GET /api/admin/dashboard
  getAdminDashboard: () => {
    return axiosInstance.get('/admin/dashboard');
  }
};
*/

// REVIEW-1 COMPATIBLE VERSION (Temporarily Disabled Node.js / MongoDB APIs)
export const analyticsApi = {
  logSearch: (data) => {
    return Promise.resolve({ data: { message: "Search logged (mocked)" } });
  },
  getSearchHistory: (userId) => {
    return Promise.resolve({ data: { history: [] } });
  },
  getRecentSearches: (userId) => {
    return Promise.resolve({ data: [] });
  },
  getTrendingKeywords: () => {
    return Promise.resolve({ data: [] });
  },
  getPopularCategories: () => {
    return Promise.resolve({ data: [] });
  },
  getSuggestions: (query) => {
    return Promise.resolve({ data: [] });
  },
  deleteSearchHistoryItem: (id) => {
    return Promise.resolve({ data: { message: "Deleted" } });
  },
  deleteUserSearchHistory: (userId) => {
    return Promise.resolve({ data: { message: "Cleared" } });
  },
  getAdminDashboard: () => {
    return Promise.resolve({ data: {} });
  }
};

export default analyticsApi;

