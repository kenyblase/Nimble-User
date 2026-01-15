import React from 'react';

interface Order {
  image: string;
  productName: string;
  seller?: string;
  orderDate?: string;
  estimatedDelivery?: string;
  appealReason?: string;
  price: number;
}

interface OrderCardProps {
  order: Order;
  actionButton: React.ReactNode;
  statusBadge: React.ReactNode;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, actionButton, statusBadge }) => {
  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE3NVYxNzVIMjI1VjEyNUgxNzVaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg==';
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      {/* Product Image */}
      <div className="aspect-video bg-gray-100">
        <img
          src={order.image}
          alt={order.productName}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>

      {/* Order Details */}
      <div className="p-5">
        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          {order.productName}
        </h3>

        {/* Seller */}
        {order.seller && (
          <p className="text-xs text-gray-500 mb-2">Sold by: {order.seller}</p>
        )}

        {/* Order Date */}
        {order.orderDate && (
          <p className="text-xs text-gray-500 mb-2">
            Ordered: {formatDate(order.orderDate)}
          </p>
        )}

        {/* Estimated Delivery */}
        {order.estimatedDelivery && (
          <p className="text-xs text-green-600 mb-2">
            Est. delivery: {formatDate(order.estimatedDelivery)}
          </p>
        )}

        {/* Appeal Reason */}
        {order.appealReason && (
          <p className="text-xs text-yellow-600 mb-2">
            Reason: {order.appealReason}
          </p>
        )}

        {/* Price */}
        <div className="text-lg font-bold text-gray-900 mb-3">
          {formatPrice(order.price)}
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          {statusBadge}
        </div>

        {/* Action Button */}
        {actionButton}
      </div>
    </div>
  );
};

export default OrderCard;