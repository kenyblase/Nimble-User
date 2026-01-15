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

interface UseFetchParentCategoryReturn {
  category: Category | null;
  subCategories: Category[];
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  fetchParentCategoryData: (params?: FetchParams) => Promise<void>;
  loadMoreProducts: () => Promise<any>;
  refetch: () => Promise<void>;
}

export const useFetchParentCategory = (
  parentCategoryId: string | undefined,
  initialParams: FetchParams = {}
): UseFetchParentCategoryReturn => {
  const [category, setCategory] = useState<Category | null>(null);
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

  const fetchParentCategoryData = async (params: FetchParams = {}): Promise<void> => {
    console.log('=== FETCH PARENT CATEGORY START ===');
    console.log('parentCategoryId:', parentCategoryId);
    
    if (!parentCategoryId) {
      console.log('❌ No parentCategoryId provided, skipping fetch');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 STEP 1: Fetching parent category details...');
      
      // First, fetch the parent category details to get the name
      const categoryResponse = await categoryApi.getParentCategory(parentCategoryId);
      console.log('✅ Parent category API response:', categoryResponse);
      console.log('✅ Parent category response data:', categoryResponse.data);
      
      // Always use categoryResponse.data (the Axios response wraps data in .data property)
      if (categoryResponse.data) {
        console.log('✅ Setting category from response.data');
        setCategory(categoryResponse.data);
        console.log('✅ Parent category name:', categoryResponse.data.name);
      } else {
        console.warn('⚠️ Unexpected parent category response structure');
        console.warn('Full response:', categoryResponse);
      }

      console.log('🔄 STEP 2: Fetching subcategories and products...');
      
      // Then fetch subcategories and products
      const dataResponse = await categoryApi.getParentCategoryWithData(parentCategoryId, {
        page: 1,
        limit: 12,
        ...initialParams,
        ...params
      });

      console.log('✅ Subcategories/products data:', dataResponse.data);

      const { 
        subCategories: fetchedSubCategories = [], 
        products: fetchedProducts = [], 
        pagination: fetchedPagination = {} 
      } = dataResponse.data;

      // Set the actual data from backend
      setSubCategories(fetchedSubCategories);
      setProducts(fetchedProducts);
      
      // Set pagination based on actual data
      setPagination({
        page: fetchedPagination.currentPage || 1,
        totalPages: fetchedPagination.totalPages || 1,
        totalProducts: fetchedPagination.totalProducts || 0,
        hasNext: (fetchedPagination.currentPage || 1) < (fetchedPagination.totalPages || 1),
        hasPrev: (fetchedPagination.currentPage || 1) > 1
      });

    } catch (err: any) {
      console.error('❌ API Call Failed!');
      console.error('Error:', err);
      console.error('Error Response:', err.response);
      
      const errorMessage = err.response?.data?.message || 'Failed to fetch category data';
      setError(errorMessage);
      
    } finally {
      setLoading(false);
      console.log('=== FETCH PARENT CATEGORY END ===');
      console.log('Final category state:', category);
    }
  };

  const loadMoreProducts = async (): Promise<any> => {
    if (!pagination.hasNext || loading) return;

    try {
      const nextPage = pagination.page + 1;
      console.log('🔄 Loading more products, page:', nextPage);
      
      const response = await categoryApi.getParentCategoryWithData(parentCategoryId!, {
        page: nextPage,
        limit: 12,
        ...initialParams
      });

      const { products: newProducts, pagination: newPagination } = response.data;

      console.log('✅ Loaded more products:', newProducts.length);
      
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
      console.error('❌ Load more failed:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load more products';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchParentCategoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentCategoryId]);

  return {
    category,
    subCategories,
    products,
    loading,
    error,
    pagination,
    fetchParentCategoryData,
    loadMoreProducts,
    refetch: () => fetchParentCategoryData()
  };
};