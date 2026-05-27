import axiosInstance from './axiosInstance';

export const paymentApi = {
  // POST /api/payment/process
  processPayment: (paymentDetails) => {
    return axiosInstance.post('/payment/process', paymentDetails);
  }
};

export default paymentApi;
