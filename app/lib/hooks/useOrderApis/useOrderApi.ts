// hooks/useOrderApi.ts
import { useState } from 'react';
import apiClient from '../../api/apiClient';
import { useAuthStore } from '../../stores/useAuthStore';
export const ordersApi = {
  createOrderWithBalance: (orderData: any) => 
    apiClient.post('/orders/balance', orderData),
  
  initializePaystackPayment: (orderData: any) =>
    apiClient.post('/orders/create/paystack', orderData),
  
  getUserOrders: (params?: any) =>
    apiClient.get('/orders/user', { params }),
  
  getOrderById: (id: string) =>
    apiClient.get(`/orders/${id}`),
  
  updateOrderStatus: (orderId: string, data: any) =>
    apiClient.put(`/orders/${orderId}/status`, data),
};

export const useOrderApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, logout, setUser } = useAuthStore();

  const createOrder = async (
    vendorId: string,
    productId: string,
    quantity: number,
    price: number,
    deliveryAddress: string,
    paymentMethod: 'balance' | 'bank-transfer' | 'crypto'
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Validate user is authenticated
      if (!user || !user._id) {
        throw new Error('Please login to place an order');
      }

      let response;
      const totalAmount = price * quantity;

      if (paymentMethod === 'balance') {
        // Check if user has sufficient balance
        if (!user.balance || user.balance < totalAmount) {
          throw new Error(`Insufficient balance. You need ₦${totalAmount.toLocaleString()} but have ₦${(user.balance || 0).toLocaleString()}`);
        }

        response = await ordersApi.createOrderWithBalance({
          vendorId,
          productId,
          quantity,
          price,
          deliveryAddress
        });

        // Update user balance in Zustand store
        if (response.data && user.balance !== undefined) {
          const newBalance = user.balance - totalAmount;
          setUser({
            ...user,
            balance: newBalance
          });
        }

        return {
          type: 'order' as const,
          data: response.data,
          paymentMethod
        };
        
      } else {
        // For bank-transfer and crypto, use Paystack
        response = await ordersApi.initializePaystackPayment({
          vendorId,
          productId,
          quantity,
          price,
          deliveryAddress,
          deliveryFee: 0 // Add if applicable
        });

        return {
          type: 'redirect' as const,
          data: response.data,
          paymentMethod
        };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        logout();
        throw new Error('Your session has expired. Please login again.');
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUserOrders = async (paymentStatus?: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = paymentStatus ? { paymentStatus } : {};
      const response = await ordersApi.getUserOrders(params);
      return response.data.orders;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch orders';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    getUserOrders,
    userBalance: user?.balance || 0,
    loading,
    error,
    clearError: () => setError(null)
  };
};