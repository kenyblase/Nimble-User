'use client'
import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, MapPin } from 'lucide-react';
import { useAuthStore } from '../lib/stores/useAuthStore';
import { authApi } from '../lib/api/authApi';

interface RatingBreakdown {
  stars: number;
  count: number;
  percentage: number;
}

interface VendorStats {
  overallRating: number;
  totalRatings: number;
  ratingBreakdown: RatingBreakdown[];
  totalSales?: number;
  responseRate?: number;
  joinDate?: string;
}

const NavigationTabs = () => {
  const [activeTab, setActiveTab] = useState('Products');
  const tabs = ['Products', 'Media', 'Reviews', 'About'];

  return (
    <div className="border-b border-gray-200 mt-6">
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === tab
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

const SellRate: React.FC = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [vendorStats, setVendorStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();

  // Mock function to fetch vendor stats
  const fetchVendorStats = async (vendorId: string) => {
    try {
      // Mock data that matches the image exactly
      const mockStats: VendorStats = {
        overallRating: 4.6,
        totalRatings: 300,
        totalSales: 150,
        responseRate: 95,
        joinDate: '2023-01-15',
        ratingBreakdown: [
          { stars: 5, count: 120, percentage: 40 },
          { stars: 4, count: 60, percentage: 20 },
          { stars: 3, count: 40, percentage: 13.3 },
          { stars: 2, count: 10, percentage: 3.3 },
          { stars: 1, count: 5, percentage: 1.7 }
        ]
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockStats;
    } catch (err) {
      throw new Error('Failed to fetch vendor statistics');
    }
  };

  useEffect(() => {
    const loadVendorData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        // Set default stats for demonstration
        const defaultStats = {
          overallRating: 4.6,
          totalRatings: 300,
          totalSales: 150,
          responseRate: 95,
          joinDate: '2023-01-15',
          ratingBreakdown: [
            { stars: 5, count: 120, percentage: 40 },
            { stars: 4, count: 60, percentage: 20 },
            { stars: 3, count: 40, percentage: 13.3 },
            { stars: 2, count: 10, percentage: 3.3 },
            { stars: 1, count: 5, percentage: 1.7 }
          ]
        };
        setVendorStats(defaultStats);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch vendor statistics
        const stats = await fetchVendorStats(user.id!);
        setVendorStats(stats);
      } catch (err: any) {
        console.error('Error loading vendor data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Only load if auth is not loading
    if (!authLoading) {
      loadVendorData();
    }
  }, [user, isAuthenticated, authLoading]);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const renderStars = (rating: number, maxRating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const starSize = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    }[size];
    
    return Array.from({ length: maxRating }, (_, index) => {
      const starPosition = index + 1;
      const isFull = starPosition <= Math.floor(rating);
      const isPartial = !isFull && starPosition === Math.ceil(rating) && rating % 1 !== 0;
      
      return (
        <div key={index} className="relative">
          <Star className={`${starSize} text-gray-300`} />
          {isFull && (
            <Star className={`${starSize} fill-[#3652AD] text-[#3652AD] absolute top-0 left-0`} />
          )}
          {isPartial && (
            <div 
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${(rating % 1) * 100}%` }}
            >
              <Star className={`${starSize} fill-[#3652AD] text-[#3652AD]`} />
            </div>
          )}
        </div>
      );
    });
  };

  // User info that matches the image exactly
  const userInfo = {
    name: 'Agnes David',
    displayName: 'Agnes David',
    isVerified: false,
    location: 'Naukka, Enugu',
    avatar: ''
  };

  // Use API data or fallback to defaults
  const ratingData = vendorStats ? {
    overallRating: vendorStats.overallRating,
    totalRatings: vendorStats.totalRatings,
    ratingBreakdown: vendorStats.ratingBreakdown
  } : {
    overallRating: 0,
    totalRatings: 0,
    ratingBreakdown: []
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-lg mt-0 sm:mt-5 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
          <div className="h-8 bg-gray-300 rounded w-24"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded mt-6"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-lg mt-0 sm:mt-5">
        <div className="text-center text-red-600 py-4">
          <p>Failed to load vendor data: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-lg mt-0 sm:mt-5">
      {/* Mobile Layout */}
      
      {/* Mobile Layout */}
      <div className="lg:hidden space-y-6">
        {/* User Info Section */}
        <div className="flex items-start gap-3">
          {/* User Avatar */}
          <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            {userInfo.avatar ? (
              <img 
                src={userInfo.avatar} 
                alt={userInfo.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-base">
                {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            )}
          </div>
          
          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className='flex gap-5'>
              <h3 className="font-semibold text-gray-900 text-base ">
                {userInfo.displayName}
              </h3>
              <span className="text-xs text-[#66B584] bg-[#66B5844D] rounded-[100px] px-2 py-1 ">
                Verified ID
              </span>
              </div>
              {/* {userInfo.isVerified && (
                <div className="bg-green-500 rounded-full p-0.5 flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-white" fill="currentColor" />
                </div>
              )} */}
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-gray-700">100 following</span>
              <span className="text-gray-400">•</span>
              
               <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {userInfo.location}
            </div>
            </div>
            
           
          </div>
        </div>
        </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between gap-4 xl:gap-6">
        {/* Left Section - User Info */}
        <div className="flex items-center gap-4 xl:gap-6">
          {/* User Avatar */}
          <div className="w-12 h-12 xl:w-14 xl:h-14 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            {userInfo.avatar ? (
              <img 
                src={userInfo.avatar} 
                alt={userInfo.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm xl:text-base">
                {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            )}
          </div>
          
          {/* User Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-base xl:text-lg">{userInfo.displayName}</h3>
              {userInfo.isVerified && (
                <div className="bg-green-500 rounded-full p-1 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 xl:w-4 xl:h-4 text-white" fill="currentColor" />
                </div>
              )}
              <span className="text-xs xl:text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Verified ID
              </span>
            </div>
            <div className="flex items-center text-gray-500 text-sm xl:text-base">
              <MapPin className="w-4 h-4 mr-1" />
              {userInfo.location}
            </div>
            
            {/* Additional Stats */}
            {vendorStats && (
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>{vendorStats.totalSales}+ sales</span>
                <span>•</span>
                <span>{vendorStats.responseRate}% response rate</span>
                {vendorStats.joinDate && (
                  <>
                    <span>•</span>
                    <span>Joined {new Date(vendorStats.joinDate).getFullYear()}</span>
                  </>
                )}
              </div>
            )}
            
            {/* Follow Button - Desktop */}
            <button
              onClick={toggleFollow}
              className={`mt-3 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                isFollowing
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        {/* Right Section - Rating Info */}
        <div className="flex items-center gap-6 xl:gap-8">
          {/* Overall Rating */}
          <div className="text-center flex-shrink-0">
            <div className="text-2xl xl:text-3xl font-bold text-gray-900 mb-1">
              {ratingData.overallRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-0.5 mb-1">
              {renderStars(ratingData.overallRating, 5, 'md')}
            </div>
            <p className="text-xs xl:text-sm text-gray-500">{ratingData.totalRatings} ratings</p>
          </div>

          {/* Rating Breakdown */}
          {ratingData.ratingBreakdown.length > 0 && (
            <div className="space-y-1 min-w-0 flex-shrink-0">
              <h4 className="font-semibold text-gray-900 text-sm mb-2 hidden xl:block">
                Rating Breakdown
              </h4>
              {ratingData.ratingBreakdown.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-2 text-xs xl:text-sm">
                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5 w-12 xl:w-14">
                    <span className="text-gray-600 w-4">{rating.stars}</span>
                    <Star className="w-3 h-3 text-[#3652AD] fill-[#3652AD]" />
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-20 xl:w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                  
                  {/* Count */}
                  <span className="text-gray-500 w-6 text-right">{rating.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alternative Mobile Layout for Medium Screens */}
      <div className="hidden md:flex lg:hidden items-center justify-between gap-4">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            {userInfo.avatar ? (
              <img 
                src={userInfo.avatar} 
                alt={userInfo.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-base">{userInfo.displayName}</h3>
              {userInfo.isVerified && (
                <div className="bg-green-500 rounded-full p-0.5 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-white" fill="currentColor" />
                </div>
              )}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-3 h-3 mr-1" />
              {userInfo.location}
            </div>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block mt-1">
              Verified ID
            </span>
          </div>
        </div>

        {/* Rating Info */}
        <div className="flex items-center gap-4">
          <div className="text-center flex-shrink-0">
            <div className="text-xl font-bold text-gray-900 mb-1">
              {ratingData.overallRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-0.5 mb-1">
              {renderStars(ratingData.overallRating, 5, 'sm')}
            </div>
            <p className="text-xs text-gray-500">{ratingData.totalRatings} ratings</p>
          </div>

          <button
            onClick={toggleFollow}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 ${
              isFollowing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      {/* <NavigationTabs /> */}
    </div>
  );
};

export default SellRate;