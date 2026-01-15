import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import ProductReviews from './Review';
import PopularItemsFromSeller from './About';

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  maxRating: number;
  image: string;
  location: string;
  isWishlisted: boolean;
}

const ProductsGridComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'about'>('products');
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Photopulse camera',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/camera.png',
      location: 'Nsukka, Enugu',
      isWishlisted: false
    },
    {
      id: '2',
      name: 'Ultra hydrating moisturizer',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/body.png',
      location: 'Nsukka, Enugu',
      isWishlisted: false
    },
    {
      id: '3',
      name: 'Photopulse camera',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/car.png',
      location: 'Nsukka, Enugu',
      isWishlisted: false
    },
    {
      id: '4',
      name: 'Photopulse camera',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/camera.png',
      location: 'Nsukka, Enugu',
      isWishlisted: false
    },
    {
      id: '5',
      name: 'Photopulse camera',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/car.png',
      location: 'Nsukka, Enugu',
      isWishlisted: false
    },
    {
      id: '6',
      name: 'HP laptop',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/laptop2.png',
      location: 'Nsukka, Enugu',
      isWishlisted: false
    },
    {
      id: '7',
      name: 'Ultra hydrating moisturizer',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/body.png',
      location: 'Nsukka, Enugu',
      isWishlisted: false
    },
    {
      id: '8',
      name: 'Ordinary skincare set',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/cream.png',
      location: 'Nsukka, Enugu',
      isWishlisted: false
    }
  ]);

  const toggleWishlist = (productId: string) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, isWishlisted: !product.isWishlisted }
          : product
      )
    );
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
            ? 'fill-black text-black'
            : 'text-black'
        }`}
      />
    ));
  };

  const handleProductClick = (productId: string) => {
    console.log('Product clicked:', productId);
  };

  

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="flex gap-8 border-b border-gray-200">
          {['products', 'reviews', 'about'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-3 text-base font-medium capitalize transition-colors duration-200 relative ${
                activeTab === tab
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group"
              onClick={() => handleProductClick(product.id)}
            >
              {/* Product Image */}
              <div className="relative bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[full] object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgMTEyLjVIMTc1VjE4Ny41SDEyNVYxMTIuNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                  }}
                />
                
                {/* Wishlist Button */}
                
              </div>

              {/* Product Info */}
              <div className="p-3">
                {/* Rating */}
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5 mb-2">
                  {renderStars(product.rating, product.maxRating)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="p-1.5 bg-white rounded-full transition-colors duration-200"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      product.isWishlisted
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-700'
                    }`}
                  />
                </button>
                </div>

                {/* Product Name */}
                <h3 className="text-sm font-normal text-gray-900 mb-1">
  {product.name.length > 50 
    ? `${product.name.substring(0, 50)}...`
    : product.name
  }
</h3>

                {/* Price */}
                <div className="mb-1">
                  <span className="text-base font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                </div>

                {/* Location */}
                <p className="text-xs text-gray-500">
                  {product.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews Tab Content */}
      {activeTab === 'reviews' && (
        <div className="">
          <div className="text-center text-gray-500">
            
            <ProductReviews/>
          </div>
        </div>
      )}

      {/* About Tab Content */}
      {activeTab === 'about' && (
        <div className="bg-gray-50 rounded-xl p-12">
          <div className="text-center text-gray-500">
           <PopularItemsFromSeller/>
          </div>
        </div>
      )}

      {/* Demo Info */}
      {/* <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Component Features:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Navigation tabs with active state indicators</li>
          <li>• 4-column responsive product grid</li>
          <li>• Interactive wishlist hearts with state management</li>
          <li>• Star rating display and price formatting</li>
          <li>• Hover effects and smooth transitions</li>
          <li>• Placeholder content for Reviews and About tabs</li>
        </ul>
      </div> */}
    </div>
  );
};

export default ProductsGridComponent;