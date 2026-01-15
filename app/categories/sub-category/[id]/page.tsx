'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/app/components/TopBar'
import FiltersSidebarComponent from '@/app/components/SubSidebar'
import { Heart, Star, RefreshCw } from 'lucide-react';
import Footer from '@/app/components/Footer'
import { useFetchSubCategoryProducts } from '@/app/lib/hooks/useProductApis/useFetchSubCategoryProducts'
import { useWishlist } from '@/app/lib/hooks/useProductApis/useWishlist'
import Link from 'next/link'

// Remove the BackendProduct interface and use Product directly
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

const SubCategory = () => {
  const params = useParams();
  const subCategoryId = params.id as string;

  const { 
    products: backendProducts, 
    loading, 
    error,
    pagination,
    loadMore
  } = useFetchSubCategoryProducts(subCategoryId);

  const { toggleWishlist, loading: wishlistLoading } = useWishlist();

  // Update transform function to use the actual Product type
  const transformProduct = (product: any): TransformedProduct => {
    // Handle vendor object format
    const vendorInfo = typeof product.vendor === 'object' ? product.vendor : {};
    
    return {
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      rating: product.rating || 4,
      maxRating: 5,
      image: product.images?.[0] || '/placeholder-product.png',
      location: vendorInfo?.location || 'Location not specified',
      isWishlisted: false,
      vendor: vendorInfo?.businessName || vendorInfo?.name || 'Unknown Vendor'
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
    }
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const renderStars = (rating: number, maxRating: number) => {
    return Array.from({ length: maxRating }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleProductClick = (productId: string) => {
    console.log('Product clicked:', productId);
    // You can add navigation to product detail page here
    // router.push(`/product/${productId}`);
  };

  // Loading skeleton for products
  const renderProductsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className='w-full'>
      <Header/>
      <div className='w-[100%] flex justify-between'>
        <FiltersSidebarComponent/>
        <div className='flex flex-col w-[75%] mx-auto'>
          {/* Page Title */}
          <h1 className='mt-[30px] mb-[20px] font-bold text-black text-[22px]'>Skincare</h1>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">Error: {error}</p>
            </div>
          )}

          {/* Products Count */}
          {!loading && !error && (
            <div className="mb-4 text-sm text-gray-600">
              Showing {transformedProducts.length} of {pagination?.totalProducts || 0} products
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            renderProductsSkeleton()
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {transformedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                    onClick={() => handleProductClick(product.id)}
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWishlistToggle(product.id, product.isWishlisted);
                        }}
                        disabled={wishlistLoading}
                        className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-colors duration-200 disabled:opacity-50"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            product.isWishlisted
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-600 hover:text-red-500'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(product.rating, product.maxRating)}
                        <span className="text-xs text-gray-500 ml-1">
                          ({product.rating})
                        </span>
                      </div>

                      {/* Product Name */}
                      <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Vendor */}
                      <p className="text-xs text-gray-600 mb-2">
                        By {product.vendor}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Location */}
                      <p className="text-xs text-gray-500">
                        {product.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {pagination?.hasNext && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2 font-medium"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More Products'
                    )}
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!loading && transformedProducts.length === 0 && !error && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">No products found in this subcategory</div>
                  <p className="text-gray-400">Check back later for new products</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default SubCategory