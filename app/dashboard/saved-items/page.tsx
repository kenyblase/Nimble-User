'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Settings, 
  Heart,
  MoreVertical,
  Eye,
  Share2,
  HeartOff
} from 'lucide-react';



interface Product {
  id: string;
  title: string;
  price: number;
  location: string;
  rating: number;
  image: string;
  availability?: 'Available' | 'Sold';
  isSaved: boolean;
}

const savedProducts: Product[] = [
  {
    id: '1',
    title: 'Photopulse camera',
    price: 40000,
    location: 'Naukku, Enugu',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1606980707986-e8cebc4c6e5f?w=400&h=300&fit=crop',
    availability: 'Available',
    isSaved: true
  },
  {
    id: '2',
    title: 'Photopulse camera',
    price: 40000,
    location: 'Naukku, Enugu',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop',
    availability: 'Sold',
    isSaved: true
  }
];

export default function SavedItemsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(savedProducts);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const toggleMenu = (productId: string) => {
    setOpenMenuId(openMenuId === productId ? null : productId);
  };

  const handleView = (productId: string) => {
    setOpenMenuId(null);
    router.push(`/products/${productId}`);
  };

  const handleShare = (product: Product) => {
    setOpenMenuId(null);
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this ${product.title} for ₦${product.price.toLocaleString()}`,
        url: window.location.href
      });
    }
  };

  const handleUnsave = (productId: string) => {
    setOpenMenuId(null);
    setProducts(products.filter(p => p.id !== productId));
  };

  const toggleSave = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, isSaved: !p.isSaved } : p
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Saved items</h1>
          </div>
          <button 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-900" />
          </button>
        </div>
      </header>

      {/* Products Grid */}
      <main className="px-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="relative">
              {/* Product Card */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                {/* Image */}
                <div className="relative aspect-[4/3]">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Heart Icon */}
                  <button
                    onClick={() => toggleSave(product.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    aria-label="Save item"
                  >
                    <Heart 
                      className={`w-4 h-4 ${product.isSaved ? 'fill-red-600 text-red-600' : 'text-gray-600'}`}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-3">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < product.rating ? 'bg-gray-900' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Title and Menu */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {product.title}
                    </h3>
                    <button
                      onClick={() => toggleMenu(product.id)}
                      className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Price */}
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    ₦{product.price.toLocaleString()}
                  </p>

                  {/* Location */}
                  <p className="text-xs text-gray-500 mb-2">
                    {product.location}
                  </p>

                  {/* Availability Badge */}
                  {product.availability && (
                    <span className={`inline-block text-xs px-2 py-1 rounded ${
                      product.availability === 'Available'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {product.availability}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Menu */}
              {openMenuId === product.id && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed z-20"
                    onClick={() => setOpenMenuId(null)}
                  />
                  
                  {/* Menu */}
                  <div className="absolute right-[30px] top-[150px] mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-30 overflow-hidden">
                    <button
                      onClick={() => handleView(product.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleShare(product)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button
                      onClick={() => handleUnsave(product.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <HeartOff className="w-4 h-4" />
                      Unsave
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}