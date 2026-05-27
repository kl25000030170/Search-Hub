import axiosInstance from './axiosInstance';

export const authApi = {
  // POST /api/auth/login
  loginUser: (email, password) => {
    return axiosInstance.post('/auth/login', { email, password });
  },

  // POST /api/auth/register
  registerUser: (userData) => {
    return axiosInstance.post('/auth/register', userData);
  },

  // GET /api/auth/profile
  fetchProfile: () => {
    return axiosInstance.get('/auth/profile');
  }
};

export default authApi;
