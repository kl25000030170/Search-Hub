import axiosInstance from './axiosInstance';

const BASE_URL = 'http://localhost:8000/users';

export const userApi = {
  fetchUsers: () => {
    return axiosInstance.get(BASE_URL);
  },

  updateUser: (id, userData) => {
    return axiosInstance.put(`${BASE_URL}/${id}`, userData);
  },

  deleteUser: (id) => {
    return axiosInstance.delete(`${BASE_URL}/${id}`);
  }
};

export default userApi;
