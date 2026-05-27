import axiosInstance from './axiosInstance';

export const orderApi = {
  // POST /api/orders
  createOrder: (orderData) => {
    return axiosInstance.post('/orders', orderData);
  },

  // GET /api/orders
  fetchOrders: () => {
    return axiosInstance.get('/orders');
  },

  // GET /api/orders/:id
  fetchOrderDetails: (id) => {
    return axiosInstance.get(`/orders/${id}`);
  },

  // POST /api/orders/:id/cancel
  cancelOrder: (id) => {
    return axiosInstance.post(`/orders/${id}/cancel`);
  }
};

export default orderApi;
