'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Search, MoreVertical, Edit, Eye, Share2, Trash2, FileText } from 'lucide-react';
import { useCheckAuth } from '@/app/lib/hooks/useAuthApis/useCheckAuth';
import { useFetchVendorProducts } from '@/app/lib/hooks/useProductApis/useFetchVendorProducts';
import BottomNavigation from '@/app/components/BottomNav';

type ListingTab = 'active' | 'pending' | 'renew' | 'closed' | 'drafts' | 'rejected' | 'unpaid' | 'sold';

interface MenuItem {
  icon: React.ReactElement;
  label: string;
  action: string;
  isDestructive?: boolean;
}

const MyListingsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ListingTab>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Use authentication hook
  const { user, isLoading: authLoading, isAuthenticated } = useCheckAuth();
  
  // Use vendor products hook
  const { 
    data: products, 
    loading: productsLoading, 
    error: productsError,
    refetch,
    activeProducts,
    pendingProducts,
    draftProducts,
    soldProducts,
    renewProducts,
    unpaidProducts
  } = useFetchVendorProducts(user?._id || null);

  const tabs: { id: ListingTab; label: string; count?: number }[] = [
    { id: 'active', label: 'Active', count: activeProducts?.length || 0 },
    { id: 'pending', label: 'Pending', count: pendingProducts?.length || 0 },
    { id: 'renew', label: 'To renew', count: renewProducts?.length || 0 },
    { id: 'closed', label: 'Closed', count: soldProducts?.length || 0 },
    { id: 'drafts', label: 'Drafts', count: draftProducts?.length || 0 },
    { id: 'unpaid', label: 'Unpaid', count: unpaidProducts?.length || 0 },
  ];

  // Filter products based on active tab
  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'active':
        return activeProducts;
      case 'pending':
        return pendingProducts;
      case 'renew':
        return renewProducts;
      case 'closed':
        return soldProducts;
      case 'drafts':
        return draftProducts;
      case 'unpaid':
        return unpaidProducts;
      default:
        return [];
    }
  };

  const filteredProducts = getFilteredProducts()?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const navigateBack = () => {
    router.push('/dashboard/user');
  };

  const toggleMenu = (productId: string) => {
    setOpenMenuId(openMenuId === productId ? null : productId);
  };

  const handleMenuAction = (action: string, productId: string) => {
    console.log(`${action} product:`, productId);
    
    switch (action) {
      case 'edit':
        // Navigate to edit page
        router.push(`/edit-product/${productId}`);
        break;
      case 'view':
        // Navigate to product detail page
        router.push(`/product/${productId}`);
        break;
      case 'markSold':
        markAsSold(productId);
        break;
      case 'share':
        shareProduct(productId);
        break;
      case 'delete':
        deleteProduct(productId);
        break;
      case 'renew':
        renewProduct(productId);
        break;
      case 'republish':
        republishProduct(productId);
        break;
      case 'pay':
        payForProduct(productId);
        break;
    }
    setOpenMenuId(null);
  };

  const markAsSold = async (productId: string) => {
    try {
      // Here you would call your API to mark product as sold
      // await productApi.markAsSold(productId);
      alert('Product marked as sold!');
      refetch(); // Refresh the products list
    } catch (error) {
      console.error('Error marking product as sold:', error);
      alert('Failed to mark product as sold');
    }
  };

  const deleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Here you would call your API to delete the product
        // await productApi.deleteProduct(productId);
        alert('Product deleted successfully!');
        refetch(); // Refresh the products list
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const shareProduct = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const shareUrl = `${window.location.origin}/product/${productId}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: product.name,
            text: `Check out ${product.name} for ${formatPrice(product.price)}`,
            url: shareUrl,
          });
          console.log('Product shared successfully');
        } catch (error) {
          console.log('Error sharing product:', error);
        }
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(shareUrl);
        alert('Product link copied to clipboard!');
      }
    }
  };

  const renewProduct = async (productId: string) => {
    try {
      // Here you would call your API to renew the product
      // await productApi.renewProduct(productId);
      alert('Product renewed successfully!');
      refetch(); // Refresh the products list
    } catch (error) {
      console.error('Error renewing product:', error);
      alert('Failed to renew product');
    }
  };

  const formatDateToDmy = (dateString: string | Date): string => {
  if (!dateString) return 'Unknown date';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-indexed
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

  const republishProduct = async (productId: string) => {
    try {
      // Here you would call your API to republish the product
      // await productApi.republishProduct(productId);
      alert('Product republished successfully!');
      refetch(); // Refresh the products list
    } catch (error) {
      console.error('Error republishing product:', error);
      alert('Failed to republish product');
    }
  };

  const payForProduct = async (productId: string) => {
    try {
      // Here you would handle payment logic
      // await productApi.initiatePayment(productId);
      router.push(`/payment/${productId}`);
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment');
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'text-gray-600';
    
    const colors: Record<string, string> = {
      active: 'text-green-600',
      pending: 'text-yellow-600',
      renew: 'text-orange-600',
      closed: 'text-[#0DBA37]',
      sold: 'text-[#0DBA37]',
      drafts: 'text-[#EF4444]',
      draft: 'text-[#EF4444]',
      rejected: 'text-red-600',
      unpaid: 'text-red-600',
    };
    
    return colors[status.toLowerCase()] || 'text-gray-600';
  };

  const getStatusText = (status?: string) => {
    if (!status) return 'Unknown';
    
    const texts: Record<string, string> = {
      active: 'Active',
      pending: 'Pending Review',
      renew: 'Pending Renewal',
      closed: 'Closed',
      sold: 'Sold',
      drafts: 'Draft',
      draft: 'Draft',
      rejected: 'Rejected',
      unpaid: 'Unpaid',
    };
    
    return texts[status.toLowerCase()] || status;
  };

  const getMenuItems = (product: any): MenuItem[] => {
    const baseItems: MenuItem[] = [
      { icon: <Edit className="w-4 h-4" />, label: 'Edit', action: 'edit' },
      { icon: <Eye className="w-4 h-4" />, label: 'View', action: 'view' },
      { icon: <Share2 className="w-4 h-4" />, label: 'Share', action: 'share' },
    ];

    const status = product.status?.toLowerCase();
    
    switch (status) {
      case 'active':
        return [
          ...baseItems,
          { 
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 12l2 2 4-4" />
            </svg>, 
            label: 'Mark as sold', 
            action: 'markSold' 
          },
          { icon: <Trash2 className="w-4 h-4" />, label: 'Delete', action: 'delete', isDestructive: true }
        ];
      
      case 'pending':
      case 'renew':
        return [
          ...baseItems,
          { 
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 4v6h6" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>, 
            label: 'Renew', 
            action: 'renew' 
          },
          { icon: <Trash2 className="w-4 h-4" />, label: 'Delete', action: 'delete', isDestructive: true }
        ];
      
      case 'unpaid':
        return [
          ...baseItems,
          { 
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <path d="M1 10h22" />
            </svg>, 
            label: 'Pay Now', 
            action: 'pay' 
          },
          { icon: <Trash2 className="w-4 h-4" />, label: 'Delete', action: 'delete', isDestructive: true }
        ];
      
      default:
        return [
          ...baseItems,
          { icon: <Trash2 className="w-4 h-4" />, label: 'Delete', action: 'delete', isDestructive: true }
        ];
    }
  };

  const getActionButtons = (product: any) => {
    const status = product.status?.toLowerCase();
    
    switch (status) {
      case 'active':
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => markAsSold(product.id)}
              className="flex-1 py-2 px-4 border border-[#3652AD] text-[#3652AD] text-[11px] font-medium rounded-full hover:bg-blue-50"
            >
              Mark as sold
            </button>
            <button 
              onClick={() => handleMenuAction('edit', product.id)}
              className="flex-1 py-2 px-4 bg-[#3652AD] text-white text-[11px] font-medium rounded-full hover:bg-[#3652AD]"
            >
              Edit
            </button>
          </div>
        );
      
      case 'pending':
      case 'renew':
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => handleMenuAction('edit', product.id)}
              className="flex-1 py-2 px-4 border border-[#3652AD] text-[#3652AD] text-xs font-medium rounded-full hover:bg-blue-50"
            >
              Edit
            </button>
            <button 
              onClick={() => handleMenuAction('renew', product.id)}
              className="flex-1 py-2 px-4 bg-[#3652AD] text-white text-xs font-medium rounded-full hover:bg-[#3652AD]"
            >
              Renew
            </button>
          </div>
        );
      
      case 'unpaid':
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => handleMenuAction('pay', product.id)}
              className="flex-1 py-2 px-4 bg-green-600 text-white text-xs font-medium rounded-full hover:bg-green-700"
            >
              Pay Now
            </button>
            <button 
              onClick={() => handleMenuAction('edit', product.id)}
              className="flex-1 py-2 px-4 border border-[#3652AD] text-[#3652AD] text-xs font-medium rounded-full hover:bg-blue-50"
            >
              Edit
            </button>
          </div>
        );
      
      case 'draft':
      case 'drafts':
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => handleMenuAction('edit', product.id)}
              className="flex-1 py-2 px-4 border border-[#3652AD] text-[#3652AD] text-xs font-medium rounded-full hover:bg-blue-700"
            >
              Edit
            </button>
            <button 
              onClick={() => handleMenuAction('republish', product.id)}
              className="flex-1 py-2 px-4 bg-[#3652AD] text-white text-xs font-medium rounded-full hover:bg-green-50"
            >
              Publish
            </button>
          </div>
        );
      
      case 'sold':
      case 'closed':
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => handleMenuAction('republish', product.id)}
              className="flex-1 py-2 px-4 bg-white border border-[#3652AD] text-[#3652AD] text-xs font-medium rounded-full hover:bg-blue-700"
            >
              Re-list
            </button>
            <button 
              onClick={() => deleteProduct(product.id)}
              className="flex-1 py-2 px-4 border bg-[#3652AD] text-white text-xs font-medium rounded-full hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        );
      
      default:
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => handleMenuAction('edit', product.id)}
              className="flex-1 py-2 px-4 border border-[#3652AD] text-[#3652AD] text-xs font-medium rounded-full hover:bg-blue-50"
            >
              Edit
            </button>
          </div>
        );
    }
  };

  // Loading state
  if (authLoading || productsLoading) {
    return (
      <div className="w-full h-screen flex flex-col bg-white">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={navigateBack} className="p-1">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">My listing</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (productsError) {
    return (
      <div className="w-full h-screen flex flex-col bg-white">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={navigateBack} className="p-1">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">My listing</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-6 0 9 9 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h2>
            <p className="text-gray-600 mb-4">{productsError}</p>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No products state
  if (!products || products.length === 0) {
    return (
      <div className="w-full h-screen flex flex-col bg-white">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={navigateBack} className="p-1">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">My listing</h1>
          </div>
          <button className="p-1">
            <Settings className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-4">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Listings Yet</h2>
            <p className="text-gray-600 mb-6">You haven't created any product listings yet.</p>
            <button
              onClick={() => router.push('/post-item')}
              className="bg-[#3652AD] text-white px-6 py-3 rounded-full font-medium hover:bg-[#3652AD] transition-colors"
            >
              Create Your First Listing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button onClick={navigateBack} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">My listing</h1>
        </div>
        <button className="p-1">
          <Settings className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search your listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full placeholder-gray-500 pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs with counts */}
      {/* Tabs with counts */}
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap relative flex-shrink-0 flex items-center gap-1 ${
              activeTab === tab.id
                ? 'text-[#3652AD]'
                : 'text-gray-600'
            }`}
          >
            {tab.label}
            {/* Fix the count check */}
            {tab.count && tab.count > 0 && (
              <span className={`inline-flex items-center justify-center w-5 h-5 text-xs rounded-full ${
                activeTab === tab.id 
                  ? 'bg-[#3652AD] text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3652AD]" />
            )}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Search className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-sm">No listings found matching "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-2 text-[#3652AD] text-sm font-medium hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="px-4 py-4 border-b border-gray-100">
              <div className="flex gap-3">
                {/* Product Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={product.images?.[0] || product.image || '/placeholder-image.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex justify-between items-start mb-1 w-full">
                    <div className="w-full">
                      <div className='border-b border-gray-400 pb-1'>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-base font-bold text-gray-900 mb-2">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <div className='flex w-full justify-between mt-3'>
                        <p className="text-xs text-gray-500 mb-1">
                          Listed on: {product.listedOn || 'Unknown date'}
                        </p>
                        <span className={`text-xs font-medium ${getStatusColor(product.status)}`}>
                          {getStatusText(product.status)}
                        </span>
                      </div>
                      {/* Additional product info can be added here */}
                      {product.views !== undefined && (
                        <p className="text-xs text-gray-500 mt-1">
                          {product.views} views • {product.purchases || 0} purchases
                        </p>
                      )}
                    </div>

                    {/* Status and Menu */}
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button 
                          onClick={() => toggleMenu(product.id)}
                          className="p-1"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === product.id && (
                          <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                            {getMenuItems(product).map((item, index) => (
                              <button
                                key={index}
                                onClick={() => handleMenuAction(item.action, product.id)}
                                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 ${
                                  item.isDestructive 
                                    ? 'text-red-600 hover:bg-red-50' 
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {item.icon}
                                {item.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {getActionButtons(product)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      {/* <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-gray-600">Total Listings:</p>
            <p className="font-semibold text-gray-900">{products.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Active:</p>
            <p className="font-semibold text-green-600">{activeProducts?.length || 0}</p>
          </div>
          <div>
            <p className="text-gray-600">Pending:</p>
            <p className="font-semibold text-yellow-600">{pendingProducts?.length || 0}</p>
          </div>
          <div>
            <p className="text-gray-600">Sold:</p>
            <p className="font-semibold text-[#0DBA37]">{soldProducts?.length || 0}</p>
          </div>
        </div>
      </div> */}
      <BottomNavigation/>
    </div>
  );
};

export default MyListingsPage;