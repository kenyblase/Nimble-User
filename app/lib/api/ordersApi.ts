// api/ordersApi.ts
import apiClient from './apiClient';

export const ordersApi = {
  // Pay with balance
  createOrderWithBalance: (orderData: {
    vendorId: string;
    productId: string;
    quantity: number;
    price: number;
    deliveryAddress: string;
  }) => {
    return apiClient.post('/orders/balance', orderData);
  },

  // Initialize Paystack payment
  initializePaystackPayment: (orderData: {
    vendorId: string;
    productId: string;
    quantity: number;
    price: number;
    deliveryFee?: number;
    deliveryAddress: string;
  }) => {
    return apiClient.post('/orders/paystack/initialize', orderData);
  },

  // Get user orders
  getUserOrders: (paymentStatus?: string) => {
    const params = paymentStatus ? { paymentStatus } : {};
    return apiClient.get('/orders/user', { params });
  },

  // Get order by ID
  getOrderById: (id: string) => {
    return apiClient.get(`/orders/${id}`);
  },

  // Update order status (for vendors)
  updateOrderStatus: (orderId: string, data: {
    orderStatus: string;
    expectedDeliveryDate?: Date;
  }) => {
    return apiClient.put(`/orders/${orderId}/status`, data);
  }
};