'use client'
import React, { useState, useEffect } from 'react';
import { Heart, Share2, MapPin, Minus, Plus, AlertCircle } from 'lucide-react';
import { useWishlist } from '../lib/hooks/useProductApis/useWishlist';

interface ProductSpec {
  label: string;
  value: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description?: string;
  images: string[];
  vendor?: {
    _id: string;
    businessName: string;
    location?: string;
  };
  category?: {
    _id: string;
    name: string;
  };
  rating?: number;
  isWishlisted?: boolean;
  specifications?: ProductSpec[];
  bulkPrices?: Array<{
    quantity: number;
    price: number;
  }>;
  sizes?: string[];
  colors?: Array<{
    name: string;
    hex: string;
  }>;
  condition?: string;
  type?: string;
  gender?: string;
}

interface ProductDetailPageProps {
  product?: Product | null;
  loading?: boolean;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
  product: propProduct, 
  loading = false 
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const { toggleWishlist, loading: wishlistLoading } = useWishlist();

  // Mock data as fallback - remove when API is fully integrated
  const mockProduct: Product = {
    _id: '1',
    name: 'Children toy',
    price: 40000,
    originalPrice: 45000,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget sollicitudin ipsum, ac euismod nisl. Aenean pharetra augue eu purus sodales, vel tincidunt massa iaculis.',
    images: [
      '/car.png',
      '/car.png',
      '/car.png',
      '/car.png'
    ],
    vendor: {
      _id: '1',
      businessName: 'Toy Store',
      location: 'Nsukka, Enugu'
    },
    rating: 4,
    isWishlisted: false,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'red', hex: '#EF4444' },
      { name: 'black', hex: '#000000' },
      { name: 'blue', hex: '#3B82F6' }
    ],
    bulkPrices: [
      { quantity: 2, price: 39000 },
      { quantity: 6, price: 35000 }
    ],
    condition: 'New',
    type: 'Toy',
    gender: 'Unisex'
  };

  // Use prop product or mock data
  const product = propProduct || mockProduct;

  // Generate specifications from product data
  const specifications: ProductSpec[] = [
    { label: 'Type', value: product.type || 'N/A' },
    { label: 'Gender', value: product.gender || 'Unisex' },
    { label: 'Color', value: product.colors?.map(c => c.name).join(', ') || 'Various' },
    { label: 'Size', value: product.sizes?.join(', ') || 'One Size' },
    { label: 'Condition', value: product.condition || 'New' }
  ];

  const delivery = {
    lagos: { label: 'Lagos', duration: 'Same day' },
    nationwide: { label: 'Nationwide', duration: '2-5 days' },
    options: 'Waybill'
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
    ));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const handleWishlistToggle = async () => {
    try {
      const newStatus = await toggleWishlist(product._id, product.isWishlisted || false);
      // Note: You'll need to update the parent component's state or refetch the product
      console.log('Wishlist status updated:', newStatus);
    } catch (error) {
      console.error('Wishlist toggle failed:', error);
    }
  };

  const handleMessageSeller = () => {
    console.log('Message seller:', product.vendor?._id);
  };

  const handleBuyNow = () => {
    console.log('Buy now:', {
      productId: product._id,
      quantity,
      size: selectedSize,
      color: selectedColor
    });
  };

  // Set default selections when product loads
  useEffect(() => {
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0].name);
    }
  }, [product]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-[90%] max-w-7xl mx-auto px-4 py-8 bg-white mt-[10px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Skeleton */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
            <div className="flex-1 bg-gray-200 rounded-lg h-96 animate-pulse"></div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] max-w-7xl mx-auto px-4 py-8 bg-white mt-[10px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Images */}
        <div className="flex gap-4">
          {/* Thumbnail Column */}
          <div className="flex flex-col gap-3">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? 'border-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={img}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMzNzM3MzciLz48L3N2Zz4=';
                  }}
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full max-h-96 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiMzNzM3MzciLz48L3N2Zz4=';
              }}
            />
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{product.vendor?.location || 'Location not specified'}</span>
              </div>
              {/* You can add promoted status from API if available */}
              {/* <span className="text-xs text-gray-500">Promoted</span> */}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex">{renderStars(product.rating)}</div>
              {product.rating && (
                <span className="text-sm text-gray-600">({product.rating})</span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {/* Price Section */}
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-lg text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>

            {/* Bulk Pricing */}
            {product.bulkPrices && product.bulkPrices.length > 0 && (
              <div className="mt-3 space-y-2 text-sm">
                <div className="font-medium text-gray-700">Bulk Pricing:</div>
                {product.bulkPrices.map((bulkPrice, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-gray-600">From {bulkPrice.quantity} pieces:</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(bulkPrice.price)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quantity and Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
              <div className="flex items-center border text-gray-600 border-gray-300 rounded-lg w-32">
                <button
                  onClick={decrementQuantity}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 text-center font-medium">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size:</label>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 rounded-full border-2 font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Colors:</label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? 'border-blue-600 ring-2 ring-blue-200'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleMessageSeller}
              className="flex-1 py-3 px-6 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors"
            >
              Message seller
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Buy now
            </button>
          </div>

          {/* Favorite and Share */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              <Heart
                className={`w-5 h-5 ${product.isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
              />
              <span className="text-sm font-medium">Save</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800 text-sm mb-1">Warning</h4>
              <p className="text-sm text-red-700">
                Do not agree with any seller to pay outside the platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Specifications */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {specifications.map((spec, index) => (
              <div key={index}>
                <div className="text-sm text-gray-600 mb-1">{spec.label}</div>
                <div className="font-medium text-gray-900">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">{delivery.lagos.label}</span>
              <span className="text-gray-600">{delivery.lagos.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">{delivery.nationwide.label}</span>
              <span className="text-gray-600">{delivery.nationwide.duration}</span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Delivery options</div>
              <div className="font-medium text-gray-900">{delivery.options}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;