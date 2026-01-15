import React, { useState } from 'react';

interface PaidOrder {
  id: string;
  productName: string;
  price: number;
  image: string;
  trackingAvailable: boolean;
}

const PaidOrdersComponent: React.FC = () => {
  const [orders] = useState<PaidOrder[]>([
    {
      id: '1',
      productName: 'Photopulse camera',
      price: 40000,
      image: '/images/blonde-wig-product.jpg',
      trackingAvailable: true
    },
    {
      id: '2',
      productName: 'Photopulse camera',
      price: 40000,
      image: '/images/camera-lens-product.jpg',
      trackingAvailable: true
    }
  ]);

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleTrackOrder = (orderId: string) => {
    console.log('Track order:', orderId);
  };

  const handleReceivedOrder = (orderId: string) => {
    console.log('Confirm order received:', orderId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
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
              {/* Product Name */}
              <h3 className="text-base font-medium text-gray-900 mb-2">
                {order.productName}
              </h3>

              {/* Price */}
              <div className="text-xl font-bold text-gray-900 mb-3">
                {formatPrice(order.price)}
              </div>

              {/* Paid Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                  Paid
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Track Order Button */}
                <button
                  onClick={() => handleTrackOrder(order.id)}
                  className="w-full py-3 px-6 border-2 border-[#3652AD] text-[#3652AD] font-semibold rounded-full hover:bg-blue-50 transition-colors duration-200"
                >
                  Track order
                </button>

                {/* Received Order Button */}
                <button
                  onClick={() => handleReceivedOrder(order.id)}
                  className="w-full py-3 px-6 bg-[#3652AD] text-white font-semibold rounded-full transition-colors duration-200"
                >
                  I have received order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Info */}
      
    </div>
  );
};

export default PaidOrdersComponent;