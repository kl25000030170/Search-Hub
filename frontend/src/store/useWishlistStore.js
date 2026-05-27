import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Actions
      toggleWishlist: (product) => {
        const { items } = get();
        const exists = items.some((item) => item.id === product.id);

        if (exists) {
          set({ items: items.filter((item) => item.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },

      removeFromWishlist: (productId) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== productId) });
      },

      clearWishlist: () => {
        set({ items: [] });
      }
    }),
    {
      name: 'shopping-wishlist-storage'
    }
  )
);

export default useWishlistStore;
