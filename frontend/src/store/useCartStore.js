import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SHOPPING_COUPONS } from '../utils/constants';
import { calculateDiscountedPrice, calculateTax, calculateShipping } from '../utils/helpers';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      savedLaterItems: [],
      coupon: null,
      shippingFee: 0,
      tax: 0,
      subtotal: 0,
      discount: 0,
      total: 0,

      // Recalculates all pricing structures (subtotals, coupon reductions, tax rates, free shipping lines)
      recalculateTotals: () => {
        const { items, coupon } = get();
        
        // Calculate subtotal with actual item discounts applied
        const rawSubtotal = items.reduce((acc, item) => {
          const actualPrice = calculateDiscountedPrice(item.product.price, item.product.discount);
          return acc + (actualPrice * item.quantity);
        }, 0);

        let promoDiscount = 0;
        if (coupon) {
          promoDiscount = rawSubtotal * (coupon.discountPercent / 100);
        }

        const calculatedSubtotal = Math.round(rawSubtotal * 100) / 100;
        const calculatedDiscount = Math.round(promoDiscount * 100) / 100;
        const totalAfterDiscount = Math.max(calculatedSubtotal - calculatedDiscount, 0);

        const calculatedShipping = calculateShipping(totalAfterDiscount, 50, 10);
        const calculatedTax = calculateTax(totalAfterDiscount, 0.08); // 8% sales tax

        const calculatedTotal = Math.round((totalAfterDiscount + calculatedShipping + calculatedTax) * 100) / 100;

        set({
          subtotal: calculatedSubtotal,
          discount: calculatedDiscount,
          shippingFee: calculatedShipping,
          tax: calculatedTax,
          total: calculatedTotal
        });
      },

      // Actions
      addItem: (product, quantity = 1, color = '', size = '') => {
        const { items } = get();
        const existingIdx = items.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.selectedColor === color &&
            item.selectedSize === size
        );

        let updatedItems;
        if (existingIdx > -1) {
          updatedItems = [...items];
          updatedItems[existingIdx].quantity += quantity;
        } else {
          updatedItems = [
            ...items,
            {
              product,
              quantity,
              selectedColor: color || (product.colors ? product.colors[0] : ''),
              selectedSize: size || (product.sizes ? product.sizes[0] : '')
            }
          ];
        }

        set({ items: updatedItems });
        get().recalculateTotals();
      },

      removeItem: (productId, color = '', size = '') => {
        const { items } = get();
        const filtered = items.filter(
          (item) =>
            !(item.product.id === productId &&
              item.selectedColor === color &&
              item.selectedSize === size)
        );

        set({ items: filtered });
        get().recalculateTotals();
      },

      updateQuantity: (productId, color = '', size = '', qty) => {
        const { items } = get();
        if (qty <= 0) {
          get().removeItem(productId, color, size);
          return;
        }

        const updated = items.map((item) =>
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedSize === size
            ? { ...item, quantity: qty }
            : item
        );

        set({ items: updated });
        get().recalculateTotals();
      },

      applyCoupon: (code) => {
        const found = SHOPPING_COUPONS.find(
          (c) => c.code.toLowerCase() === code.trim().toLowerCase()
        );

        if (found) {
          set({ coupon: found });
          get().recalculateTotals();
          return { success: true, message: `Coupon applied: ${found.description}` };
        } else {
          return { success: false, message: "Invalid promo code" };
        }
      },

      removeCoupon: () => {
        set({ coupon: null });
        get().recalculateTotals();
      },

      clearCart: () => {
        set({ items: [], coupon: null, subtotal: 0, discount: 0, shippingFee: 0, tax: 0, total: 0 });
      },

      // Save for Later
      saveForLater: (productId, color = '', size = '') => {
        const { items, savedLaterItems } = get();
        const foundItem = items.find(
          (item) =>
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
        );

        if (foundItem) {
          // Remove from items and add to saved list
          const remainingItems = items.filter(
            (item) =>
              !(item.product.id === productId &&
                item.selectedColor === color &&
                item.selectedSize === size)
          );

          set({
            items: remainingItems,
            savedLaterItems: [...savedLaterItems, foundItem]
          });
          get().recalculateTotals();
        }
      },

      moveToCart: (productId, color = '', size = '') => {
        const { items, savedLaterItems } = get();
        const foundItem = savedLaterItems.find(
          (item) =>
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
        );

        if (foundItem) {
          const remainingSaved = savedLaterItems.filter(
            (item) =>
              !(item.product.id === productId &&
                item.selectedColor === color &&
                item.selectedSize === size)
          );

          set({
            savedLaterItems: remainingSaved,
            items: [...items, foundItem]
          });
          get().recalculateTotals();
        }
      },

      removeSavedLater: (productId, color = '', size = '') => {
        const { savedLaterItems } = get();
        const filtered = savedLaterItems.filter(
          (item) =>
            !(item.product.id === productId &&
              item.selectedColor === color &&
              item.selectedSize === size)
        );
        set({ savedLaterItems: filtered });
      }
    }),
    {
      name: 'shopping-cart-storage'
    }
  )
);

export default useCartStore;
