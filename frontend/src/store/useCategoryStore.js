import { create } from 'zustand';
import { CATEGORIES } from '../utils/constants';
import categoryApi from '../api/categoryApi';

export const useCategoryStore = create((set, get) => ({
  categories: CATEGORIES.map((name, idx) => ({ id: idx + 1, name, description: '' })),
  loading: false,

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const data = await categoryApi.fetchCategories();
      const list = data?.categories || data || [];
      if (Array.isArray(list) && list.length > 0) {
        set({ categories: list, loading: false });
        return;
      }
    } catch {
      // keep defaults
    }
    set({ loading: false });
  },

  addCategory: async (name, description = '') => {
    const payload = { name, description };
    try {
      const created = await categoryApi.createCategory(payload);
      const cat = created?.category || created;
      set({ categories: [...get().categories, cat] });
      return { success: true };
    } catch {
      const cat = { id: Date.now(), name, description };
      set({ categories: [...get().categories, cat] });
      return { success: true, offline: true };
    }
  },

  updateCategory: async (id, updates) => {
    try {
      await categoryApi.updateCategory(id, updates);
    } catch {
      // local update
    }
    set({
      categories: get().categories.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    });
    return { success: true };
  },

  deleteCategory: async (id) => {
    try {
      await categoryApi.deleteCategory(id);
    } catch {
      // local delete
    }
    set({ categories: get().categories.filter((c) => c.id !== id) });
    return { success: true };
  },
}));

export default useCategoryStore;
