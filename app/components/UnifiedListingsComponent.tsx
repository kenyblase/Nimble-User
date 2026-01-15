'use client'
import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Header from '@/app/components/TopBar';
import VerticalNavMenu from '@/app/components/SidebarNavigation';
import Footer from '@/app/components/Footer';
import MobileTopBar from '@/app/components/MobileTopBar';
import BottomNavigation from '@/app/components/BottomNav';
import { useFetchVendorProducts } from '../lib/hooks/useProductApis/useFetchVendorProducts';
import { Product } from '../lib/api/productsApi';

type ListingTab = 'active' | 'pending' | 'renew' | 'sold' | 'drafts' | 'unpaid';

const UnifiedListingsComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ListingTab>('active');
  const [vendorId, setVendorId] = useState<string | null>(null);

  // Get vendor ID from localStorage or auth context
  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Replace with your actual auth logic
    // const userId = '67b5e07ba81374c888d0ef61'; // For testing
    if (userId) {
      setVendorId(userId);
    } else {
      console.error('No vendor ID found. User might not be logged in.');
    }
  }, []);

  const { 
    data, 
    loading, 
    error, 
    refetch,
    activeProducts,
    pendingProducts,
    draftProducts,
    soldProducts,
    renewProducts,
    unpaidProducts
  } = useFetchVendorProducts(vendorId);

  const tabs: { id: ListingTab; label: string; count: number }[] = [
    { id: 'active', label: 'Active', count: activeProducts.length },
    { id: 'pending', label: 'Pending', count: pendingProducts.length },
    { id: 'renew', label: 'To renew', count: renewProducts.length },
    { id: 'sold', label: 'Sold', count: soldProducts.length },
    { id: 'drafts', label: 'Drafts', count: draftProducts.length },
    { id: 'unpaid', label: 'To Pay', count: unpaidProducts.length },
  ];

  const formatPrice = (price: number) => {
    return `₦${price?.toLocaleString() || '0'}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'sold':
        return 'text-[#0DBA37]';
      case 'pending':
        return 'text-[#FE7A36]';
      case 'renew':
      case 'to renew':
        return 'text-[#EF4444]';
      case 'draft':
      case 'drafts':
        return 'text-[#6B7280]';
      case 'unpaid':
        return 'text-[#EB6F4A]';
      default:
        return 'text-gray-600';
    }
  };

  const getDisplayStatus = (status: string, tab: ListingTab) => {
    if (status) return status;
    
    // Fallback status based on tab
    switch (tab) {
      case 'active': return 'Active';
      case 'pending': return 'Pending';
      case 'renew': return 'To renew';
      case 'sold': return 'Sold';
      case 'drafts': return 'Draft';
      case 'unpaid': return 'Unpaid';
      default: return 'Active';
    }
  };

  const getButtonConfig = (tab: ListingTab) => {
    switch (tab) {
      case 'active':
        return { text: 'Reorder item', action: 'reorder' };
      case 'pending':
        return { text: 'Edit', action: 'edit' };
      case 'renew':
        return { text: 'Renew item', action: 'renew' };
      case 'sold':
        return { text: 'Re-list item', action: 'relist' };
      case 'drafts':
        return { 
          primaryText: 'Edit', 
          primaryAction: 'edit',
          secondaryText: 'Publish Item',
          secondaryAction: 'publish'
        };
      case 'unpaid':
        return { text: 'Pay now', action: 'pay' };
      default:
        return { text: 'View', action: 'view' };
    }
  };

  const handleAction = (action: string, productId: string) => {
    console.log(`${action} product:`, productId);
    // Implement your action handlers here
    switch (action) {
      case 'reorder':
        // Handle reorder logic
        break;
      case 'edit':
        // Handle edit logic - navigate to edit page
        // router.push(`/edit-product/${productId}`);
        break;
      case 'renew':
        // Handle renew logic
        break;
      case 'relist':
        // Handle relist logic
        break;
      case 'publish':
        // Handle publish logic
        break;
      case 'pay':
        // Handle payment logic
        break;
      default:
        break;
    }
  };

  const getProductsForTab = (tab: ListingTab): Product[] => {
    switch (tab) {
      case 'active': return activeProducts;
      case 'pending': return pendingProducts;
      case 'renew': return renewProducts;
      case 'sold': return soldProducts;
      case 'drafts': return draftProducts;
      case 'unpaid': return unpaidProducts;
      default: return [];
    }
  };

  const renderListingsGrid = (products: Product[]) => {
    const buttonConfig = getButtonConfig(activeTab);

    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'active' && "You don't have any active listings."}
            {activeTab === 'pending' && "You don't have any pending listings."}
            {activeTab === 'renew' && "You don't have any listings to renew."}
            {activeTab === 'sold' && "You haven't sold any products yet."}
            {activeTab === 'drafts' && "You don't have any draft listings."}
            {activeTab === 'unpaid' && "You don't have any unpaid listings."}
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            List Your First Product
          </button>
        </div>
      );
    }

    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              {/* Product Image */}
              <div className="aspect-video bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE3NVYxNzVIMjI1VjEyNUgxNzVaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg==';
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="p-5">
                {/* Product Name */}
                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="text-sm font-bold text-gray-900 mb-3">
                  {formatPrice(product.price)}
                </div>

                {/* Status and Listed Date */}
            <div className="mb-2 mt-2">
              <span className="flex justify-between text-[10px] border-t border-gray-300 py-1 text-black">
                Listed on {(product as any).listedOn || (product as any).createdAt || 'Unknown date'}
                <div className={`text-[10px] ${getStatusColor((product as any).status || activeTab)}`}>
                  {getDisplayStatus((product as any).status || '', activeTab)}
                </div>
              </span>
            </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {activeTab === 'drafts' ? (
                    <>
                      {/* Edit Button */}
                      <button
                        onClick={() => handleAction(buttonConfig.primaryAction!, product.id)}
                        className="flex-1 py-2.5 px-4 border-2 border-[#3652AD] text-[#3652AD] font-semibold rounded-full transition-colors duration-200 text-[10px]"
                      >
                        {buttonConfig.primaryText}
                      </button>

                      {/* Publish Button */}
                      <button
                        onClick={() => handleAction(buttonConfig.secondaryAction!, product.id)}
                        className="flex-1 py-2.5 px-4 bg-[#3652AD] text-white font-semibold rounded-full text-[10px]"
                      >
                        {buttonConfig.secondaryText}
                      </button>
                    </>
                  ) : (
                    /* Single Button for other tabs */
                    <button
                      onClick={() => handleAction(buttonConfig.action!, product.id)}
                      className="flex-1 py-2.5 px-4 bg-[#3652AD] text-white font-semibold rounded-full text-[10px]"
                    >
                      {buttonConfig.text}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    const currentProducts = getProductsForTab(activeTab);

    if (loading) {
      return (
        <div className="w-full max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="aspect-video bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-4">Error loading products</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    // Special case for unpaid tab with alert banner
    if (activeTab === 'unpaid') {
      return (
        <>
          {/* Alert Banner for Unpaid Tab */}
          <div className="bg-[#FE7A3633] border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#EC6A0D] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[#EC6A0D] text-sm mb-1">Complete order</h3>
              <p className="text-sm text-[#EC6A0D]">
                Please see offers accepted by seller
              </p>
            </div>
          </div>

          {renderListingsGrid(currentProducts)}
        </>
      );
    }

    return renderListingsGrid(currentProducts);
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="hidden md:block">
        <Header/>
      </div>

      <div className="block md:hidden fixed top-0 left-0 right-0 z-50">
        <MobileTopBar/>
      </div>

      <div className="w-full flex flex-col lg:flex-row flex-1 mx-auto p-3 sm:p-4 md:p-6 bg-gray-50 mt-[80px] sm:mt-0">
        {/* Sidebar - hidden on mobile, shown on lg screens */}
        <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
          <VerticalNavMenu/>
        </div>

        {/* Main content */}
        <div className="flex flex-col w-full lg:ml-6 xl:ml-8 lg:mt-[30px] max-w-7xl">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-2 sm:px-0">
            My Listings
          </h1>

          {/* Tabs - Scrollable on mobile */}
          <div className="bg-white border-b border-gray-200 mb-4 sm:mb-6 -mx-3 sm:mx-0 overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors duration-200 relative whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 py-0.5 px-2 text-xs rounded-full ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-2 sm:px-0">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation/>
      </div>
      
      <Footer/>
    </div>
  );
};

export default UnifiedListingsComponent;