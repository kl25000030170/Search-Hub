import axiosInstance from './axiosInstance';

export const itemApi = {
  fetchItems: (params = {}) => axiosInstance.get('/items', { params }),

  fetchItem: (id) => axiosInstance.get(`/items/${id}`),

  createItem: (payload) => axiosInstance.post('/items', payload),

  updateItem: (id, payload) => axiosInstance.put(`/items/${id}`, payload),

  deleteItem: (id) => axiosInstance.delete(`/items/${id}`),
};

export default itemApi;
