'use client'
import React from 'react'
import { useState } from 'react'
import Header from '../components/TopBar'
import { Heart, Star } from 'lucide-react';
import Footer from '../components/Footer';
import Link from 'next/link'; // Import Next.js Link component
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

interface Category {
  id: string;
  name: string;
  image: string; 
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  maxRating: number;
  image: string;
  location: string;
  isWishlisted: boolean;
}

const Health = () => {
  const router = useRouter(); // Initialize router

  const categories: Category[] = [
    { id: 'skincare', name: 'Skincare', image: "/electronics.png" },
    { id: 'hair-care', name: 'Haircare', image: "/home.png" },
    { id: 'oral-care', name: 'Oralcare', image: "/health.png" },
    { id: 'hair-beauty', name: 'Hairbeauty', image: "/babies.png" },
    { id: 'makeup', name: 'Makeup', image: "/sports.png" },
    { id: 'fragrances', name: 'Fragrances', image: "/automotive.png" },
    { id: 'wellness-products', name: 'Wellness Products', image: "/food.png" }
  ];

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Photopulse camera',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/camera.png',
      location: 'Awojek, Enugu',
      isWishlisted: false
    },
    {
      id: '2',
      name: 'Ordinary skincare set',
      price: 40000,
      rating: 5,
      maxRating: 5,
      image: '/body.png',
      location: 'Awojek, Enugu',
      isWishlisted: false
    },
    {
      id: '3',
      name: 'Ultra hydrating moisturizer',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/cream.png',
      location: 'Awojek, Enugu',
      isWishlisted: false
    },
    {
      id: '4',
      name: 'HP laptop',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/laptop2.png',
      location: 'Awojek, Enugu',
      isWishlisted: false
    },
    {
      id: '5',
      name: 'Photopulse camera',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/car.png',
      location: 'Awojek, Enugu',
      isWishlisted: false
    },
    {
      id: '6',
      name: 'Photopulse camera',
      price: 40000,
      rating: 5,
      maxRating: 5,
      image: '/camera.png',
      location: 'Awojek, Enugu',
      isWishlisted: false
    },
    {
      id: '7',
      name: 'Photopulse camera',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/body.png',
      location: 'Awojek, Enugu',
      isWishlisted: false
    },
    {
      id: '8',
      name: 'Photopulse camera',
      price: 40000,
      rating: 4,
      maxRating: 5,
      image: '/camera.png',
      location: 'Awojek, Enugu',
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
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleProductClick = (productId: string) => {
    console.log('Product clicked:', productId);
  };

  // Handler for category clicks
  const handleCategoryClick = (categoryId: string) => {
    // You can customize the route as needed
    router.push(`/category/${categoryId}`);
  };

  return (
    <div className='w-full h-full flex flex-col text-black justify-center items-center'>
      <Header/>
      <div className='w-[90%]'>
        <h1 className='text-2xl font-bold my-6'>Health & Beauty</h1>
        
        {/* Categories Section */}
        <div className="px-4">
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
              // Option 1: Using Next.js Link (recommended for internal navigation)
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Image Circle */}
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-all duration-200 group-hover:scale-105 transform overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Category Name */}
                <span className="text-[10px] md:text-[11.3px] text-gray-700 text-center font-medium leading-tight">
                  {category.name}
                </span>
              </Link>

              // Option 2: Using onClick handler (if you need to do more than just navigation)
              /*
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-all duration-200 group-hover:scale-105 transform overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] md:text-[11.3px] text-gray-700 text-center font-medium leading-tight">
                  {category.name}
                </span>
              </div>
              */
            ))}
          </div>
        </div>

        {/* Products Section */}
        <h1 className='mt-[30px] mb-[20px] font-bold text-[22px]'>Trending from this Category</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
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
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-colors duration-200"
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
                </div>
  
                {/* Product Name */}
                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
  
                {/* Price */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
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
      </div>
      
      <div className="w-[98.8vw] relative left-0 overflow-x-hidden mt-10">
        <Footer/>
      </div>
    </div>
  )
}

export default Health