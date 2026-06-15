import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeItem } from '../utils/constants';
import {
  INITIAL_PRODUCTS,
  INITIAL_COURSES,
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  SEARCH_TRENDS,
  POPULAR_CATEGORY_CHART,
  RECENT_QUERIES,
} from '../data/adminMockData';

import itemApi from '../api/itemApi';
import categoryApi from '../api/categoryApi';
import courseApi from '../api/courseApi';
import userApi from '../api/userApi';
import dashboardApi from '../api/dashboardApi';
import analyticsApi from '../api/analyticsApi';

export const useCatalogStore = create(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      courses: INITIAL_COURSES,
      categories: INITIAL_CATEGORIES,
      users: INITIAL_USERS,
      totalSearchQueries: 3200,
      totalViews: 15200,
      searchTrends: SEARCH_TRENDS,
      popularCategoryChart: POPULAR_CATEGORY_CHART,
      recentQueries: RECENT_QUERIES,

      fetchCatalogData: async () => {
        try {
          const cats = await categoryApi.fetchCategories();
          const crs = await courseApi.fetchCourses();
          const prods = await itemApi.fetchItems();
          const usr = await userApi.fetchUsers();
          
          let stats = null;
          try {
            const statsRes = await analyticsApi.getAdminDashboard();
            stats = statsRes?.data || statsRes;
          } catch (err) {
            console.error("Failed to fetch admin dashboard stats from Node.js:", err);
          }

          const newState = {
            categories: Array.isArray(cats) ? cats : get().categories,
            courses: Array.isArray(crs) ? crs : get().courses,
            products: Array.isArray(prods) ? prods.map(normalizeItem) : get().products,
            users: Array.isArray(usr) ? usr : get().users,
          };

          if (stats) {
            newState.totalSearchQueries = stats.totalSearches ?? get().totalSearchQueries;
            
            if (Array.isArray(stats.searchTrends) && stats.searchTrends.length > 0) {
              newState.searchTrends = stats.searchTrends;
            }

            if (Array.isArray(stats.popularCategories) && stats.popularCategories.length > 0) {
              newState.popularCategoryChart = stats.popularCategories.map((cat) => ({
                name: cat.name,
                value: cat.searches,
              }));
            }

            if (Array.isArray(stats.topTrendingSearches) && stats.topTrendingSearches.length > 0) {
              newState.recentQueries = stats.topTrendingSearches.map((q) => ({
                query: q.term,
                count: q.count,
                time: 'Active',
              }));
            }
          }

          set(newState);
        } catch (error) {
          console.error("Failed to fetch catalog data:", error);
        }
      },

      getStats: () => {
        const { products, courses, categories, users, totalSearchQueries, totalViews } = get();
        return {
          totalUsers: users.length,
          totalProducts: products.length,
          totalCourses: courses.length,
          totalCategories: categories.length,
          totalSearchQueries,
          totalViews,
        };
      },

      addProduct: async (product) => {
        try {
          const res = await itemApi.createItem(product);
          const normalized = normalizeItem(res);
          set({ products: [...get().products, normalized] });
          return normalized;
        } catch (error) {
          console.error("Failed to add product:", error);
          const item = normalizeItem({
            ...product,
            id: Date.now(),
            title: product.name || product.title,
            inStock: true,
            tags: product.tags || [],
            attributes: product.attributes || [],
          });
          const normalized = { ...item, name: item.title };
          set({ products: [...get().products, normalized] });
          return normalized;
        }
      },

      updateProduct: async (id, updates) => {
        try {
          const res = await itemApi.updateItem(id, updates);
          set({
            products: get().products.map((p) => p.id === id ? normalizeItem(res) : p)
          });
        } catch (error) {
          console.error("Failed to update product:", error);
          set({
            products: get().products.map((p) => {
              if (p.id !== id) return p;
              const title = updates.name || updates.title || p.title;
              return normalizeItem({ ...p, ...updates, title, name: title });
            }),
          });
        }
      },

      deleteProduct: async (id) => {
        try {
          await itemApi.deleteItem(id);
          set({ products: get().products.filter((p) => p.id !== id) });
        } catch (error) {
          console.error("Failed to delete product:", error);
          set({ products: get().products.filter((p) => p.id !== id) });
        }
      },

      getProduct: (id) => get().products.find((p) => p.id === Number(id)),

      addCourse: async (course) => {
        try {
          const res = await courseApi.createCourse(course);
          set({ courses: [...get().courses, res] });
          return res;
        } catch (error) {
          console.error("Failed to add course:", error);
          const newCourse = { ...course, id: Date.now() };
          set({ courses: [...get().courses, newCourse] });
          return newCourse;
        }
      },

      updateCourse: async (id, updates) => {
        try {
          const res = await courseApi.updateCourse(id, updates);
          set({
            courses: get().courses.map((c) => c.id === id ? res : c)
          });
        } catch (error) {
          console.error("Failed to update course:", error);
          set({
            courses: get().courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
          });
        }
      },

      deleteCourse: async (id) => {
        try {
          await courseApi.deleteCourse(id);
          set({ courses: get().courses.filter((c) => c.id !== id) });
        } catch (error) {
          console.error("Failed to delete course:", error);
          set({ courses: get().courses.filter((c) => c.id !== id) });
        }
      },

      addCategory: async (name) => {
        try {
          const res = await categoryApi.createCategory({ name });
          set({ categories: [...get().categories, res] });
          return res;
        } catch (error) {
          console.error("Failed to add category:", error);
          const cat = { id: Date.now(), name, icon: 'folder' };
          set({ categories: [...get().categories, cat] });
          return cat;
        }
      },

      deleteCategory: async (id) => {
        try {
          await categoryApi.deleteCategory(id);
          set({ categories: get().categories.filter((c) => c.id !== id) });
        } catch (error) {
          console.error("Failed to delete category:", error);
          set({ categories: get().categories.filter((c) => c.id !== id) });
        }
      },

      updateCategory: async (id, name) => {
        try {
          const res = await categoryApi.updateCategory(id, { name });
          set({
            categories: get().categories.map((c) => c.id === id ? res : c)
          });
        } catch (error) {
          console.error("Failed to update category:", error);
          set({
            categories: get().categories.map((c) => (c.id === id ? { ...c, name } : c)),
          });
        }
      },

      addUser: async (user) => {
        try {
          const res = await userApi.createUser(user);
          set({ users: [...get().users, res] });
        } catch (error) {
          console.error("Failed to add user:", error);
          const newUser = {
            ...user,
            id: Date.now(),
            joinedDate: new Date().toISOString().slice(0, 10),
            status: user.status || 'Active',
          };
          set({ users: [...get().users, newUser] });
        }
      },

      updateUser: async (id, updates) => {
        try {
          const res = await userApi.updateUser(id, updates);
          set({
            users: get().users.map((u) => u.id === id ? res : u)
          });
        } catch (error) {
          console.error("Failed to update user:", error);
          set({
            users: get().users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
          });
        }
      },

      deleteUser: async (id) => {
        try {
          await userApi.deleteUser(id);
          set({ users: get().users.filter((u) => u.id !== id) });
        } catch (error) {
          console.error("Failed to delete user:", error);
          set({ users: get().users.filter((u) => u.id !== id) });
        }
      },

      incrementViews: () => {
        set({ totalViews: get().totalViews + 1 });
      },

      recordSearch: (query) => {
        if (!query?.trim()) return;
        const entry = { query: query.trim(), time: 'Just now', count: 1 };
        set({
          totalSearchQueries: get().totalSearchQueries + 1,
          recentQueries: [entry, ...get().recentQueries.filter((q) => q.query !== entry.query)].slice(0, 8),
        });
      },
    }),
    { name: 'catalog-storage' }
  )
);

export default useCatalogStore;
