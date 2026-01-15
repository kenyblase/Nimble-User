import { useState, useEffect } from 'react';
import { productApi, Product } from '../../api/productsApi';


export const useFetchVendorProducts = (vendorId: string | null) => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendorProducts = async () => {
    if (!vendorId) {
      setError('Vendor ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const products = await productApi.getVendorProducts(vendorId);
      
      console.log('Transformed vendor products:', products);
      
      if (Array.isArray(products)) {
        setData(products);
      } else {
        console.warn('Expected array but got:', products);
        setData([]);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vendor products');
      console.error('Error fetching vendor products:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) {
      fetchVendorProducts();
    }
  }, [vendorId]);

  const refetch = () => {
    fetchVendorProducts();
  };

  // Filter products by status
  const getProductsByStatus = (status: string) => {
    return data.filter(product => product.status === status);
  };

  return {
    data,
    loading,
    error,
    refetch,
    getProductsByStatus,
    activeProducts: getProductsByStatus('active'),
    pendingProducts: getProductsByStatus('pending'),
    draftProducts: getProductsByStatus('draft'),
    soldProducts: getProductsByStatus('sold'),
    renewProducts: getProductsByStatus('renew'),
    unpaidProducts: getProductsByStatus('unpaid'),
  };
};