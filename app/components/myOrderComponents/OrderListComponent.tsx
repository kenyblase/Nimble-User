'use client';

import BottomNavigation from '@/app/components/BottomNav';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/TopBar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/lib/stores/useAuthStore';
import { useCheckAuth } from '@/app/lib/hooks/useAuthApis/useCheckAuth';
import { useChats, Chat } from '@/app/lib/hooks/useChatApis/useChats';

type OrderTab = 'incoming' | 'my-orders';
type OrderStatus = 'all' | 'offers' | 'to_ship' | 'shipped' | 'completed' | 'failed' | 'pending' | 'paid' | 'appeal';

interface Order {
  id: string;
  chatId: string;
  customerName: string;
  customerAvatar?: string;
  productName: string;
  productImage?: string;
  amount: number;
  time: string;
  status: OrderStatus;
  originalChat?: Chat;
}

interface OrdersListProps {
  initialOrders?: Order[];
}

export default function OrdersList({
  initialOrders = [],
}: OrdersListProps) {
  const [activeTab, setActiveTab] = useState<OrderTab>('incoming');
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('all');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const router = useRouter();

  // Use auth store
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuthStore();
  useCheckAuth();

  // Use chats hook
  const { 
    chats, 
    loading: chatsLoading, 
    error: chatsError, 
    refetch: refetchChats 
  } = useChats();

  // Separate status filters for each tab
  const incomingStatusFilters: { id: OrderStatus; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'offers', label: 'Offers' },
    { id: 'to_ship', label: 'To ship' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' }
  ];

  const myOrdersStatusFilters: { id: OrderStatus; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'To pay' },
    { id: 'paid', label: 'Paid' },
    { id: 'appeal', label: 'Appeal' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' }
  ];

  // Get current active filters based on tab
  const getActiveStatusFilters = () => {
    return activeTab === 'incoming' ? incomingStatusFilters : myOrdersStatusFilters;
  };

  // Get current user ID from auth store
  const getCurrentUserId = (): string => {
    return currentUser?._id || '';
  };

  // Transform chats to orders format
  const transformChatsToOrders = (chats: Chat[], tab: OrderTab): Order[] => {
    const currentUserId = getCurrentUserId();
    console.log('Current user ID:', currentUserId);

    if (!currentUserId) {
      console.warn('No current user ID found');
      return [];
    }

    // Filter chats based on active tab
    const filteredChats = chats.filter(chat => {
      // Skip chats where buyer or seller is null
      if (!chat.buyer || !chat.seller) {
        console.warn('Skipping chat with missing buyer/seller:', chat._id);
        return false;
      }

      if (tab === 'incoming') {
        // Show chats where current user is the seller (incoming orders)
        return chat.seller._id === currentUserId;
      } else {
        // Show chats where current user is the buyer (my orders)
        return chat.buyer._id === currentUserId;
      }
    });

    console.log(`Filtered chats for ${tab}:`, filteredChats.length);

    // Sort chats by lastMessageSentAt or updatedAt in descending order (recent first)
    const sortedChats = filteredChats.sort((a, b) => {
      const timeA = new Date(a.lastMessageSentAt || a.updatedAt).getTime();
      const timeB = new Date(b.lastMessageSentAt || b.updatedAt).getTime();
      return timeB - timeA; // Descending order (recent first)
    });

    console.log('Sorted chats (recent first):', sortedChats.map(chat => ({
      id: chat._id,
      time: chat.lastMessageSentAt || chat.updatedAt,
      lastMessage: chat.lastMessage
    })));

    // Transform chats to orders, filtering out nulls
    const orders: Order[] = [];
    
    for (const chat of sortedChats) {
      // Add null checks here as well for safety
      const isBuyer = chat.buyer?._id === currentUserId;
      const otherUser = isBuyer ? chat.seller : chat.buyer;
      
      // Ensure otherUser exists before accessing properties
      if (!otherUser) {
        console.warn('Skipping chat with missing other user:', chat._id);
        continue; // Skip this chat
      }

      // Determine status based on chat properties and last message
      const status = determineOrderStatus(chat, tab);
      
      orders.push({
        id: chat._id,
        chatId: chat._id,
        customerName: `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() || 'Unknown User',
        customerAvatar: otherUser.profilePic,
        productName: chat.product?.name || 'Product',
        productImage: chat.product?.images?.[0],
        amount: chat.product?.price || 0,
        time: formatTime(chat.lastMessageSentAt || chat.updatedAt),
        status: status,
        originalChat: chat
      });
    }

    return orders;
  };

  // Determine order status based on chat and tab
  const determineOrderStatus = (chat: Chat, tab: OrderTab): OrderStatus => {
    // Use last message content to determine status
    const lastMessage = chat.lastMessage?.toLowerCase() || '';
    
    // Check for reported/appeal status
    if (chat.isReported || lastMessage.includes('appeal') || lastMessage.includes('report') || lastMessage.includes('dispute')) {
      return 'appeal';
    }
    
    // Different logic for incoming vs my orders
    if (tab === 'incoming') {
      // Incoming orders (seller perspective)
      if (lastMessage.includes('offer') || lastMessage.includes('price') || lastMessage.includes('negotiate')) {
        return 'offers';
      } else if (lastMessage.includes('paid') || lastMessage.includes('payment confirmed')) {
        return 'to_ship';
      } else if (lastMessage.includes('shipped') || lastMessage.includes('dispatched') || lastMessage.includes('shipping')) {
        return 'shipped';
      } else if (lastMessage.includes('complete') || lastMessage.includes('delivered') || lastMessage.includes('received')) {
        return 'completed';
      } else if (lastMessage.includes('fail') || lastMessage.includes('cancel') || lastMessage.includes('refund')) {
        return 'failed';
      }
      return 'offers'; // Default for incoming
    } else {
      // My orders (buyer perspective)
      if (lastMessage.includes('offer') || lastMessage.includes('price') || lastMessage.includes('negotiate')) {
        return 'pending'; // Offers become "To pay" for buyer
      } else if (lastMessage.includes('paid') || lastMessage.includes('payment confirmed')) {
        return 'paid';
      } else if (lastMessage.includes('complete') || lastMessage.includes('delivered') || lastMessage.includes('received')) {
        return 'completed';
      } else if (lastMessage.includes('shipped') || lastMessage.includes('dispatched') || lastMessage.includes('shipping')) {
        return 'paid'; // Shipped orders show as "Paid" for buyer
      } else if (lastMessage.includes('fail') || lastMessage.includes('cancel') || lastMessage.includes('refund')) {
        return 'failed';
      }
      return 'pending'; // Default for my orders
    }
  };

  // Enhanced time formatting
  const formatTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);
      const diffInDays = diffInHours / 24;
      
      if (diffInHours < 1) {
        const diffInMinutes = diffInMs / (1000 * 60);
        if (diffInMinutes < 1) return 'Just now';
        return `${Math.floor(diffInMinutes)}m ago`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else if (diffInDays < 7) {
        return `${Math.floor(diffInDays)}d ago`;
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch (e) {
      return 'Recently';
    }
  };

  // Filter orders based on active status
  const filteredOrders = orders.filter(order => 
    activeStatus === 'all' || order.status === activeStatus
  );

  // Refresh data when tab or chats change
  useEffect(() => {
    if (chats.length > 0) {
      const transformedOrders = transformChatsToOrders(chats, activeTab);
      setOrders(transformedOrders);
    }
  }, [activeTab, chats]);

  // Reset status filter when tab changes
  useEffect(() => {
    setActiveStatus('all');
  }, [activeTab]);

  const handleOrderClick = (orderId: string, chatId?: string) => {
    const targetChatId = chatId || orderId;
    console.log('Navigating to chat:', targetChatId);
    router.push(`/dashboard/message/${targetChatId}`);
  };

  const handleRetry = () => {
    refetchChats();
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case 'offers':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'to_ship':
      case 'paid':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'failed':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'appeal':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Get status display text based on tab and status
  const getStatusDisplayText = (status: OrderStatus, tab: OrderTab) => {
    if (tab === 'incoming') {
      switch (status) {
        case 'offers':
          return 'Offer received';
        case 'to_ship':
          return 'To ship';
        case 'shipped':
          return 'Shipped';
        case 'completed':
          return 'Completed';
        case 'failed':
          return 'Failed';
        default:
          return 'Pending';
      }
    } else {
      switch (status) {
        case 'pending':
          return 'To pay';
        case 'paid':
          return 'Paid';
        case 'appeal':
          return 'Under review';
        case 'completed':
          return 'Completed';
        case 'failed':
          return 'Failed';
        default:
          return 'Pending';
      }
    }
  };

  // Get order description text based on status and tab
  const getOrderDescriptionText = (order: Order, tab: OrderTab) => {
    const { status, amount } = order;
    
    if (tab === 'incoming') {
      switch (status) {
        case 'offers':
          return `Offer received: ₦${amount.toLocaleString()}`;
        case 'to_ship':
          return 'Payment received - prepare order for shipping';
        case 'shipped':
          return 'Order shipped - track your package';
        case 'completed':
          return 'Order completed successfully';
        case 'failed':
          return 'Order failed or cancelled';
        case 'appeal':
          return 'Order under review';
        default:
          return `Status: ${status}`;
      }
    } else {
      switch (status) {
        case 'pending':
          return `Make payment of ₦${amount.toLocaleString()}`;
        case 'paid':
          return 'Payment confirmed - awaiting shipment';
        case 'completed':
          return 'Order completed successfully';
        case 'appeal':
          return 'Order under review';
        case 'failed':
          return 'Payment failed';
        default:
          return `Status: ${status}`;
      }
    }
  };

  // Combined loading state
  const loading = authLoading || chatsLoading;

  // Combined error state
  const error = chatsError;

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className="w-full mx-auto bg-white min-h-screen">
      <div className="block">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
          <button
            onClick={() => router.push('/dashboard/settings')}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-gray-900">Messages</h1>
        </div>
      </div>
      
      <div className='w-[95%] flex flex-col m-auto justify-center items-center mt-[20px]'>
        {/* Tabs */}
        <div className="flex w-full gap-5 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`pb-2 px-2 text-sm font-medium transition-colors relative ${
              activeTab === 'incoming'
                ? 'text-[#3652AD]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Incoming orders
            {activeTab === 'incoming' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3652AD]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('my-orders')}
            className={`pb-2 px-2 text-sm font-medium transition-colors relative ${
              activeTab === 'my-orders'
                ? 'text-[#3652AD]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My orders
            {activeTab === 'my-orders' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3652AD]" />
            )}
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex w-full gap-2 mt-[20px] border-b border-gray-100 mb-[30px]">
          {getActiveStatusFilters().map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveStatus(filter.id)}
              className={`w-full py-2 rounded-sm text-[10px] font-medium transition-colors ${
                activeStatus === filter.id
                  ? 'bg-[#3652AD] text-white'
                  : 'bg-white border border-[#00000080] text-[#00000080] '
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="w-full p-8 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-500 mt-4">Loading {activeTab === 'incoming' ? 'incoming' : 'your'} orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="w-full p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              {error.includes('log in') && (
                <button
                  onClick={handleLoginRedirect}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <div className="divide-y w-full divide-gray-100">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  No {activeTab === 'incoming' ? 'incoming' : ''} orders found
                </p>
                <p className="text-gray-500">
                  {activeStatus === 'all' 
                    ? `You don't have any ${activeTab === 'incoming' ? 'incoming' : ''} orders yet.`
                    : `No ${activeTab === 'incoming' ? 'incoming' : ''} orders with status "${activeStatus}" found.`
                  }
                </p>
                {activeTab === 'my-orders' && (
                  <p className="text-sm text-gray-400 mt-2">
                    Start shopping to see your orders here.
                  </p>
                )}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id}>
                  <button
                    onClick={() => handleOrderClick(order.id, order.chatId)}
                    className="w-full p-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {order.customerAvatar ? (
                          <img
                            src={order.customerAvatar}
                            alt={order.customerName}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : null}
                        {!order.customerAvatar && (
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 text-sm font-semibold">
                              {getInitials(order.customerName)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Order Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-[12px] font-normal text-gray-600">
                            {order.customerName}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                              {getStatusDisplayText(order.status, activeTab)}
                            </span> */}
                            <span className="text-[12px] text-gray-500">
                              {order.time}
                            </span>
                          </div>
                        </div>
                        <p className="text-[12px] font-semibold text-gray-900">
                          {order.productName}
                        </p>
                        <p className="text-[12px] text-[#00000080]">
                          {getOrderDescriptionText(order, activeTab)}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation/>
      </div>
    </div>
  );
}