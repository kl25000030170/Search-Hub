import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateInvoiceId } from '../utils/helpers';

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],

      // Actions
      addOrder: (orderData) => {
        const { orders } = get();
        const newOrder = {
          id: generateInvoiceId(),
          date: new Date().toISOString(),
          status: 'Processing', // Processing, Shipped, Delivered, Cancelled
          ...orderData
        };

        set({ orders: [newOrder, ...orders] });
        return newOrder.id;
      },

      cancelOrder: (orderId) => {
        const { orders } = get();
        const updated = orders.map((order) =>
          order.id === orderId && (order.status === 'Processing' || order.status === 'Pending')
            ? { ...order, status: 'Cancelled' }
            : order
        );
        set({ orders: updated });
      },

      getOrderDetails: (orderId) => {
        return get().orders.find((o) => o.id === orderId);
      },

      clearOrders: () => {
        set({ orders: [] });
      }
    }),
    {
      name: 'shopping-order-storage'
    }
  )
);

export default useOrderStore;
