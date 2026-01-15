import React, { useState } from 'react';
import { Eye, EyeOff, Rocket, Clipboard, Truck, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { Star, Heart } from 'lucide-react';
import { useCheckAuth } from '../lib/hooks/useAuthApis/useCheckAuth';
import { useWishlist } from '../lib/hooks/useProductApis/useWishlist';
import { productApi } from '../lib/api/productsApi';

interface OrderStatus {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
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

// Define the user interface based on what useCheckAuth actually returns
interface AuthUser {
  _id?: string;
  balance?: number;
  pendingBalance?: number;
  // Add other user properties that actually exist
}

const WalletDashboardComponent: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [showPendingSales, setShowPendingSales] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderStats, setOrderStats] = useState({
    offers: 0,
    toShip: 0,
    completed: 0,
    failed: 0
  });
  const [productsLoading, setProductsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Use the auth hook - based on the error, it only returns isLoading
  const { isLoading: authLoading } = useCheckAuth();
  
  // For now, we'll use mock user data since the hook doesn't return user
  // In a real app, you'd get this from your auth context or store
  const [user, setUser] = useState<AuthUser | null>({
    _id: 'mock-user-id', // Replace with actual user ID from your auth system
    balance: 150000,
    pendingBalance: 50000
  });

  const { toggleWishlist, loading: wishlistLoading } = useWishlist();

  // Get wallet data from auth user
  const walletBalance = user?.balance || 0;
  const pendingSales = user?.pendingBalance || 0;

  // Fetch seller products and order stats
  const fetchSellerData = async () => {
    if (!user?._id) return;

    try {
      setProductsLoading(true);
      setStatsLoading(true);

      console.log('🔄 Fetching seller data...');

      // Use getAllProducts instead of getSellerProducts
      const productsResponse = await productApi.getAllProducts({ 
        vendorId: user._id, 
        limit: 3 
      });
      console.log('✅ Seller products:', productsResponse.data);

      // Transform API products to frontend format
      const transformProduct = (product: any): Product => ({
        id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        rating: product.averageRating || product.rating || 4,
        maxRating: 5,
        image: product.images?.[0] || '/placeholder-product.png',
        location: product.vendor?.location || 'Location not specified',
        isWishlisted: product.isWishlisted || false
      });

      if (productsResponse.data?.products) {
        const transformedProducts = productsResponse.data.products.map(transformProduct);
        setProducts(transformedProducts);
      } else if (Array.isArray(productsResponse.data)) {
        // Handle case where response is directly an array
        const transformedProducts = productsResponse.data.map(transformProduct);
        setProducts(transformedProducts);
      } else {
        // Fallback mock data
        setProducts(getFallbackProducts());
      }

      // For now, using mock order stats since we don't have the endpoint
      setOrderStats({
        offers: 0,
        toShip: 0,
        completed: 0,
        failed: 0
      });

    } catch (error) {
      console.log('❌ Failed to fetch seller data:', error);
      // Use fallback data on error
      setProducts(getFallbackProducts());
      setOrderStats({
        offers: 0,
        toShip: 0,
        completed: 0,
        failed: 0
      });
    } finally {
      setProductsLoading(false);
      setStatsLoading(false);
    }
  };

  // Fallback products data
  const getFallbackProducts = (): Product[] => [
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
  ];

  React.useEffect(() => {
    if (user?._id) {
      fetchSellerData();
    }
  }, [user?._id]);

  const orderStatuses: OrderStatus[] = [
    { id: 'offers', label: 'Offers', icon: Clipboard, count: orderStats.offers },
    { id: 'to-ship', label: 'To ship', icon: Truck, count: orderStats.toShip },
    { id: 'completed', label: 'Completed', icon: CheckCircle, count: orderStats.completed },
    { id: 'failed', label: 'Failed', icon: XCircle, count: orderStats.failed }
  ];

  const handleWishlistToggle = async (productId: string, currentStatus: boolean) => {
    try {
      const newStatus = await toggleWishlist(productId, currentStatus);
      
      // Update local state optimistically
      setProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, isWishlisted: newStatus }
            : product
        )
      );
    } catch (error) {
      console.error('Wishlist toggle failed:', error);
    }
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
    // You can navigate to product detail page
    // router.push(`/product/${productId}`);
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const togglePendingSalesVisibility = () => {
    setShowPendingSales(!showPendingSales);
  };

  const handleCreateListing = () => {
    console.log('Create listing clicked');
    // Navigate to create listing page
    // router.push('/create-listing');
  };

  const handleViewAll = () => {
    console.log('View all orders clicked');
    // Navigate to orders page
    // router.push('/orders');
  };

  const handleOrderStatusClick = (statusId: string) => {
    console.log('Order status clicked:', statusId);
    // Navigate to specific order status page
    // router.push(`/orders?status=${statusId}`);
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="w-[90%] sm:w-[70%] mx-auto space-y-6 p-4 ">
        {/* Wallet Balance Skeleton */}
        <div className="bg-gradient-to-br from-[#3652AD] to-[#0E2C8E] rounded-2xl p-6 text-white animate-pulse ">
          <div className="h-4 bg-blue-400 rounded w-32 mb-2"></div>
          <div className="h-8 bg-blue-400 rounded w-24"></div>
        </div>

        {/* Post Items Skeleton */}
        <div className="bg-[#FFEEE5] rounded-2xl p-12 text-center animate-pulse">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-200 rounded-full"></div>
          </div>
          <div className="h-6 bg-orange-200 rounded w-48 mx-auto mb-3"></div>
          <div className="h-4 bg-orange-200 rounded w-64 mx-auto mb-6"></div>
          <div className="h-10 bg-orange-200 rounded-full w-32 mx-auto"></div>
        </div>

        {/* Order Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
            </div>
          ))}
        </div>

        {/* Products Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] sm:w-[70%] mx-auto space-y-6 p-4">
      {/* Wallet Balance Cards */}
      <div className="">
        {/* Wallet Balance */}
        <div className="bg-gradient-to-br from-[#3652AD] to-[#0E2C8E] rounded-2xl p-6 text- mt-[70px] sm:mt-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Wallet balance</h3>
            <button
              onClick={toggleBalanceVisibility}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              {showBalance ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="text-3xl font-bold">
            {showBalance ? formatCurrency(walletBalance) : '₦****'}
          </div>
        </div>

        {/* Pending Sales - You can add this card back if needed */}
        {/* <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Pending sales</h3>
            <button
              onClick={togglePendingSalesVisibility}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              {showPendingSales ? (
                <Eye className="w-4 h-4 text-gray-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {showPendingSales ? formatCurrency(pendingSales) : '₦****'}
          </div>
        </div> */}
      </div>

      {/* Post Items Empty State */}
      <div className="bg-[#FFEEE5] rounded-2xl p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#FFEEE5] rounded-full flex items-center justify-center">
            <img src='/jet.png' alt='rocket' className='w-20 h-20'/>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-orange-900 mb-3">Post items</h2>
        <p className="text-orange-700 mb-6 max-w-md mx-auto">
          List items, share, boost to reach more buyers
        </p>
        <button
          onClick={handleCreateListing}
          className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors duration-200"
        >
          Create listing
        </button>
      </div>

      {/* Incoming Orders Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Incoming orders</h3>
          <button
            onClick={handleViewAll}
            className="flex items-center gap-1 text-[#3652AD] text-sm font-medium hover:text-blue-600 transition-colors"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Order Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {orderStatuses.map((status) => {
            const IconComponent = status.icon;
            return (
              <button
                key={status.id}
                onClick={() => handleOrderStatusClick(status.id)}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <IconComponent className="w-8 h-8 text-gray-700 group-hover:text-[#3652AD] transition-colors" />
                    {status.count > 0 && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{status.count}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {status.label}
                  </span>
                  {status.count > 0 && (
                    <span className="text-xs text-gray-500 mt-1">
                      {status.count} {status.count === 1 ? 'order' : 'orders'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

     <div className='w-[100%]'>
        <h2 className="text-2xl font-semibold mb-4 mt-10 text-black">Your Products</h2>
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      handleWishlistToggle(product.id, product.isWishlisted);
                    }}
                    disabled={wishlistLoading}
                    className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-colors duration-200 disabled:opacity-50"
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
                    {product.originalPrice && product.originalPrice > product.price && (
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
        )}
      </div>
    </div>
  );
};

export default WalletDashboardComponent;