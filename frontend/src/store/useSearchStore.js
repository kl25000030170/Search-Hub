import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeItem } from '../utils/constants';
import searchApi from '../api/searchApi';
import { useCatalogStore } from './useCatalogStore';
const getCatalogProducts = () => useCatalogStore.getState().products;

const applyLocalFilters = (items, query, filters) => {
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

  return filtered;
};

export const useSearchStore = create(
  persist(
    (set, get) => ({
      query: '',
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
      filterUsage: {},

      updateQuery: (newQuery) => set({ query: newQuery, currentPage: 1 }),


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
        set({ query: '', currentPage: 1, results: getCatalogProducts() });
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

      fetchResults: async () => {
        const { query, filters } = get();
        set({ loading: true, error: null });

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
        const filtered = applyLocalFilters(catalogProducts, query, filters);
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
