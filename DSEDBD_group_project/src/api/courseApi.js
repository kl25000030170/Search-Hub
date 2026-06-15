import axiosInstance from './axiosInstance';

export const courseApi = {
  fetchCourses: () => axiosInstance.get('/courses'),

  createCourse: (payload) => axiosInstance.post('/courses', payload),

  updateCourse: (id, payload) => axiosInstance.put(`/courses/${id}`, payload),

  deleteCourse: (id) => axiosInstance.delete(`/courses/${id}`),
};

export default courseApi;
