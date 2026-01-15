import apiClient from './apiClient';

// Base interfaces
interface BaseCategory {
  id: string;
  name: string;
  slug?: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  [key: string]: any; // Allow additional params
}

// Generic response type
type ApiResponse<T> = Promise<{
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
}>;

export const categoryApi = {
  // Get all parent categories
  getParentCategories: (): ApiResponse<any[]> => 
    apiClient.get('/products/categories'),

  // Get single parent category
  getParentCategory: (parentCategoryId: string): ApiResponse<any> => 
    apiClient.get(`/products/categories/${parentCategoryId}`),

  // Get parent category with products and subcategories
  getParentCategoryWithData: (
    parentCategoryId: string, 
    params: PaginationParams = {}
  ): ApiResponse<any> => 
    apiClient.get(`/products/category/${parentCategoryId}`, { params }),

  // Get subcategory products
  getSubCategoryProducts: (
    subCategoryId: string, 
    params: PaginationParams = {}
  ): ApiResponse<any> => 
    apiClient.get(`/products/subcategory/${subCategoryId}`, { params }),

  // Get all categories with products count
  getAllCategories: (): ApiResponse<any[]> => 
    apiClient.get('/categories'),
};