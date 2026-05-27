import { create } from 'zustand';
import { MOCK_ITEMS } from '../utils/constants';

const MOCK_PRODUCTS = MOCK_ITEMS;

export const useProductStore = create((set, get) => ({
  query: '',
  filters: {
    category: [],
    brands: [],
    price: { min: 0, max: 500 },
    rating: 0,
    colors: [],
    sizes: [],
    availability: false,
    discount: 0
  },
  sorting: 'popularity', // popularity, newest, price-asc, price-desc, rating
  results: MOCK_PRODUCTS,
  loading: false,
  currentPage: 1,
  hasMore: true,

  // Actions
  updateQuery: (q) => {
    set({ query: q, currentPage: 1 });
    get().fetchProducts();
  },

  updateFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters }, currentPage: 1 });
    get().fetchProducts();
  },

  updateSorting: (newSorting) => {
    set({ sorting: newSorting, currentPage: 1 });
    get().fetchProducts();
  },

  clearFilters: () => {
    set({
      filters: {
        category: [],
        brands: [],
        price: { min: 0, max: 500 },
        rating: 0,
        colors: [],
        sizes: [],
        availability: false,
        discount: 0
      },
      currentPage: 1
    });
    get().fetchProducts();
  },

  fetchProducts: () => {
    set({ loading: true, hasMore: true });

    setTimeout(() => {
      try {
        const { query, filters, sorting } = get();

        let filtered = MOCK_PRODUCTS.filter((item) => {
          // 1. Text Search Match
          if (query && query.trim() !== '') {
            const keyword = query.toLowerCase();
            const titleMatch = item.title.toLowerCase().includes(keyword);
            const brandMatch = item.brand.toLowerCase().includes(keyword);
            const descMatch = item.description.toLowerCase().includes(keyword);
            if (!titleMatch && !brandMatch && !descMatch) return false;
          }

          // 2. Category Check
          if (filters.category.length > 0 && !filters.category.includes(item.category)) {
            return false;
          }

          // 3. Brand Check
          if (filters.brands.length > 0 && !filters.brands.includes(item.brand)) {
            return false;
          }

          // 4. Price Limit
          if (item.price < filters.price.min || item.price > filters.price.max) {
            return false;
          }

          // 5. Ratings check
          if (filters.rating > 0 && item.rating < filters.rating) {
            return false;
          }

          // 6. Discount percentage check
          if (filters.discount > 0 && item.discount < filters.discount) {
            return false;
          }

          // 7. Colors check
          if (filters.colors.length > 0 && !filters.colors.some(c => item.colors.includes(c))) {
            return false;
          }

          // 8. Sizes check
          if (filters.sizes.length > 0 && !filters.sizes.some(s => item.sizes.includes(s))) {
            return false;
          }

          // 9. Availability check
          if (filters.availability && !item.inStock) {
            return false;
          }

          return true;
        });

        // 10. Sort Items
        if (sorting === 'price-asc') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sorting === 'price-desc') {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sorting === 'rating') {
          filtered.sort((a, b) => b.rating - a.rating);
        } else if (sorting === 'newest') {
          filtered.sort((a, b) => b.id - a.id); // higher IDs are newer mock items
        }

        set({ results: filtered, loading: false });
      } catch (err) {
        console.error('Filtering products failed:', err);
        set({ loading: false });
      }
    }, 450); // SaaS natural networking delay
  },

  loadMore: () => {
    const { currentPage, hasMore } = get();
    if (!hasMore) return;

    set({ loading: true });
    setTimeout(() => {
      const nextPage = currentPage + 1;
      if (nextPage >= 3) {
        set({ hasMore: false, loading: false });
      } else {
        set({ currentPage: nextPage, loading: false });
      }
    }, 400);
  }
}));

export default useProductStore;
