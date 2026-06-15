import axiosInstance from './axiosInstance';

export const categoryApi = {
  fetchCategories: () => axiosInstance.get('/categories'),

  createCategory: (payload) => axiosInstance.post('/categories', payload),

  updateCategory: (id, payload) => axiosInstance.put(`/categories/${id}`, payload),

  deleteCategory: (id) => axiosInstance.delete(`/categories/${id}`),
};

export default categoryApi;
