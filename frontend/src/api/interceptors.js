import axiosInstance from './axiosInstance';

export const setupInterceptors = () => {
  // Request Interceptor: Attach JWT Token if present
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor: Extract data payload and handle global errors
  axiosInstance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      if (error.response) {
        const { status } = error.response;
        if (status === 401) {
          console.warn('Session expired. Removing auth token...');
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('current_user');
          // Optional: trigger redirect to login by emitting event or reload
        }
      }
      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;
