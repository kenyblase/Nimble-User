'use client';
import React, { useState, useEffect } from 'react';
import { Heart, Link, Star } from 'lucide-react';
import Header from '../components/TopBar';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNav';
import { useFetchRequests } from '../lib/hooks/useRequestApi/useFetchRequests';
import { Request } from '../lib/api/requestsApi';

const Requests: React.FC = () => {
  const { data: apiRequests, loading, error, refetch } = useFetchRequests();
  const [localRequests, setLocalRequests] = useState<Request[]>([]);

  // Sync local state with fetched requests
  useEffect(() => {
    console.log('Requests from hook:', apiRequests);
    if (Array.isArray(apiRequests)) {
      setLocalRequests(apiRequests);
    } else {
      console.warn('apiRequests is not an array:', apiRequests);
      setLocalRequests([]);
    }
  }, [apiRequests]);

  const toggleWishlist = (requestId: string) => {
    setLocalRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, isWishlisted: !request.isWishlisted }
          : request
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
        className={`w-3 h-3 ${
          index < safeRating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleRequestClick = (requestId: string) => {
    console.log('Request clicked:', requestId);
    // You can navigate to request detail page here
  };

  // Loading state
  if (loading) {
    return (
      <div className='w-full min-h-screen bg-white'>
        <div className="hidden md:block">
          <Header/>
        </div>
        
        <main className="pb-20 md:pb-0">
          <div className="w-full max-w-6xl mx-auto px-4 py-8 bg-white mt-0 sm:mt-[15px]">
            <div className='flex justify-between items-center'>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Requests</h2>
              </div>
              <a href='/requests/create-request' className='bg-[#FE7A36] text-white px-4 py-2 rounded-[100px] mb-4'>
                Create request
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Footer/>
        </main>
        
        <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
          <BottomNavigation />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='w-full min-h-screen bg-white'>
        <div className="hidden md:block">
          <Header/>
        </div>
        
        <main className="pb-20 md:pb-0">
          <div className="w-full max-w-6xl mx-auto px-4 py-8 bg-white mt-0 sm:mt-[15px]">
            <div className='flex justify-between items-center'>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Requests</h2>
              </div>
              <a href='/requests/create-request' className='bg-[#FE7A36] text-white px-4 py-2 rounded-[100px] mb-4'>
                Create request
              </a>
            </div>

            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Error loading requests: {error}</p>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          </div>
          
          <Footer/>
        </main>
        
        <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
          <BottomNavigation />
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-white'>
      {/* Header - Visible only on desktop/tablet */}
      <div className="hidden md:block">
        <Header/>
      </div>
      
      {/* Main Content with bottom padding for mobile nav */}
      <main className="pb-20 md:pb-0">
        <div className="w-full max-w-6xl mx-auto px-4 py-8 bg-white mt-0 sm:mt-[15px]">
          
          {/* Section Header */}
          <div className='flex justify-between items-center'>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Requests</h2>
            </div>
            <a href='/requests/create-request' className='bg-[#FE7A36] text-white px-4 py-2 rounded-[100px] mb-4'>
              Create request
            </a>
          </div>

          {/* Requests Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {localRequests.length > 0 ? (
              localRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                  onClick={() => handleRequestClick(request.id)}
                >
                  {/* Request Image */}
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={request.image}
                      alt={request.name}
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
                        toggleWishlist(request.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-colors duration-200"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          request.isWishlisted
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-600 hover:text-red-500'
                        }`}
                      />
                    </button>

                    {/* Status Badge */}
                    {request.status && (
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          request.status === 'active' ? 'bg-green-100 text-green-800' :
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Request Info */}
                  <div className="p-4">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(request.rating, request.maxRating)}
                      <span className="text-xs text-gray-500 ml-1">
                        ({request.rating || 0})
                      </span>
                    </div>

                    {/* Request Name */}
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {request.name}
                    </h3>

                    {/* Price/Budget */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(request.price)}
                      </span>
                      {request.originalPrice && request.originalPrice > request.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(request.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Location */}
                    <p className="text-xs text-gray-500">
                      {request.location}
                    </p>

                    {/* Description preview */}
                    {request.description && (
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                        {request.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 mb-4">No requests found.</p>
                <a 
                  href='/requests/create-request' 
                  className='bg-[#FE7A36] text-white px-6 py-2 rounded-[100px] inline-block hover:bg-orange-500 transition-colors'
                >
                  Create your first request
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <Footer/>
      </main>
      
      {/* Bottom Navigation - Visible only on mobile */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Requests;