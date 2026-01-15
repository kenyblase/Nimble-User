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

interface UseFetchCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<Category[]>;
}

export const useFetchCategories = (): UseFetchCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async (): Promise<Category[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await categoryApi.getParentCategories();
      setCategories(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch categories';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};