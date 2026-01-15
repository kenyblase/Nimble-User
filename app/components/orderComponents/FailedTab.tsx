import React, { useState } from 'react';

interface ShippedOrder {
  id: string;
  productName: string;
  price: number;
  image: string;
  status: 'pending' | 'completed' | 'failed';
}


const FailedOrdersComponent: React.FC = () => {
  const [orders] = useState<ShippedOrder[]>([
    {
      id: '1',
      productName: 'Luxury women shoes',
      price: 40000,
      image: '/images/luxury-shoes.jpg',
      status: 'failed'
    },
    {
      id: '2',
      productName: 'Luxury women shoes',
      price: 40000,
      image: '/images/luxury-shoes-2.jpg',
      status: 'failed'
    }
  ]);

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  return (
    <div className="w-full mx-auto p-0 bg-gray-50 min-h-screen">
      {/* Failed Orders Grid - Responsive columns */}
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
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
              <div className="p-3 sm:p-4 lg:p-5 pt-2">
                {/* Product Name */}
                <h3 className="font-medium text-sm sm:text-base text-gray-900 mb-2 line-clamp-2">
                  {order.productName}
                </h3>

                {/* Price */}
                <div className="text-sm sm:text-base font-bold text-gray-900 mb-3">
                  {formatPrice(order.price)}
                </div>

                {/* Status Badge */}
                <div className="mb-3">
                  <span className="inline-block px-2.5 sm:px-3 py-1 bg-[#f5dada] text-[#942828] text-xs font-semibold rounded-full">
                    Failed
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg sm:rounded-xl p-8 sm:p-12 text-center border border-gray-200">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No failed orders</h3>
          <p className="text-sm sm:text-base text-gray-500">Failed orders will appear here</p>
        </div>
      )}
    </div>
  );
};

export default FailedOrdersComponent;