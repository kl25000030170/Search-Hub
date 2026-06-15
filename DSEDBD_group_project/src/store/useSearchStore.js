import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeItem } from '../utils/constants';
import searchApi from '../api/searchApi';
import analyticsApi from '../api/analyticsApi';
import { useCatalogStore } from './useCatalogStore';
import { useAuthStore } from './useAuthStore';

const getCatalogProducts = () => useCatalogStore.getState().products;

const applyLocalFilters = (items, query, filters, isSemantic) => {
  let filtered = items.filter((item) => {
    if (query?.trim()) {
      const keyword = query.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(keyword);
      const matchesDesc = item.description.toLowerCase().includes(keyword);
      const matchesTag = item.tags?.some((t) => t.toLowerCase().includes(keyword));
      const matchesBrand = item.brand?.toLowerCase().includes(keyword);
      if (!matchesTitle && !matchesDesc && !matchesTag && !matchesBrand) return false;
    }

    if (filters.category.length > 0 && !filters.category.includes(item.category)) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(item.brand)) return false;
    if (item.price < filters.price.min || item.price > filters.price.max) return false;
    if (filters.rating > 0 && item.rating < filters.rating) return false;
    if (filters.tags.length > 0 && !filters.tags.some((t) => item.tags?.includes(t))) return false;
    if (filters.availability && !item.inStock) return false;
    if (filters.difficulty.length > 0 && !filters.difficulty.includes(item.difficulty)) return false;

    return true;
  });

  if (isSemantic && query) {
    filtered = filtered
      .map((item) => {
        let matchFactor = 80;
        if (item.title.toLowerCase().includes(query.toLowerCase())) matchFactor += 15;
        if (item.description.toLowerCase().includes(query.toLowerCase())) matchFactor += 4;
        return { ...item, matchScore: Math.min(matchFactor, 100) };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  return filtered;
};

export const useSearchStore = create(
  persist(
    (set, get) => ({
      query: '',
      isSemantic: false,
      filters: {
        category: [],
        brands: [],
        price: { min: 0, max: 500 },
        rating: 0,
        tags: [],
        availability: false,
        difficulty: [],
      },
      results: getCatalogProducts(),
      loading: false,
      error: null,
      currentPage: 1,
      hasMore: false,
      recentSearches: [],
      trendingKeywords: [],
      popularCategories: [],
      searchHistory: [],
      filterUsage: {},

      updateQuery: (newQuery) => set({ query: newQuery, currentPage: 1 }),

      toggleSemantic: () => set((state) => ({ isSemantic: !state.isSemantic })),

      trackFilterUsage: (key, val) => {
        const usage = { ...get().filterUsage };
        const label = `${key}:${val}`;
        usage[label] = (usage[label] || 0) + 1;
        set({ filterUsage: usage });
      },

      updateFilters: (newFilters) => {
        set({ filters: { ...get().filters, ...newFilters }, currentPage: 1 });
        get().fetchResults();
      },

      clearFilters: () => {
        set({
          filters: {
            category: [],
            brands: [],
            price: { min: 0, max: 500 },
            rating: 0,
            tags: [],
            availability: false,
            difficulty: [],
          },
          currentPage: 1,
        });
        get().fetchResults();
      },

      resetSearch: () => {
        set({ query: '', isSemantic: false, currentPage: 1, results: getCatalogProducts() });
        get().clearFilters();
      },

      setLoading: (val) => set({ loading: val }),
      setError: (err) => set({ error: err }),

      addRecentSearch: (term) => {
        if (!term?.trim()) return;
        const cleanTerm = term.trim();
        const current = get().recentSearches;
        const filtered = current.filter((s) => s.toLowerCase() !== cleanTerm.toLowerCase());
        set({ recentSearches: [cleanTerm, ...filtered].slice(0, 10) });
      },

      removeRecentSearch: (term) => {
        set({ recentSearches: get().recentSearches.filter((s) => s !== term) });
      },

      fetchRecentSearches: async () => {
        const user = useAuthStore.getState().user;
        if (!user || !user.id) return;
        try {
          const res = await analyticsApi.getRecentSearches(user.id);
          const data = res?.data || res || [];
          const terms = data.map((item) => (typeof item === 'string' ? item : item.keyword));
          set({ recentSearches: terms });
        } catch (err) {
          console.error('Failed to fetch recent searches:', err);
        }
      },

      fetchTrendingKeywords: async () => {
        try {
          const res = await analyticsApi.getTrendingKeywords();
          const data = res?.data || res || [];
          set({ trendingKeywords: data });
        } catch (err) {
          console.error('Failed to fetch trending keywords:', err);
        }
      },

      fetchPopularCategories: async () => {
        try {
          const res = await analyticsApi.getPopularCategories();
          const data = res?.data || res || [];
          set({ popularCategories: data });
        } catch (err) {
          console.error('Failed to fetch popular categories:', err);
        }
      },

      fetchSearchHistory: async () => {
        const user = useAuthStore.getState().user;
        if (!user || !user.id) return;
        try {
          const res = await analyticsApi.getSearchHistory(user.id);
          const data = res?.data || res || {};
          set({ searchHistory: data.history || [] });
        } catch (err) {
          console.error('Failed to fetch search history:', err);
        }
      },

      deleteHistoryItem: async (id) => {
        try {
          await analyticsApi.deleteSearchHistoryItem(id);
          get().fetchSearchHistory();
          get().fetchRecentSearches();
        } catch (err) {
          console.error('Failed to delete search history item:', err);
        }
      },

      clearSearchHistory: async () => {
        const user = useAuthStore.getState().user;
        if (!user || !user.id) return;
        try {
          await analyticsApi.deleteUserSearchHistory(user.id);
          set({ searchHistory: [], recentSearches: [] });
        } catch (err) {
          console.error('Failed to clear search history:', err);
        }
      },

      fetchResults: async () => {
        const { query, filters, isSemantic } = get();
        set({ loading: true, error: null });

        // Log search in MongoDB Atlas (non-blocking)
        if (query?.trim()) {
          const user = useAuthStore.getState().user;
          const userId = user?.id || user?.email || 'anonymous';
          const email = user?.email || 'anonymous@example.com';
          const categoryName = filters.category && filters.category.length > 0 ? filters.category[0] : 'All';
          
          analyticsApi.logSearch({
            userId,
            email,
            keyword: query.trim(),
            category: categoryName
          }).then(() => {
            get().fetchRecentSearches();
            get().fetchTrendingKeywords();
            get().fetchPopularCategories();
            get().fetchSearchHistory();
          }).catch((err) => console.error('Failed to log search:', err));
        }

        try {
          const response = await searchApi.searchItems(query, filters, get().currentPage);
          const raw = response?.items || response?.results || response?.data || response;
          const list = Array.isArray(raw) ? raw.map(normalizeItem) : null;

          if (list) {
            set({ results: list, loading: false, hasMore: Boolean(response?.hasMore) });
            if (query?.trim()) get().addRecentSearch(query);
            return;
          }
        } catch {
          // Fall back to local mock filtering when API is unavailable
        }

        const catalogProducts = getCatalogProducts();
        const filtered = applyLocalFilters(catalogProducts, query, filters, isSemantic);
        set({ results: filtered, loading: false, hasMore: false });
        if (query?.trim()) {
          get().addRecentSearch(query);
          useCatalogStore.getState().recordSearch(query);
        }
      },

      loadMoreResults: async () => {
        const { currentPage, hasMore, loading, query, filters } = get();
        if (!hasMore || loading) return;

        set({ loading: true });
        try {
          const response = await searchApi.searchItems(query, filters, currentPage + 1);
          const raw = response?.items || response?.results || [];
          const list = Array.isArray(raw) ? raw.map(normalizeItem) : [];
          if (list.length > 0) {
            set({
              results: [...get().results, ...list],
              currentPage: currentPage + 1,
              hasMore: Boolean(response?.hasMore),
              loading: false,
            });
            return;
          }
        } catch {
          // no-op
        }
        set({ hasMore: false, loading: false });
      },
    }),
    {
      name: 'search-storage',
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        filterUsage: state.filterUsage,
      }),
    }
  )
);

export default useSearchStore;
