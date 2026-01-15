import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Order {
  id: string;
  productName: string;
  price: number;
  image: string;
  isPaid: boolean;
  deliveryAddress: string;
}

const ToShipTabComponent: React.FC = () => {
  const orders: Order[] = [
    {
      id: '1',
      productName: 'Photopulse camera',
      price: 40000,
      image: '/images/skincare-product.jpg',
      isPaid: true,
      deliveryAddress: '123 Main St, Lagos'
    },
    {
      id: '2',
      productName: 'Nike Air Max',
      price: 40000,
      image: '/images/nike-shoe.jpg',
      isPaid: true,
      deliveryAddress: '456 Oak Ave, Abuja'
    }
  ];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleViewDeliveryAddress = (orderId: string) => {
    console.log('View delivery address for order:', orderId);
  };

  const handleShipOrder = (orderId: string) => {
    console.log('Ship order:', orderId);
  };

  if (orders.length === 0) {
    return (
      <EmptyState 
        title="No orders to ship"
        description="Orders that need shipping will appear here"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          formatPrice={formatPrice}
          onViewAddress={handleViewDeliveryAddress}
          onShipOrder={handleShipOrder}
        />
      ))}
    </div>
  );
};

const OrderCard: React.FC<{
  order: Order;
  formatPrice: (price: number) => string;
  onViewAddress: (orderId: string) => void;
  onShipOrder: (orderId: string) => void;
}> = ({ order, formatPrice, onViewAddress, onShipOrder }) => (
  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
    <div className="aspect-video bg-gray-100">
      <img
        src={order.image}
        alt={order.productName}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE3NVYxNzVIMjI1VjEyNUgxNzVaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg==';
        }}
      />
    </div>

    <div className="p-5">
      <h3 className="text-base font-medium text-gray-900 text-[18px] mb-2">
        {order.productName}
      </h3>

      <div className="text-xl font-bold text-[20px] text-gray-900 mb-3">
        {formatPrice(order.price)}
      </div>

      {order.isPaid && (
        <div className="inline-block mb-4">
          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
            Paid
          </span>
        </div>
      )}

      <button
        onClick={() => onViewAddress(order.id)}
        className="flex items-center justify-between w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 mb-4"
      >
        <span className="text-sm text-gray-700 font-medium">
          Delivery address
        </span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </button>

      <button
        onClick={() => onShipOrder(order.id)}
        className="w-full py-3 text-[14px] px-6 bg-[#3652AD] text-white font-semibold rounded-full transition-colors duration-200"
      >
        I have shipped this order
      </button>
    </div>
  </div>
);

const EmptyState: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
    <div className="text-gray-400 mb-4">
      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);

export default ToShipTabComponent;