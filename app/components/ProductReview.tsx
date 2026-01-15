'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, ChevronRight } from 'lucide-react';
import { productApi } from '../lib/api/productsApi';

interface ReviewUser {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Review {
  _id: string;
  user: ReviewUser;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Vendor {
  _id: string;
  businessName?: string;
  location?: string;
}

interface ReviewsSectionComponentProps {
  productId?: string;
  vendor?: Vendor;
  loading?: boolean;
}

// Simple hook-like function inside the component file
const useReviewsData = (productId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching reviews for product:', productId);
        const response = await productApi.getProductReviews(productId);
        console.log('✅ Reviews response:', response.data);
        
        setReviews(response.data.reviews || []);
      } catch (err: any) {
        console.error('❌ Error fetching reviews:', err);
        setError(err.response?.data?.message || 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  return { reviews, loading, error };
};

const ReviewsSectionComponent: React.FC<ReviewsSectionComponentProps> = ({ 
  productId, 
  vendor,
  loading = false 
}) => {
  const router = useRouter();
  
  // Use the local hook function
  const { 
    reviews, 
    loading: reviewsLoading, 
    error 
  } = useReviewsData(productId || '');

  // Safe vendor data with fallbacks
  const getVendorInitials = (vendorName?: string): string => {
    if (!vendorName || typeof vendorName !== 'string') return 'VD';
    const initials = vendorName
      .split(' ')
      .map((n: string) => n.charAt(0))
      .join('')
      .toUpperCase();
    return initials.slice(0, 2) || 'VD'; // Ensure we always have at least 2 characters
  };

  const getVendorName = (vendor?: Vendor): string => {
    return vendor?.businessName || 'Vendor';
  };

  const currentVendor: Vendor = vendor || {
    _id: 'unknown',
    businessName: 'Vendor',
    location: 'Location not specified'
  };

  // Format date to display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  // Safe user profile data
  const userProfile = {
    name: getVendorName(currentVendor),
    initials: getVendorInitials(currentVendor.businessName),
    totalReviews: reviews.length,
    averageRating: calculateAverageRating()
  };

  const renderStars = (rating: number, maxRating: number = 5) => {
    const safeRating = Math.max(0, Math.min(rating, maxRating));
    return Array.from({ length: maxRating }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < safeRating
            ? 'fill-orange-400 text-orange-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleViewAll = () => {
    console.log('View all reviews');
  };

  const handleVisitProfile = () => {
    if (currentVendor._id && currentVendor._id !== 'unknown') {
      router.push(`/seller-profile/${currentVendor._id}`);
    } else {
      console.log('No vendor ID available');
    }
  };

  // Safe user initials for reviews
  const getUserInitials = (user: ReviewUser): string => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U';
  };

  // Safe user display name
  const getUserDisplayName = (user: ReviewUser): string => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Anonymous User';
  };

  // Loading skeleton
  if (loading || reviewsLoading) {
    return (
      <div className="w-[90%] mx-auto bg-white rounded-lg p-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-9 bg-gray-200 rounded-full w-32 animate-pulse"></div>
        </div>

        {/* Reviews Summary Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>

        {/* Reviews Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="h-3 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
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
      <div className="w-[90%] mx-auto bg-white rounded-lg p-6">
        <div className="text-center py-8">
          <div className="text-red-600 text-lg mb-2">Error loading reviews</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] mx-auto bg-white rounded-lg p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        {/* User Info */}
        {/* <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {userProfile.initials}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-900 block">{userProfile.name}</span>
            {currentVendor.location && (
              <span className="text-sm text-gray-500">{currentVendor.location}</span>
            )}
          </div>
        </div> */}

        {/* Visit Profile Button */}
        {/* <button
          onClick={handleVisitProfile}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          disabled={!currentVendor._id || currentVendor._id === 'unknown'}
        >
          Visit seller profile
        </button> */}
      </div>

      {/* Reviews Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">
            Reviews ({userProfile.totalReviews})
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {renderStars(Math.floor(userProfile.averageRating))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {userProfile.averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* View All Button */}
        {reviews.length > 3 && (
          <button
            onClick={handleViewAll}
            className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Reviews Grid */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.slice(0, 3).map((review: Review) => (
            <div
              key={review._id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              {/* Review Header */}
              <div className="flex items-center gap-1 mb-3">
                {renderStars(review.rating)}
              </div>

              {/* Date */}
              <div className="text-xs text-gray-500 mb-3">
                {formatDate(review.createdAt)}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {getUserInitials(review.user)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {getUserDisplayName(review.user)}
                </span>
              </div>

              {/* Review Comment */}
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">No reviews yet</div>
          <p className="text-gray-400 text-sm">Be the first to review this product</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsSectionComponent;