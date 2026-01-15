import React, { useState } from 'react';

interface PendingOrder {
  id: string;
  productName: string;
  price: number;
  image: string;
}

const PendingOrdersComponent: React.FC = () => {
  const [orders] = useState<PendingOrder[]>([
    {
      id: '1',
      productName: 'Photopulse camera',
      price: 40000,
      image: '/images/blonde-wig.jpg'
    },
    {
      id: '2',
      productName: 'Photopulse camera',
      price: 40000,
      image: '/images/camera-lens.jpg'
    }
  ]);

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleOrderClick = (orderId: string) => {
    console.log('Order clicked:', orderId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => handleOrderClick(order.id)}
            className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
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

              {/* Pending Badge */}
              <div>
                <span className="inline-block px-3 py-1 bg-[#f7e9e5] text-[#EB6F4A] text-xs font-semibold rounded-full">
                  Pending
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingOrdersComponent;