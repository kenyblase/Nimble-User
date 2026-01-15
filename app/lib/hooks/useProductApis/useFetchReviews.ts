// lib/hooks/useProductApis/useFetchReviews.ts
import { useState, useEffect } from 'react';
import { productApi } from '../../api/productsApi';

interface Review {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface UseFetchReviewsReturn {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFetchReviews = (productId: string | undefined): UseFetchReviewsReturn => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async (): Promise<void> => {
    console.log('=== FETCH REVIEWS START ===');
    console.log('productId:', productId);
    
    if (!productId) {
      console.log('❌ No productId provided, skipping fetch');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Fetching product reviews...');
      
      const response = await productApi.getProductReviews(productId);
      console.log('✅ Reviews data:', response.data);
      
      setReviews(response.data.reviews || []);
      
      console.log('✅ Reviews loaded:', response.data.reviews?.length || 0);

    } catch (err: any) {
      console.error('❌ API Call Failed!');
      console.error('Error:', err);
      console.error('Error Response:', err?.response);
      
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch reviews';
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('=== FETCH REVIEWS END ===');
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews
  };
};