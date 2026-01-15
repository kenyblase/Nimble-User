import { useState, useEffect } from 'react';
import { productApi, Product } from '../../api/productsApi';

export const useFetchMostViewed = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMostViewed = async () => {
    try {
      setLoading(true);
      setError(null);
      const products = await productApi.getMostViewed();
      
      console.log('Transformed products:', products);
      
      if (Array.isArray(products)) {
        setData(products);
      } else {
        console.warn('Expected array but got:', products);
        setData([]);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch most viewed products');
      console.error('Error fetching most viewed products:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMostViewed();
  }, []);

  const refetch = () => {
    fetchMostViewed();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};