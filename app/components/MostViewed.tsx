import React, { useState, useEffect } from 'react';
import { Heart, Star } from 'lucide-react';
import Link from 'next/link';
import { useFetchMostViewed } from '../lib/hooks/useProductApis/useFetchMostViewed';
import { Product } from '../lib/api/productsApi';

const MostViewedSection: React.FC = () => {
  const { data: mostViewedProducts, loading, error, refetch } = useFetchMostViewed();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  // Sync local state with fetched products
  useEffect(() => {
    console.log('Most viewed products from hook:', mostViewedProducts);
    if (Array.isArray(mostViewedProducts)) {
      setLocalProducts(mostViewedProducts);
    } else {
      console.warn('mostViewedProducts is not an array:', mostViewedProducts);
      setLocalProducts([]);
    }
  }, [mostViewedProducts]);

  const toggleWishlist = (productId: string) => {
    setLocalProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, isWishlisted: !product.isWishlisted }
          : product
      )
    );
  };

  const formatPrice = (price: number) => {
    return `₦${price?.toLocaleString() || '0'}`;
  };

  const renderStars = (rating: number, maxRating: number) => {
    const safeRating = rating || 0;
    const safeMaxRating = maxRating || 5;
    
    return Array.from({ length: safeMaxRating }, (_, index) => (
      <Star
        key={index}
        className={`w-2 h-2 ${
          index < safeRating
            ? 'fill-black text-black'
            : 'text-black'
        }`}
      />
    ));
  };

  // Loading state - Updated skeleton for 2-column grid on mobile
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-3 py-6 sm:px-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Most viewed</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-3 sm:p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-3 py-6 sm:px-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Most viewed</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Error loading products: {error}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering products:', localProducts);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 py-6 sm:px-4 sm:py-8">
      {/* Section Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Most viewed</h2>
      </div>

      {/* Products Grid - 2 columns on mobile, 4 on large screens */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {localProducts.length > 0 ? (
          localProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group block"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
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
                
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-4">
                {/* Rating */}
                 <div className='relative flex'>
                                  <div className="flex items-center gap-[0.2px] mb-1">
                                    {renderStars(product.rating, product.maxRating)}
                                    <span className="text-xs text-gray-500 ml-1">
                                      ({product.rating})
                                    </span>
                                  </div>
                                  <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
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
                <h3 className="text-[11px] sm:text-sm font-light text-gray-900 line-clamp-2 leading-snug ">
                  {product.name || 'Unnamed Product'}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[11px] sm:text-xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {/* {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )} */}
                </div>

                {/* Location */}
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">
                  {product.location || 'Location not available'}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">No products found.</p>
            <button
              onClick={refetch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MostViewedSection;