import axiosInstance from './axiosInstance';

export const dashboardApi = {
  // GET /api/dashboard/analytics
  fetchDashboardAnalytics: () => {
    return axiosInstance.get('/dashboard/analytics');
  }
};

export default dashboardApi;
