'use client'
import React, { useState } from 'react';
import { Heart, Share2, MapPin, Minus, Plus, AlertCircle } from 'lucide-react';
import Header from '@/app/components/TopBar';
import Footer from '@/app/components/Footer';
import ReviewsSectionComponent from '@/app/components/ProductReview';

interface ProductSpec {
  label: string;
  value: string;
}

const ProductView: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [selectedSize, setSelectedSize] = useState('X');
  const [selectedColor, setSelectedColor] = useState('red');
  const [isFavorited, setIsFavorited] = useState(false);

  const product = {
    name: 'Children toy',
    price: 40000,
    bulkPrice: 39000,
    bulkFrom: 2,
    discountPrice: 35000,
    discountFrom: 6,
    location: 'Nsukka, Enugu',
    rating: 4,
    promoted: true,
    favorites: 26,
    images: [
      '/car.png',
      '/car.png',
      '/car.png',
      '/car.png'
    ],
    sizes: ['S', 'M', 'L', 'X'],
    colors: [
      { name: 'red', hex: '#EF4444' },
      { name: 'black', hex: '#000000' },
      { name: 'blue', hex: '#3B82F6' }
    ]
  };

  const specifications: ProductSpec[] = [
    { label: 'Type', value: 'Top' },
    { label: 'Gender', value: 'Women\'s' },
    { label: 'Color', value: 'Read, black, green' },
    { label: 'Size', value: 'M X XL' },
    { label: 'Condition', value: 'New' }
  ];

  const delivery = {
    lagos: { label: 'Lagos', duration: 'Same day' },
    nationwide: { label: 'Nationwide', duration: '2-5 days' },
    options: 'Waybill'
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(0, prev - 1));

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
    ));
  };

  const handleShare = () => {
    console.log('Share product');
  };

  const handleMessageSeller = () => {
    console.log('Message seller');
  };

  const handleBuyNow = () => {
    console.log('Buy now');
  };

  return (
    <div className='w-full'>
        <Header/>
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
          <div className=" rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-[100%] object-contain"
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
                <span>{product.location}</span>
              </div>
              {product.promoted && (
                <span className="text-xs text-gray-500">Promoted</span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex">{renderStars(product.rating)}</div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</div>

            <div className="mt-3 space-y-1 text-sm">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Bulk price</span>
                <span className="font-semibold text-gray-600">{formatPrice(product.bulkPrice)}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">₦39,000</span>
                <span className="text-gray-500">From {product.bulkFrom} pieces</span>
                <span className="text-gray-600">₦35,000</span>
                <span className="text-gray-500">From {product.discountFrom} pieces</span>
              </div>
            </div>
          </div>

          {/* Quantity and Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
              <div className="flex items-center border text-gray-600 border-gray-300 rounded-lg w-32">
                <button
                  onClick={decrementQuantity}
                  className="p-2 hover:bg-gray-100 transition-colors"
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
          </div>

          {/* Colors */}
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
                />
              ))}
            </div>
          </div>

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
              onClick={() => setIsFavorited(!isFavorited)}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
              />
              <span className="text-sm font-medium">{product.favorites}</span>
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
          {/* <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800 text-sm mb-1">Warning</h4>
              <p className="text-sm text-red-700">
                Do not agree with any seller to pay outside the platform
              </p>
            </div>
          </div> */}
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
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
        <p className="text-gray-700 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget sollicitudin ipsum, ac euismod nisl. Aenean pharetra augue eu purus sodales, vel tincidunt massa iaculis. Nam sit amet lorem a tortor tincidunt lacinia. Nam euismod
        </p>
      </div>
      <ReviewsSectionComponent/>
    </div>
    
    <Footer/>
    </div>
  );
};

export default ProductView;