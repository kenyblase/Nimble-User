import React, { useState } from 'react';

interface CompletedOrder {
  id: string;
  productName: string;
  price: number;
  image: string;
  hasReview: boolean;
  listedOn: string;
  status?: string;
}

const SoldListingsComponent: React.FC = () => {
  const [orders] = useState<CompletedOrder[]>([
    {
      id: '1',
      productName: 'Photopulse camera',
      price: 40000,
      image: '/images/blonde-wig.jpg',
      hasReview: false,
      listedOn: '12th Aug, 2023',
      status: 'Sold'
    },
    {
      id: '2',
      productName: 'Photopulse camera',
      price: 40000,
      image: '/images/camera-lens.jpg',
      hasReview: false,
      listedOn: '12th Aug, 2023',
      status: 'Sold'
    }
  ]);

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleLeaveReview = (orderId: string) => {
    console.log('Leave review for order:', orderId);
  };

  const handleReorder = (orderId: string) => {
    console.log('Reorder item:', orderId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white">
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
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {order.productName}
              </h3>

              {/* Price */}
              <div className="text-sm font-bold  text-gray-900 mb-3">
                {formatPrice(order.price)}
              </div>

              {/* Paid Badge */}
              <div className="mb-2 mt-2">
                <span className="flex justify-between text-[10px] border-t border-gray-300 py-1 text-black">
                  Listed on {order.listedOn}
                  <div className=" text-[#0DBA37] text-[10px]">{order.status}</div>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {/* Leave Review Button */}
                

                {/* Reorder Button */}
                <button
                  onClick={() => handleReorder(order.id)}
                  className="flex-1 py-2.5 px-4 bg-[#3652AD] text-white font-semibold rounded-full text-[10px]"
                >
                  Re-list item
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoldListingsComponent;