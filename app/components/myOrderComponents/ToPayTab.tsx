import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  productName: string;
  price: number;
  image: string;
  paymentStatus: 'unpaid';
}

const ToPayTab: React.FC = () => {
  const orders: Order[] = [
    {
      id: '1',
      productName: 'Photopulse camera',
      price: 40000,
      image: '/images/blonde-wig.jpg',
      paymentStatus: 'unpaid'
    },
    {
      id: '2',
      productName: 'Photopulse camera',
      price: 40000,
      image: '/images/black-wig.jpg',
      paymentStatus: 'unpaid'
    }
  ];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handlePayNow = (orderId: string) => {
    console.log('Pay for order:', orderId);
  };

  // if (orders.length === 0) {
  //   return <EmptyState />;
  // }

  return (
    <>
      {/* Alert Banner */}
      <div className="bg-[#FE7A3633] border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#EC6A0D] flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-[#EC6A0D] text-sm mb-1">Complete order</h3>
          <p className="text-sm text-[#EC6A0D]">
            Please see offers accepted by seller
          </p>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
          >
            {/* Product Image */}
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

            {/* Order Details */}
            <div className="p-5">
              <h3 className="text-sm text-gray-900 mb-2">
                {order.productName}
              </h3>

              <div className="text-sm font-semibold text-gray-900 mb-3">
                {formatPrice(order.price)}
              </div>

              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-orange-50 text-[#EB6F4A] text-xs font-semibold rounded-full">
                  Unpaid
                </span>
              </div>

              <button
                onClick={() => handlePayNow(order.id)}
                className="w-full text-sm py-2 px-6 bg-[#3652AD] text-white font-semibold rounded-full transition-colors duration-200"
              >
                Pay now
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ToPayTab;