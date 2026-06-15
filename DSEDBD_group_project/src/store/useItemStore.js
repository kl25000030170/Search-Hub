import { create } from 'zustand';
import { MOCK_ITEMS, normalizeItem } from '../utils/constants';
import itemApi from '../api/itemApi';

export const useItemStore = create((set, get) => ({
  items: MOCK_ITEMS,
  loading: false,
  error: null,

  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const data = await itemApi.fetchItems();
      const list = (data?.items || data || []).map(normalizeItem);
      if (Array.isArray(list) && list.length > 0) {
        set({ items: list, loading: false });
        return;
      }
    } catch {
      // use mock data
    }
    set({ items: MOCK_ITEMS, loading: false });
  },

  createItem: async (payload) => {
    try {
      const created = await itemApi.createItem(payload);
      const item = normalizeItem(created?.item || created);
      set({ items: [...get().items, item] });
      return { success: true, item };
    } catch {
      const item = normalizeItem({ ...payload, id: Date.now() });
      set({ items: [...get().items, item] });
      return { success: true, item, offline: true };
    }
  },

  updateItem: async (id, payload) => {
    try {
      const updated = await itemApi.updateItem(id, payload);
      const item = normalizeItem(updated?.item || updated);
      set({
        items: get().items.map((i) => (i.id === id ? { ...i, ...item } : i)),
      });
      return { success: true };
    } catch {
      set({
        items: get().items.map((i) =>
          i.id === id ? normalizeItem({ ...i, ...payload }) : i
        ),
      });
      return { success: true, offline: true };
    }
  },

  deleteItem: async (id) => {
    try {
      await itemApi.deleteItem(id);
    } catch {
      // still remove locally
    }
    set({ items: get().items.filter((i) => i.id !== id) });
    return { success: true };
  },
}));

export default useItemStore;
