import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizeItem } from '../utils/constants';
import userApi from '../api/userApi';
import {
  INITIAL_PRODUCTS,
  INITIAL_COURSES,
  INITIAL_CATEGORIES,
  SEARCH_TRENDS,
  POPULAR_CATEGORY_CHART,
  RECENT_QUERIES,
} from '../data/adminMockData';

export const useCatalogStore = create(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      courses: INITIAL_COURSES,
      categories: INITIAL_CATEGORIES,
      users: [],
      totalSearchQueries: 3200,
      totalViews: 15200,
      searchTrends: SEARCH_TRENDS,
      popularCategoryChart: POPULAR_CATEGORY_CHART,
      recentQueries: RECENT_QUERIES,

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

      addProduct: (product) => {
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
      },

      updateProduct: (id, updates) => {
        set({
          products: get().products.map((p) => {
            if (p.id !== id) return p;
            const title = updates.name || updates.title || p.title;
            return normalizeItem({ ...p, ...updates, title, name: title });
          }),
        });
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
      },

      getProduct: (id) => get().products.find((p) => p.id === Number(id)),

      addCourse: (course) => {
        const newCourse = { ...course, id: Date.now() };
        set({ courses: [...get().courses, newCourse] });
        return newCourse;
      },

      updateCourse: (id, updates) => {
        set({
          courses: get().courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        });
      },

      deleteCourse: (id) => {
        set({ courses: get().courses.filter((c) => c.id !== id) });
      },

      addCategory: (name) => {
        const cat = { id: Date.now(), name, icon: 'folder' };
        set({ categories: [...get().categories, cat] });
        return cat;
      },

      deleteCategory: (id) => {
        set({ categories: get().categories.filter((c) => c.id !== id) });
      },

      addUser: (user) => {
        const newUser = {
          ...user,
          id: Date.now(),
          joinedDate: new Date().toISOString().slice(0, 10),
          status: user.status || 'Active',
        };
        set({ users: [...get().users, newUser] });
      },

      deleteUser: (id) => {
        set({ users: get().users.filter((u) => u.id !== id) });
      },

      fetchUsers: async () => {
        try {
          const list = await userApi.fetchUsers();
          if (Array.isArray(list)) {
            const mapped = list.map(u => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role,
              joinedDate: '2026-05-24',
              status: 'Active'
            }));
            set({ users: mapped });
          }
        } catch (err) {
          console.error("Failed to fetch users:", err);
        }
      },

      changeUserRole: async (id, newRole) => {
        const user = get().users.find(u => u.id === id);
        if (!user) return;
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: newRole
        };
        try {
          await userApi.updateUser(id, payload);
          set({
            users: get().users.map((u) => (u.id === id ? { ...u, role: newRole } : u)),
          });
        } catch (err) {
          console.error("Failed to update user role:", err);
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
