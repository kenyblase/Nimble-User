import React, { useState, useEffect } from 'react';
import { Heart, Star, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFetchProducts } from '../lib/hooks/useProductApis/useFetchProducts';
import { useWishlist } from '../lib/hooks/useProductApis/useWishlist';
import { useAuthStore } from '../lib/stores/useAuthStore';

// Remove the BackendProduct interface and create a simpler type that matches what you actually use
interface TransformedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  maxRating: number;
  image: string;
  location: string;
  isWishlisted: boolean;
  vendor: string;
}



const MostPurchasedSection: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  // Use our custom hooks
  const { 
    products: backendProducts, 
    loading, 
    error, 
    pagination, 
    refetch,
    loadMore 
  } = useFetchProducts();
  
  const { toggleWishlist, loading: wishlistLoading } = useWishlist();

  // Transform backend data to frontend format - use 'any' or a more flexible type
const transformProduct = (product: any): TransformedProduct => {
  // Extract location from product's location object
  const locationStr = product.location 
    ? `${product.location.city || ''}${product.location.city && product.location.state ? ', ' : ''}${product.location.state || ''}`
    : 'Location not specified';
  
  // Handle vendor - API returns just {_id: "..."}, so we'll need to fetch vendor details separately
  // or show a generic label
  const vendorDisplay = product.vendor?.businessName || product.vendor?.name || 'Vendor';
  
  return {
    id: product._id || product.id,
    name: product.name || 'Unnamed Product',
    price: product.price || 0,
    originalPrice: product.originalPrice,
    rating: Math.round(product.averageRating || 0), // Use averageRating from API
    maxRating: 5,
    image: product.images?.[0] || product.image || '/placeholder-image.jpg',
    location: locationStr.trim() || 'Location not specified',
    isWishlisted: false, // You might want to fetch this from a separate wishlist endpoint
    vendor: vendorDisplay
  };
};

  const [transformedProducts, setTransformedProducts] = useState<TransformedProduct[]>([]);

  // Transform products when backend data changes
  useEffect(() => {
    if (backendProducts && backendProducts.length > 0) {
      const transformed = backendProducts.map(transformProduct);
      setTransformedProducts(transformed);
    } else {
      setTransformedProducts([]);
    }
  }, [backendProducts]);

  const handleWishlistToggle = async (productId: string, currentStatus: boolean) => {
    try {
      const newStatus = await toggleWishlist(productId, currentStatus);
      
      // Update local state optimistically
      setTransformedProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, isWishlisted: newStatus }
            : product
        )
      );
    } catch (error) {
      console.error('Wishlist toggle failed:', error);
      // You might want to show a toast notification here
    }
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const renderStars = (rating: number, maxRating: number) => {
    return Array.from({ length: maxRating }, (_, index) => (
      <Star
        key={index}
        className={`w-2 h-2 ${
          index < rating
            ? 'fill-black text-black'
            : 'text-black'
        }`}
      />
    ));
  };

  const handleRetry = () => {
    refetch();
  };

  // Loading skeleton - updated for 2-column grid
  const renderSkeleton = () => (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state
  if (error && transformedProducts.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Most purchased</h2>
        </div>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Failed to load products</div>
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Most purchased</h2>
        {loading && (
          <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />
        )}
      </div>

      {/* Products Grid - Updated to 2 columns */}
      {loading && transformedProducts.length === 0 ? (
        renderSkeleton()
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {transformedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group block"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgMTEyLjVIMTc1VjE4Ny41SDEyNVYxMTIuNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                    }}
                  />
                  
                  {/* Wishlist Button */}
                  {/* <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleWishlistToggle(product.id, product.isWishlisted);
                    }}
                    disabled={wishlistLoading}
                    className="absolute top-2 right-2 p-1.5 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-colors duration-200 disabled:opacity-50"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        product.isWishlisted
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600 hover:text-red-500'
                      }`}
                    />
                  </button> */}
                </div>

                {/* Product Info */}
                <div className="p-3">
                  {/* Rating */} 
                  <div className='relative flex w-full justify-between'>
                  <div className="flex items-center gap-[0.2px] mb-1">
                    {renderStars(product.rating, product.maxRating)}
                    {/* <span className="text-xs text-gray-500 ml-1">
                      ({product.rating})
                    </span> */}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleWishlistToggle(product.id, product.isWishlisted);
                    }}
                    disabled={wishlistLoading}
                    className="absolute right-0 p-0.7 sm:p-1.5 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-colors duration-200 disabled:opacity-50"
                  >
                    <Heart
                      className={`w-2.5 h-2.5 ${
                        product.isWishlisted
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600 hover:text-red-500'
                      }`}
                    />
                  </button>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-[11px] sm:text-sm font-light text-gray-900 mb-1 line-clamp-2 leading-tight">
                    {product.name}
                  </h3>

                  {/* Vendor */}
                  {/* <p className="text-xs text-gray-600 mb-1 line-clamp-1">
                    By {product.vendor}
                  </p> */}

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] sm:text-base font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {/* {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )} */}
                  </div>
                  

                  {/* Location */}
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {product.location}
                  </p>
                  
                </div>
                
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {pagination?.hasNext && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}

          {/* Empty State */}
          {transformedProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No products found</div>
              <button
                onClick={refetch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MostPurchasedSection;