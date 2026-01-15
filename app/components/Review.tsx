import React from 'react';
import Image from 'next/image';

interface ReviewImage {
  id: string;
  src: string;
  alt: string;
}

interface Review {
  id: string;
  customerName: string;
  date: string;
  rating: number;
  text: string;
  images: ReviewImage[];
  avatar: string;
}

interface ProductReviewsProps {
  reviews?: Review[];
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-orange-400 fill-current' : 'text-gray-300'
          }`}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {review.avatar}
          </div>
        </div>

        {/* Review Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={review.rating} />
          </div>

          {/* Customer Info */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-medium text-gray-900">{review.customerName}</span>
            <span className="text-gray-500 text-sm">{review.date}</span>
          </div>

          {/* Review Text */}
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {review.text}
          </p>

          {/* Review Images */}
          {review.images.length > 0 && (
            <div className="flex gap-2">
              {review.images.map((image) => (
                <div
                  key={image.id}
                  className="relative w-24 h-32 bg-gray-100 rounded-lg overflow-hidden"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews = defaultReviews }) => {
  return (
    <div className="w-full bg-white">
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

// Sample data
const defaultReviews: Review[] = [
  {
    id: '1',
    customerName: 'Opeyemi Anuolu',
    date: '04 April 2024',
    rating: 4,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget sollicitudin ipsum, ac euismod nisl. Aenean pharetra augue eu purus sodales, vel tincidunt massa laoreet. Nam sit amet lorem a tortor tincidunt lacinia. Nam euismod',
    avatar: 'OA',
    images: [
      {
        id: '1-1',
        src: '/gown.png',
        alt: 'Customer photo 1'
      },
      {
        id: '1-2',
        src: '/gown.png',
        alt: 'Customer photo 2'
      },
      {
        id: '1-3',
        src: '/gown.png',
        alt: 'Customer photo 3'
      }
    ]
  },
  {
    id: '2',
    customerName: 'Opeyemi Anuolu',
    date: '04 April 2024',
    rating: 4,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget sollicitudin ipsum, ac euismod nisl. Aenean pharetra augue eu purus sodales, vel tincidunt massa laoreet. Nam sit amet lorem a tortor tincidunt lacinia. Nam euismod',
    avatar: 'OA',
    images: [
      {
        id: '2-1',
        src: '/gown.png',
        alt: 'Customer photo 1'
      },
      {
        id: '2-2',
        src: '/gown.png',
        alt: 'Customer photo 2'
      },
      {
        id: '2-3',
        src: '/gown.png',
        alt: 'Customer photo 3'
      }
    ]
  },
  {
    id: '3',
    customerName: 'Opeyemi Anuolu',
    date: '04 April 2024',
    rating: 4,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget sollicitudin ipsum, ac euismod nisl. Aenean pharetra augue eu purus sodales, vel tincidunt massa laoreet. Nam sit amet lorem a tortor tincidunt lacinia. Nam euismod',
    avatar: 'OA',
    images: [
      {
        id: '3-1',
        src: '/gown.png',
        alt: 'Customer photo 1'
      },
      {
        id: '3-2',
        src: '/gown.png',
        alt: 'Customer photo 2'
      },
      {
        id: '3-3',
        src: '/gown.png',
        alt: 'Customer photo 3'
      }
    ]
  }
];

export default ProductReviews;