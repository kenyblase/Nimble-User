// components/PaymentPopup.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useOrderApi } from '@/app/lib/hooks/useOrderApis/useOrderApi';
import { useAuthStore } from '@/app/lib/stores/useAuthStore';

interface OrderDetails {
  productId: string;
  vendorId: string;
  productName: string;
  productImage?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  deliveryFee: number;
  total: number;
}

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: (order: any) => void;
  onPaymentRedirect?: (paymentUrl: string) => void;
  orderDetails: OrderDetails;
}

export default function PaymentPopup({ 
  isOpen, 
  onClose, 
  onOrderCreated,
  onPaymentRedirect,
  orderDetails
}: PaymentPopupProps) {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'bank-transfer' | 'balance'>('balance');
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [showAddressEdit, setShowAddressEdit] = useState(false);
  
  const { user } = useAuthStore();
  const { createOrder, loading, error, userBalance } = useOrderApi();

  // Initialize delivery address from user profile
  useEffect(() => {
    if (user) {
      setDeliveryAddress({
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone || '+234-000-000-0000',
        address: '177, Agbrey Road, Ibadan, Oyo state.'
      });
    }
  }, [user]);

  const handleConfirm = async () => {
    try {
      // Validate delivery address
      if (!deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.address) {
        throw new Error('Please complete your delivery address');
      }

      // Format delivery address
      const formattedAddress = `${deliveryAddress.name}, ${deliveryAddress.phone}, ${deliveryAddress.address}`;
      
      const result = await createOrder(
        orderDetails.vendorId,
        orderDetails.productId,
        orderDetails.quantity,
        orderDetails.unitPrice,
        formattedAddress,
        paymentMethod
      );

      if (result.type === 'order') {
        // Order created successfully with balance
        if (onOrderCreated) {
          onOrderCreated(result.data.order);
        }
        
        alert('Order created successfully!');
        onClose();
        
      } else if (result.type === 'redirect') {
        // Redirect to payment gateway
        if (onPaymentRedirect && result.data.paymentUrl) {
          onPaymentRedirect(result.data.paymentUrl);
        } else if (result.data.paymentUrl) {
          window.open(result.data.paymentUrl, '_blank');
        }
      }

    } catch (err: any) {
      console.error('Payment error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-gray-50 rounded-t-xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-5 py-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Place order</h2>
          <button 
            onClick={onClose}
            className="text-red-500 font-medium text-sm"
            disabled={loading}
          >
            Cancel
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Delivery Address Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Delivery address
            </h3>
            
            {showAddressEdit ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={deliveryAddress.name}
                  onChange={(e) => setDeliveryAddress({...deliveryAddress, name: e.target.value})}
                  placeholder="Full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="tel"
                  value={deliveryAddress.phone}
                  onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                  placeholder="Phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <textarea
                  value={deliveryAddress.address}
                  onChange={(e) => setDeliveryAddress({...deliveryAddress, address: e.target.value})}
                  placeholder="Delivery address"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddressEdit(false)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium"
                  >
                    Save address
                  </button>
                  <button
                    onClick={() => setShowAddressEdit(false)}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-medium text-[#0DBA37] bg-[#DBFEC5] px-2 py-0.5 rounded">
                        Default Address
                      </span>
                    </div>
                    <div className='mt-2'>
                      <p className="font-semibold text-gray-900 text-sm mb-1">
                        {deliveryAddress.name || 'No name provided'}
                      </p>
                      <p className="text-xs text-gray-600 mb-1">
                        {deliveryAddress.phone || 'No phone provided'}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {deliveryAddress.address || 'No address provided'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddressEdit(true)}
                    className="text-[#3652AD] text-sm font-medium flex items-center gap-1 flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Options */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Select payment option
            </h3>
            
            <div className="space-y-3">
              {/* Balance Payment */}
              <label className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${userBalance >= orderDetails.total ? 'bg-white' : 'bg-gray-100 opacity-50 cursor-not-allowed'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="balance"
                    checked={paymentMethod === 'balance'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'balance')}
                    className="w-4 h-4 text-orange-500"
                    disabled={userBalance < orderDetails.total}
                  />
                  <div>
                    <span className="font-medium text-gray-900 text-sm">Use Balance</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Balance: ₦{userBalance.toLocaleString()}
                    </p>
                    {userBalance < orderDetails.total && (
                      <p className="text-xs text-red-500 mt-1">
                        Insufficient balance. Please use another payment method.
                      </p>
                    )}
                  </div>
                </div>
              </label>

              {/* Crypto Currency */}
              <label className="flex items-center justify-between p-4 bg-white rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="crypto"
                    checked={paymentMethod === 'crypto'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'crypto')}
                    className="w-4 h-4 text-orange-500"
                  />
                  <span className="font-medium text-gray-900 text-sm">Crypto currency</span>
                </div>
                <div className="flex gap-1.5">
                  <img src="/usdt.png" alt="USDT" className="w-6 h-6" />
                  <img src="/BTC.png" alt="BTC" className="w-6 h-6" />
                  <img src="/ETH.png" alt="ETH" className="w-6 h-6" />
                </div>
              </label>

              {/* Bank Transfer */}
              <label className="flex items-center justify-between p-4 bg-white rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="bank-transfer"
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'bank-transfer')}
                    className="w-4 h-4"
                  />
                  <span className="font-medium text-gray-900 text-sm">Bank transfer</span>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Order Summary
            </h3>
            
            <div className="bg-white rounded-2xl p-4 space-y-4 border border-gray-200">
              <div className="flex items-start gap-3">
                {orderDetails.productImage ? (
                  <img 
                    src={orderDetails.productImage} 
                    alt={orderDetails.productName}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm mb-1">
                    {orderDetails.productName}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    {orderDetails.size && (
                      <span className="bg-gray-100 px-2 py-0.5 rounded">Size: {orderDetails.size}</span>
                    )}
                    <span className="bg-gray-100 px-2 py-0.5 rounded">Qty: {orderDetails.quantity}</span>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 text-sm flex-shrink-0">
                  ₦{orderDetails.unitPrice.toLocaleString()}
                </p>
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₦{(orderDetails.unitPrice * orderDetails.quantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-medium">₦{orderDetails.deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₦{orderDetails.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              disabled={loading || (paymentMethod === 'balance' && userBalance < orderDetails.total)}
              className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : paymentMethod === 'balance' && userBalance < orderDetails.total ? (
                'Insufficient Balance'
              ) : (
                `Continue`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}