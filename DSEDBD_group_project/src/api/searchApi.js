import axiosInstance from './axiosInstance';

// Search API mappings matching Spring Boot endpoint signatures
export const searchApi = {
  // GET /api/search?q=query&category=...
  searchItems: (query, filters, page = 1) => {
    const params = {
      q: query,
      page,
      categories: filters.category.join(','),
      brands: filters.brands.join(','),
      minPrice: filters.price.min,
      maxPrice: filters.price.max,
      rating: filters.rating,
      tags: filters.tags.join(','),
      inStock: filters.availability,
      difficulty: filters.difficulty.join(',')
    };
    return axiosInstance.get('/search', { params });
  },

  // POST /api/semantic-search
  semanticSearch: (query) => {
    return axiosInstance.post('/semantic-search', { query });
  },

  // GET /api/filters
  fetchFilters: () => {
    return axiosInstance.get('/filters');
  },

  // GET /api/categories
  fetchCategories: () => {
    return axiosInstance.get('/categories');
  }
};

export default searchApi;
