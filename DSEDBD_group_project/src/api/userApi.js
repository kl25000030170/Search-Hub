import axiosInstance from './axiosInstance';

export const userApi = {
  fetchUsers: () => axiosInstance.get('/users'),

  createUser: (payload) => axiosInstance.post('/users', payload),

  updateUser: (id, payload) => axiosInstance.put(`/users/${id}`, payload),

  deleteUser: (id) => axiosInstance.delete(`/users/${id}`),
};

export default userApi;
