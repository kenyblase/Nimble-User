import { useState } from 'react';
import { productApi } from '../../api/productsApi';
import { useAuthStore } from '../../stores/useAuthStore';

export const useWishlist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();

  const toggleWishlist = async (productId: string, currentStatus: boolean): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Please login to manage wishlist');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      if (currentStatus) {
        await productApi.removeFromWishlist(productId);
      } else {
        await productApi.addToWishlist(productId);
      }

      return !currentStatus; // Return new status
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update wishlist';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    toggleWishlist,
    loading,
    error,
    clearError: () => setError(null)
  };
};