import { useState, useEffect } from 'react';
import { categoryApi } from '../../api/categoryApi';

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
  totalProducts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface FetchParams {
  page?: number;
  limit?: number;
  sort?: string;
  [key: string]: any;
}

interface UseFetchSubCategoryProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  fetchSubCategoryProducts: (params?: FetchParams) => Promise<any>;
  loadMore: () => Promise<any>;
  refetch: () => Promise<any>;
}

export const useFetchSubCategoryProducts = (
  subCategoryId: string | undefined,
  initialParams: FetchParams = {}
): UseFetchSubCategoryProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchSubCategoryProducts = async (params: FetchParams = {}): Promise<any> => {
    if (!subCategoryId) {
      console.log('No subCategoryId provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching subcategory products for ID:', subCategoryId);
      
      const response = await categoryApi.getSubCategoryProducts(subCategoryId, {
        page: 1,
        limit: 12,
        ...initialParams,
        ...params
      });

      console.log('Subcategory products response:', response.data);

      const { products: fetchedProducts, pagination: fetchedPagination } = response.data;

      setProducts(fetchedProducts);
      setPagination({
        page: fetchedPagination.currentPage,
        totalPages: fetchedPagination.totalPages,
        totalProducts: fetchedPagination.totalProducts,
        hasNext: fetchedPagination.currentPage < fetchedPagination.totalPages,
        hasPrev: fetchedPagination.currentPage > 1
      });

      return response.data;
    } catch (err: any) {
      console.error('Failed to fetch subcategory products:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch products';
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
      const response = await categoryApi.getSubCategoryProducts(subCategoryId!, {
        page: nextPage,
        limit: 12,
        ...initialParams
      });

      const { products: newProducts, pagination: newPagination } = response.data;

      setProducts(prev => [...prev, ...newProducts]);
      setPagination({
        page: newPagination.currentPage,
        totalPages: newPagination.totalPages,
        totalProducts: newPagination.totalProducts,
        hasNext: newPagination.currentPage < newPagination.totalPages,
        hasPrev: newPagination.currentPage > 1
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load more products';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchSubCategoryProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategoryId]);

  return {
    products,
    loading,
    error,
    pagination,
    fetchSubCategoryProducts,
    loadMore,
    refetch: () => fetchSubCategoryProducts()
  };
};