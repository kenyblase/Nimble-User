'use client'
import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import Header from '@/app/components/TopBar';
import VerticalNavMenu from '@/app/components/SidebarNavigation';
import Footer from '@/app/components/Footer';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderStatus {
  id: string;
  label: string;
  date: string;
  completed: boolean;
}

const OrderDetailComponent: React.FC = () => {
  const [order] = useState({
    orderNumber: '#001',
    orderDate: '12 May, 2023',
    isPaid: true,
    deliveryAddress: {
      name: 'John Apolokosi',
      phone: '+234-687-5876-57',
      address: '177, Aggrey Road, Ibadan, Oyo state.'
    },
    items: [
      {
        id: '1',
        name: 'Photopulse camera',
        quantity: 2,
        price: 15000,
        image: '/images/camera-product.jpg'
      }
    ],
    subtotal: 30000,
    delivery: 0,
    total: 30000
  });

  const orderStatuses: OrderStatus[] = [
    {
      id: '1',
      label: 'Order placed',
      date: '02 May, 2023',
      completed: true
    },
    {
      id: '2',
      label: 'Order is shipped',
      date: '03 May, 2023',
      completed: true
    },
    {
      id: '3',
      label: 'Estimated delivery date',
      date: '06 May, 2023',
      completed: false
    }
  ];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleBack = () => {
    console.log('Navigate back');
  };

  const handleShipped = () => {
    console.log('Mark as shipped');
  };

  return (
    <div className='w-full flex flex-col'>
      <Header/>
      <div className="w-[90%] flex flex-col lg:flex-row mt-[5px] mx-auto bg-white">
        {/* Sidebar - hidden on mobile */}
        <div className=" lg:block lg:w-64 xl:w-72 flex-shrink-0">
          <VerticalNavMenu/>
        </div>

        {/* Main Content */}
        <div className='flex flex-col w-full lg:ml-6 xl:ml-8 lg:mt-[10px] max-w-4xl'>
          {/* Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <button
              onClick={handleBack}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Order {order.orderNumber}</h1>
          </div>

          {/* Product Card */}
          <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={order.items[0].image}
                  alt={order.items[0].name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4=';
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm sm:text-base text-gray-900 mb-1 truncate">{order.items[0].name}</h3>
                <p className="text-base sm:text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
              </div>
            </div>
            {order.isPaid && (
              <span className="px-2 sm:px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full ml-2 flex-shrink-0">
                Paid
              </span>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleShipped}
            className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-full transition-colors duration-200 mb-6 sm:mb-8"
          >
            I have shipped order
          </button>

          {/* Order Progress */}
          <div className="mb-6 sm:mb-8">
            <div className="relative">
              {/* Progress Line - Hidden on very small screens */}
              <div className="hidden sm:block absolute top-6 left-6 right-6 h-0.5 bg-gray-200">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: '50%' }}
                />
              </div>

              {/* Status Items */}
              <div className="relative flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
                {orderStatuses.map((status, index) => (
                  <div key={status.id} className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0" style={{ flex: 1 }}>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center sm:mb-3 transition-colors duration-300 flex-shrink-0 ${
                        status.completed
                          ? 'bg-green-500'
                          : 'bg-white border-2 border-gray-300'
                      }`}
                    >
                      {status.completed && <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                    </div>
                    <div className="flex-1 sm:flex-none">
                      <h4
                        className={`text-xs sm:text-sm font-medium sm:text-center mb-0 sm:mb-1 ${
                          status.completed ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {status.label}
                      </h4>
                      <p
                        className={`text-xs sm:text-center ${
                          status.completed ? 'text-gray-600' : 'text-gray-400'
                        }`}
                      >
                        {status.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
            <div>
              <h3 className="text-xs sm:text-sm text-gray-600 mb-1">Order number</h3>
              <p className="font-semibold text-sm sm:text-base text-gray-900">{order.orderNumber}</p>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm text-gray-600 mb-1">Delivery address</h3>
              <p className="font-semibold text-sm sm:text-base text-gray-900 mb-1">{order.deliveryAddress.name}</p>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">{order.deliveryAddress.phone}</p>
              <p className="text-xs sm:text-sm text-gray-600">{order.deliveryAddress.address}</p>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm text-gray-600 mb-1">Order date</h3>
              <p className="font-semibold text-sm sm:text-base text-gray-900">{order.orderDate}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Order Summary</h2>

            {/* Order Item */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 pb-4 border-b border-gray-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={order.items[0].image}
                  alt={order.items[0].name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4=';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">{order.items[0].name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">Qty: {order.items[0].quantity}</p>
              </div>
              <div className="font-bold text-sm sm:text-base text-gray-900 flex-shrink-0">
                ={formatPrice(order.items[0].price)}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Quantity</span>
                <span className="font-semibold text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Delivery:</span>
                <span className="font-semibold text-gray-900">{order.delivery}</span>
              </div>
              <div className="flex justify-between pt-2 sm:pt-3 border-t border-gray-200 mb-6 sm:mb-8">
                <span className="font-semibold text-sm sm:text-base text-gray-900">Total:</span>
                <span className="font-bold text-orange-600 text-base sm:text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default OrderDetailComponent;