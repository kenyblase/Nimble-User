import { useState, useEffect } from 'react';
import { productApi } from '../../api/productsApi';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  images?: string[];
  vendor?: {
    _id: string;
    businessName: string;
    location?: string;
  } | string;
  category?: {
    _id: string;
    name: string;
  } | string;
  description?: string;
  isWishlisted?: boolean;
  type?: string;
  color?: string;
  condition?: string;
  gender?: string;
  sizes?: string[];
  bulkPrices?: {
    quantity: number;
    price: number;
  }[];
  colours?: string[];
  status?: string;
  shippingOptions?: string[];
  deliveryTimelines?: {
    _id: string;
    city: string;
    period: string;
  }[];
  location?: {
    state?: string;
  };
}


interface UseFetchProductReturn {
  product: Product | null;
  similarProducts: Product[];
  sellerProducts: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFetchProduct = (productId: string | undefined): UseFetchProductReturn => {
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductData = async (): Promise<void> => {
    console.log('=== FETCH PRODUCT START ===');
    console.log('productId:', productId);
    
    if (!productId) {
      console.log('❌ No productId provided, skipping fetch');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Fetching product details...');
      
      // Fetch main product details
      const productResponse = await productApi.getProductById(productId);
      console.log('✅ Product API Response:', productResponse.data);
      
      if (productResponse.data?.product) {
        const fetchedProduct = productResponse.data.product;
        setProduct(fetchedProduct);
        console.log('✅ Product set:', fetchedProduct.name);
        
        // Extract category ID safely
        const categoryId = typeof fetchedProduct.category === 'object' 
          ? fetchedProduct.category?._id 
          : fetchedProduct.category;
        
        // Extract vendor ID safely
        const vendorId = typeof fetchedProduct.vendor === 'object'
          ? fetchedProduct.vendor?._id
          : fetchedProduct.vendor;

        console.log('🔄 Category ID:', categoryId);
        console.log('🔄 Vendor ID:', vendorId);
        
        // Fetch similar products based on category
        if (categoryId) {
          try {
            console.log('🔄 Fetching similar products...');
            const similarResponse = await productApi.getSimilarProducts(categoryId, { limit: 8 });
            console.log('✅ Similar products:', similarResponse.data.products?.length || 0);
            setSimilarProducts(similarResponse.data.products || similarResponse.data || []);
          } catch (similarErr) {
            console.warn('⚠️ Could not fetch similar products:', similarErr);
            // Fallback: try getting products by category using getAllProducts
            try {
              const fallbackResponse = await productApi.getAllProducts({ 
                category: categoryId,
                limit: 8 
              });
              setSimilarProducts(fallbackResponse.data.products || fallbackResponse.data || []);
            } catch (fallbackErr) {
              console.warn('⚠️ Fallback for similar products also failed:', fallbackErr);
              setSimilarProducts([]);
            }
          }
        } else {
          setSimilarProducts([]);
        }
        
        // Fetch other products from the same seller
        if (vendorId) {
          try {
            console.log('🔄 Fetching seller products...');
            const sellerResponse = await productApi.getAllProducts({ 
              vendor: vendorId,
              limit: 8 
            });
            console.log('✅ Seller products:', sellerResponse.data.products?.length || 0);
            
            // Filter out the current product from seller products
            const otherSellerProducts = (sellerResponse.data.products || sellerResponse.data || [])
              .filter((p: Product) => p._id !== productId);
              
            setSellerProducts(otherSellerProducts);
          } catch (vendorErr) {
            console.warn('⚠️ Could not fetch seller products:', vendorErr);
            setSellerProducts([]);
          }
        } else {
          setSellerProducts([]);
        }
      } else {
        setError('Product not found');
      }

    } catch (err: any) {
      console.error('❌ Fetch failed!');
      console.error('Error:', err);
      console.error('Error Response:', err.response);
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch product data';
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('=== FETCH PRODUCT END ===');
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  return {
    product,
    similarProducts,
    sellerProducts,
    loading,
    error,
    refetch: fetchProductData
  };
};