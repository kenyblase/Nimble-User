import { useState, useEffect } from 'react';
import { productApi } from '../../api/productsApi';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images?: string[];
  category?: string | { _id: string; name: string };
  vendor?: string | { _id: string; name: string };
  description?: string;
  stock?: number;
  [key: string]: any;
}

interface Pagination {
  page: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface FetchParams {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  vendor?: string;
  [key: string]: any;
}

interface UseFetchProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  fetchProducts: (params?: FetchParams) => Promise<any>;
  loadMore: () => Promise<any>;
  refetch: () => Promise<any>;
}

export const useFetchProducts = (initialParams: FetchParams = {}): UseFetchProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchProducts = async (params: FetchParams = {}): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productApi.getAllProducts({
        page: 1,
        limit: 12,
        ...initialParams,
        ...params
      });

      const { products: fetchedProducts, totalCount, totalPages, currentPage } = response.data;

      setProducts(fetchedProducts);
      setPagination({
        page: currentPage,
        totalPages,
        totalCount,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch products';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async (): Promise<any> => {
    if (!pagination.hasNext || loading) return;

    try {
      const nextPage = pagination.page + 1;
      const response = await productApi.getAllProducts({
        page: nextPage,
        limit: 12,
        ...initialParams
      });

      const { products: newProducts, totalCount, totalPages, currentPage } = response.data;

      setProducts(prev => [...prev, ...newProducts]);
      setPagination({
        page: currentPage,
        totalPages,
        totalCount,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load more products';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    loadMore,
    refetch: () => fetchProducts()
  };
};