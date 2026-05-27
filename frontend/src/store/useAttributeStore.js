import { create } from 'zustand';
import { BASE_FILTER_METADATA } from '../utils/constants';

export const useAttributeStore = create((set, get) => ({
  attributes: BASE_FILTER_METADATA.attributes.map((name, idx) => ({
    id: idx + 1,
    name,
    type: name === 'Price' || name === 'Rating' ? 'number' : 'text',
  })),

  addAttribute: (name, type = 'text') => {
    const attr = { id: Date.now(), name, type };
    set({ attributes: [...get().attributes, attr] });
    return { success: true };
  },

  updateAttribute: (id, updates) => {
    set({
      attributes: get().attributes.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    });
    return { success: true };
  },

  deleteAttribute: (id) => {
    set({ attributes: get().attributes.filter((a) => a.id !== id) });
    return { success: true };
  },
}));

export default useAttributeStore;
