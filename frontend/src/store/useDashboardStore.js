import { create } from 'zustand';
import { MOCK_ITEMS, CATEGORIES } from '../utils/constants';
import dashboardApi from '../api/dashboardApi';

export const useDashboardStore = create((set, get) => ({
  analytics: {
    totalItems: MOCK_ITEMS.length,
    totalCategories: CATEGORIES.length,
    searchCount: 12480,
    topFilterUsage: [
      { filter: 'category:Electronics', count: 3420 },
      { filter: 'category:Courses', count: 2890 },
      { filter: 'rating:4', count: 2100 },
      { filter: 'difficulty:Beginner', count: 1850 },
    ],
    popularCategories: [
      { name: 'Electronics', searches: 4890 },
      { name: 'Courses', searches: 3410 },
      { name: 'Books', searches: 2150 },
      { name: 'Education', searches: 1920 },
    ],
    recentQueries: [
      { term: 'python course', count: 850 },
      { term: 'bluetooth speaker', count: 540 },
      { term: 'java book', count: 320 },
      { term: 'smart watch', count: 280 },
    ],
    searchFrequency: [
      { name: 'Mon', searches: 1200 },
      { name: 'Tue', searches: 1400 },
      { name: 'Wed', searches: 1300 },
      { name: 'Thu', searches: 1700 },
      { name: 'Fri', searches: 1600 },
      { name: 'Sat', searches: 900 },
      { name: 'Sun', searches: 800 },
    ],
  },
  loading: false,

  fetchDashboardData: async () => {
    set({ loading: true });
    try {
      const data = await dashboardApi.fetchDashboardAnalytics();
      if (data) {
        set({
          analytics: {
            totalItems: data.totalItems ?? get().analytics.totalItems,
            totalCategories: data.totalCategories ?? get().analytics.totalCategories,
            searchCount: data.searchCount ?? data.totalSearches ?? get().analytics.searchCount,
            topFilterUsage: data.topFilterUsage ?? get().analytics.topFilterUsage,
            popularCategories: data.popularCategories ?? data.trendingCategories ?? get().analytics.popularCategories,
            recentQueries: data.recentQueries ?? get().analytics.recentQueries,
            searchFrequency: data.searchFrequency ?? get().analytics.searchFrequency,
          },
          loading: false,
        });
        return;
      }
    } catch {
      // use defaults
    }
    set({ loading: false });
  },
}));

export default useDashboardStore;
