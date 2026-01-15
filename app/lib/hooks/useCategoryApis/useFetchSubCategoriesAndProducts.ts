import { useState, useEffect } from 'react';
import { categoryApi } from '../../api/categoryApi';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images?: string[];
  category?: string;
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

interface UseFetchSubCategoriesAndProductsReturn {
  subCategories: Category[];
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  fetchData: (params?: FetchParams) => Promise<any>;
  loadMoreProducts: () => Promise<any>;
  refetch: () => Promise<any>;
}

export const useFetchSubCategoriesAndProducts = (
  parentCategoryId: string | undefined,
  initialParams: FetchParams = {}
): UseFetchSubCategoriesAndProductsReturn => {
  const [subCategories, setSubCategories] = useState<Category[]>([]);
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

  const fetchData = async (params: FetchParams = {}): Promise<any> => {
    if (!parentCategoryId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use getParentCategoryWithData instead (which exists based on the error message)
      const response = await categoryApi.getParentCategoryWithData(parentCategoryId, {
        page: 1,
        limit: 12,
        ...initialParams,
        ...params
      });

      const { 
        subCategories: fetchedSubCategories = [], 
        products: fetchedProducts = [], 
        pagination: fetchedPagination 
      } = response.data;

      setSubCategories(fetchedSubCategories);
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
      const errorMessage = err.response?.data?.message || 'Failed to fetch category data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = async (): Promise<any> => {
    if (!pagination.hasNext || loading) return;

    try {
      const nextPage = pagination.page + 1;
      const response = await categoryApi.getParentCategoryWithData(parentCategoryId!, {
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
      const errorMessage = err.response?.data?.message || 'Failed to load more products';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentCategoryId]);

  return {
    subCategories,
    products,
    loading,
    error,
    pagination,
    fetchData,
    loadMoreProducts,
    refetch: () => fetchData()
  };
};