import { useState } from 'react';
import { productApi, Product } from '../../api/productsApi';

interface CreateProductData {
  name: string;
  price: number;
  description?: string;
  category?: string;
  condition?: string;
  gender?: string;
  sizes?: string[];
  bulkPrices?: {
    minQuantity: number;
    price: number;
  }[];
  colours?: string[];
  location?: {
    city: string;
    state: string;
  };
  isShippedFromAbroad?: boolean;
  shippingAddress?: {
    country: string;
    city: string;
    state: string;
  };
  shippingOptions?: string[];
  deliveryTimelines?: {
    location: string;
    scope: string;
    deliveryType: string;
    numberOfDays: string;
  }[];
  videoLink?: string;
  isNegotiable?: boolean;
  warranty?: {
    value: string;
    period: string;
  };
}

interface UseCreateProductReturn {
  createProduct: (productData: CreateProductData, files: File[]) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  product: Product | null;
}

export const useCreateProduct = (): UseCreateProductReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);

  const createProduct = async (productData: CreateProductData, files: File[]) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      console.log('Creating product with data:', productData);
      console.log('Files to upload:', files);
      
      const response = await productApi.createProduct(productData, files);
      
      console.log('Product creation response:', response);
      
      if (response.product) {
        setProduct(response.product);
        setSuccess(true);
      } else {
        throw new Error(response.message || 'Failed to create product');
      }
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create product';
      setError(errorMessage);
      console.error('Error creating product:', err);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    loading,
    error,
    success,
    product,
  };
};