import React from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  price: number;
  location: string;
  rating: number;
  image: string;
  isFavorited?: boolean;
}

interface PopularItemsProps {
  products?: Product[];
  title?: string;
}

const StarRating: React.FC<{ rating: number; maxRating?: number }> = ({ 
  rating, 
  maxRating = 5 
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${
            star <= rating ? 'text-black fill-current' : 'text-gray-300'
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

const defaultProducts: Product[] = [
  {
    id: '1',
    title: 'Photopulse camera',
    price: 40000,
    location: 'Nsukka, Enugu',
    rating: 4,
    image: '/monitor.png'
  },
  {
    id: '2',
    title: 'HP laptop',
    price: 40000,
    location: 'Nsukka, Enugu',
    rating: 4,
    image: '/laptop2.png'
  },
  {
    id: '3',
    title: 'Ultra hydrating moisturizer',
    price: 40000,
    location: 'Nsukka, Enugu',
    rating: 4,
    image: '/cream.png'
  },
  {
    id: '4',
    title: 'Ordinary skincare set',
    price: 40000,
    location: 'Nsukka, Enugu',
    rating: 4,
    image: '/body.png'
  }
];


const HeartIcon: React.FC<{ isFilled?: boolean; onClick?: () => void }> = ({ 
  isFilled = false, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className="p-2 hover:bg-gray-50 rounded-full transition-colors"
      aria-label="Add to favorites"
    >
      <svg
        className={`w-5 h-5 ${
          isFilled ? 'text-red-500 fill-current' : 'text-gray-400'
        }`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

const ProductCard: React.FC<{ product: Product; onFavoriteClick?: (id: string) => void }> = ({ 
  product, 
  onFavoriteClick 
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('NGN', '₦');
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden group cursor-pointer">
      {/* Product Image */}
      <div className="relative bg-white aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Heart Icon */}
        <div className="absolute top-3 right-3">
          <HeartIcon
            isFilled={product.isFavorited}
            onClick={() => onFavoriteClick?.(product.id)}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating */}
        <div className="mb-2">
          <StarRating rating={product.rating} />
        </div>

        {/* Title */}
        <h3 className="text-sm text-left font-medium text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* Price */}
        <p className="text-lg font-semibold text-black mb-1 text-left">
          {formatPrice(product.price)}
        </p>

        {/* Location */}
        <p className="text-xs text-gray-500 text-left">
          {product.location}
        </p>
      </div>
    </div>
  );
};

const PopularItemsFromSeller: React.FC<PopularItemsProps> = ({ 
  products = defaultProducts
}) => {
  const [favoriteItems, setFavoriteItems] = React.useState<Set<string>>(new Set());

  const handleFavoriteClick = (productId: string) => {
    setFavoriteItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Section Header */}
      <div className="mb-8">
        {/* Description Text */}
        <div className="text-sm text-left text-gray-600 leading-relaxed space-y-2 mb-6">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget sollicitudin ipsum, ac euismod nisl. Aenean pharetra augue eu purus sodales, vel tincidunt massa laoreet. Nam sit amet lorem a tortor tincidunt lacinia. Nam euismod
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget sollicitudin ipsum, ac euismod nisl. Aenean pharetra augue eu purus sodales, vel tincidunt massa laoreet. Nam sit amet lorem a tortor tincidunt lacinia. Nam euismod
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              isFavorited: favoriteItems.has(product.id)
            }}
            onFavoriteClick={handleFavoriteClick}
          />
        ))}
      </div>
    </div>
  );
};


export default PopularItemsFromSeller;
