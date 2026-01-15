'use client';
import React, { useState, useEffect } from 'react';
import { MessageComponentProps } from '@/app/types/types';
import PaymentPopup from './PaymentPopUp';
import { useOrderApi } from '@/app/lib/hooks/useOrderApis/useOrderApi'; // Import your order hook
import { useAuthStore } from '@/app/lib/stores/useAuthStore'; // Import auth store

interface Message {
  _id: string;
  chatId?: string;
  chat?: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  type: 'text' | 'invoice' | 'payment' | 'offer' | 'extra-charge' | 'offer-accepted' | 'payment-request' | 'counter-declined';
  text?: string;
  offer?: {
    amount: number;
    status: 'sent' | 'accepted' | 'declined';
    proposedBy: string;
    bestPrice?: number;
    initialOfferMessageId?: string;
  };
  invoice?: {
    amount: number;
    description?: string;
    status: 'pending' | 'paid' | 'cancelled';
    currency?: string;
    dueDate?: string;
    items?: Array<{
      name: string;
      quantity: number;
      size?: string;
      price: number;
    }>;
    notes?: string;
    deliveryFee?: number;
    subtotal?: number;
    commission?: number;
    youReceive?: number;
  };
  payment?: any;
  extraCharge?: any;
  isFromAdmin?: boolean;
  readBy?: string[];
  tempId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Chat {
  _id: string;
  buyer: { _id: string; firstName: string; lastName: string; profilePic?: string };
  seller: { _id: string; firstName: string; lastName: string; profilePic?: string };
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
}

export default function InvoiceMessage({ 
  message, 
  currentUserId,
  chat,
  onPayInvoice,
  onDeclineInvoice
}: MessageComponentProps & {
  chat?: Chat;
  onPayInvoice?: (message: Message) => void;
  onDeclineInvoice?: (message: Message) => void;
}) {
  const [cachedInvoiceData, setCachedInvoiceData] = useState<any>(null);
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    phone: '',
    address: ''
  });
  
  const { user } = useAuthStore(); // Get current user
  const { createOrder, loading: orderApiLoading } = useOrderApi(); // Use order API
  
  const isUserMessage = message.sender._id === currentUserId;
  const invoiceStatus = message.invoice?.status || 'pending';
  const isBuyer = user?._id === chat?.buyer._id;
  
  // Store invoice data when available
  useEffect(() => {
    if (message.invoice && Object.keys(message.invoice).length > 0) {
      const invoiceCacheKey = `invoice_${message._id}`;
      const invoiceData = JSON.stringify(message.invoice);
      
      try {
        localStorage.setItem(invoiceCacheKey, invoiceData);
        console.log('💾 Stored invoice in cache:', invoiceCacheKey);
      } catch (error) {
        console.error('❌ Error storing invoice in localStorage:', error);
      }
    }
  }, [message.invoice, message._id]);

  // Retrieve cached invoice data
  useEffect(() => {
    if (!message.invoice || Object.keys(message.invoice).length === 0) {
      const invoiceCacheKey = `invoice_${message._id}`;
      const cachedData = localStorage.getItem(invoiceCacheKey);
      
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          console.log('📥 Retrieved cached invoice data:', parsedData);
          setCachedInvoiceData(parsedData);
        } catch (error) {
          console.error('❌ Error parsing cached invoice data:', error);
        }
      }
    }
  }, [message.invoice, message._id]);

  // Initialize delivery address from user profile
  useEffect(() => {
    if (user) {
      setDeliveryAddress({
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone || '+234-000-000-0000',
        address: '177, Agbrey Road, Ibadan, Oyo state.' // Default or from user profile
      });
    }
  }, [user]);

  const effectiveInvoice = message.invoice && Object.keys(message.invoice).length > 0 
    ? message.invoice 
    : cachedInvoiceData;

  // Parse invoice data - FIXED VERSION
  const parseInvoiceData = () => {
    const invoice = effectiveInvoice || {};
    const description = invoice.description || message.text || '';

    console.log('📋 Parsing invoice data:', {
      invoice: invoice,
      description: description,
      hasItems: invoice.items && invoice.items.length > 0,
      items: invoice.items
    });

    // Method 1: Use direct invoice data with items array
    if (invoice.items && Array.isArray(invoice.items) && invoice.items.length > 0) {
      const item = invoice.items[0];
      const quantity = item.quantity || 1;
      const pricePerUnit = item.price || 0;
      const deliveryFee = invoice.deliveryFee || 0;
      const subtotal = invoice.subtotal || (quantity * pricePerUnit);
      const commission = invoice.commission || (subtotal * 0.1);
      const total = invoice.amount || (subtotal + deliveryFee);
      const sellerReceives = invoice.youReceive || (subtotal - commission + deliveryFee);
      
      console.log('📊 Direct invoice data parsed:', {
        quantity,
        pricePerUnit,
        deliveryFee,
        subtotal,
        commission,
        total,
        sellerReceives,
        productName: item.name || chat?.product?.name || 'Product'
      });
      
      return {
        quantity,
        pricePerUnit,
        deliveryFee,
        subtotal,
        commission,
        total,
        sellerReceives,
        productName: item.name || chat?.product?.name || 'Product',
        size: item.size
      };
    }
    
    // Method 2: Parse from description if items array is missing
    if (description && (!invoice.items || invoice.items.length === 0)) {
      console.log('🔍 Parsing from description:', description);
      
      const quantityMatch = description.match(/Quantity:\s*(\d+)/i);
      const priceMatch = description.match(/Price per unit:\s*₦?\s*([\d,.]+)/i);
      const deliveryMatch = description.match(/Delivery:\s*₦?\s*([\d,.]+)/i);
      
      const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
      const pricePerUnit = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : (invoice.amount || 0);
      const deliveryFee = deliveryMatch ? parseFloat(deliveryMatch[1].replace(/,/g, '')) : 0;
      
      const subtotal = quantity * pricePerUnit;
      const commission = subtotal * 0.1;
      const total = invoice.amount || (subtotal + deliveryFee);
      const sellerReceives = subtotal - commission + deliveryFee;
      
      console.log('📊 Description parsed:', {
        quantity,
        pricePerUnit,
        deliveryFee,
        subtotal,
        commission,
        total,
        sellerReceives
      });
      
      return {
        quantity,
        pricePerUnit,
        deliveryFee,
        subtotal,
        commission,
        total,
        sellerReceives,
        productName: chat?.product?.name || 'Product'
      };
    }
    
    // Method 3: Fallback to amount only
    if (invoice.amount && invoice.amount > 0) {
      console.log('📊 Using amount only fallback:', invoice.amount);
      
      return {
        quantity: 1,
        pricePerUnit: invoice.amount,
        deliveryFee: 0,
        subtotal: invoice.amount,
        commission: invoice.amount * 0.1,
        total: invoice.amount,
        sellerReceives: invoice.amount * 0.9,
        productName: chat?.product?.name || 'Product'
      };
    }
    
    console.log('⚠️ No valid invoice data found');
    
    return {
      quantity: 1,
      pricePerUnit: 0,
      deliveryFee: 0,
      subtotal: 0,
      commission: 0,
      total: 0,
      sellerReceives: 0,
      productName: chat?.product?.name || 'Product'
    };
  };

  const {
    quantity,
    pricePerUnit,
    deliveryFee,
    subtotal,
    commission,
    total,
    sellerReceives,
    productName,
    size
  } = parseInvoiceData();

  const displayTotal = total > 0 ? total : 0;
  const displaySubtotal = subtotal > 0 ? subtotal : 0;
  const displayCommission = commission > 0 ? commission : 0;
  const displaySellerReceives = sellerReceives > 0 ? sellerReceives : 0;
  const displayDeliveryFee = deliveryFee > 0 ? deliveryFee : 0;

  const firstName = `${message.sender.firstName}`;
  const capitalized = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  // Prepare order details when payment popup opens
  const prepareOrderDetails = () => {
    if (!chat) return null;

    const vendorId = chat.seller._id;
    const productId = chat.product._id;
    
    return {
      productId,
      vendorId,
      productName: productName,
      productImage: chat.product.images?.[0],
      size: size || 'N/A',
      quantity: quantity,
      unitPrice: pricePerUnit,
      deliveryFee: displayDeliveryFee,
      total: displayTotal
    };
  };

  // Handle payment button click - opens popup
  const handlePayClick = () => {
    if (!isBuyer) {
      alert('Only the buyer can pay for invoices');
      return;
    }

    if (!chat || !user) {
      alert('Unable to process payment. Please try again.');
      return;
    }

    const orderDetails = prepareOrderDetails();
    if (!orderDetails) {
      alert('Invalid invoice data. Cannot process payment.');
      return;
    }

    console.log('🛒 Opening payment popup for invoice:', orderDetails);
    setOrderDetails(orderDetails);
    setIsPaymentPopupOpen(true);
  };

  // Handle payment confirmation from popup
  const handleConfirmPayment = async (paymentData: {
    paymentMethod: 'crypto' | 'bank-transfer' | 'balance';
    deliveryAddress: {
      name: string;
      phone: string;
      address: string;
    };
  }) => {
    console.log('💳 Payment confirmed with data:', {
      paymentMethod: paymentData.paymentMethod,
      deliveryAddress: paymentData.deliveryAddress
    });
    
    setPaymentLoading(true);

    try {
      // Validate required data
      if (!chat || !orderDetails || !user) {
        throw new Error('Missing required data for payment');
      }

      // Format delivery address
      const formattedAddress = `${paymentData.deliveryAddress.name}, ${paymentData.deliveryAddress.phone}, ${paymentData.deliveryAddress.address}`;
      
      console.log('📦 Creating order with:', {
        vendorId: orderDetails.vendorId,
        productId: orderDetails.productId,
        quantity: orderDetails.quantity,
        price: orderDetails.unitPrice,
        address: formattedAddress,
        paymentMethod: paymentData.paymentMethod
      });

      // Call createOrder API
      const result = await createOrder(
        orderDetails.vendorId,
        orderDetails.productId,
        orderDetails.quantity,
        orderDetails.unitPrice,
        formattedAddress,
        paymentData.paymentMethod
      );

      console.log('✅ Order creation result:', result);

      if (result.type === 'order') {
        // Order created successfully with balance
        setIsPaymentPopupOpen(false);
        setPaymentLoading(false);
        
        // Update invoice status via parent handler
        if (onPayInvoice) {
          await onPayInvoice(message);
        }
        
        // Show success message
        alert('🎉 Payment successful! Order has been created.');
        
        // Send chat message about payment
        // Note: You might want to add this in your parent component
        
      } else if (result.type === 'redirect') {
        // Redirect to payment gateway
        setIsPaymentPopupOpen(false);
        setPaymentLoading(false);
        
        if (result.data.paymentUrl) {
          window.open(result.data.paymentUrl, '_blank');
        }
      }

    } catch (error: any) {
      console.error('❌ Payment error:', error);
      setPaymentLoading(false);
      
      // Show user-friendly error message
      const errorMessage = error.message || 'Payment failed. Please try again.';
      alert(errorMessage);
      
      // Keep popup open for retry
    }
  };

  // Handle payment redirect
  const handlePaymentRedirect = (paymentUrl: string) => {
    console.log('🔗 Redirecting to payment gateway:', paymentUrl);
    setIsPaymentPopupOpen(false);
    window.open(paymentUrl, '_blank');
  };

  // Handle order created callback
  const handleOrderCreated = (order: any) => {
    console.log('✅ Order created successfully:', order);
    setIsPaymentPopupOpen(false);
    
    if (onPayInvoice) {
      onPayInvoice(message);
    }
    
    alert('🎉 Order placed successfully!');
    // You could redirect to order page or update UI
  };

  return (
    <>
      <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} gap-3`}>
        {/* Profile picture for messages from others */}
        {!isUserMessage && (
          <div className="flex-shrink-0">
            {message.sender.profilePic ? (
              <img 
                src={message.sender.profilePic} 
                alt={message.sender.firstName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold">
                {message.sender.firstName?.[0]}{message.sender.lastName?.[0]}
              </div>
            )}
          </div>
        )}

        <div className={`flex flex-col ${isUserMessage ? 'items-end' : 'items-start'}`}>
          <div className={`rounded-2xl p-0 max-w-xs ${isUserMessage ? 'bg-[#3652AD1A] border border-green-200' : 'bg-[#3652AD1A] border border-gray-200 shadow-sm'}`}>
            {/* Invoice Header */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3652AD] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {isUserMessage ? 'You sent an invoice' : `${capitalized} sent you an invoice`}
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    ₦{pricePerUnit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Product details</h3>
              
              <div className="flex items-start gap-3 mb-3">
                {chat?.product?.images?.[0] && (
                  <img 
                    src={chat.product.images[0]} 
                    alt={productName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{productName}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-600">
                      Qty: {quantity} 
                      {size && ` • Size: ${size}`}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      ₦{pricePerUnit.toLocaleString()} each
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Summary Table */}
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Summary</h3>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 text-sm text-gray-600">Sub-total</td>
                    <td className="py-1 text-sm text-gray-900 text-right">₦{displaySubtotal.toLocaleString()}</td>
                  </tr>
                  {isUserMessage && displayCommission > 0 && (
                    <tr>
                      <td className="py-1 text-sm text-gray-600">Commission (10%)</td>
                      <td className="py-1 text-sm text-red-600 text-right">-₦{displayCommission.toLocaleString()}</td>
                    </tr>
                  )}
                  {displayDeliveryFee > 0 && (
                    <tr>
                      <td className="py-1 text-sm text-gray-600">Delivery fee</td>
                      <td className="py-1 text-sm text-gray-900 text-right">₦{displayDeliveryFee.toLocaleString()}</td>
                    </tr>
                  )}
                  <tr className="border-t">
                    <td className="py-2 text-sm font-semibold text-gray-900">
                      {isUserMessage ? 'You receive' : 'Total'}
                    </td>
                    <td className="py-2 text-sm font-semibold text-gray-900 text-right">
                      ₦{(isUserMessage ? displaySellerReceives : displayTotal).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Action Buttons - Only for buyer on pending invoices */}
            {!isUserMessage && displayTotal > 0 && invoiceStatus === 'pending' && isBuyer && (
              <div className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={handlePayClick}
                    className="flex-1 px-4 py-2 bg-transparent text-[#3652ADB2] font-medium rounded-[100px] border-[#3652ADB2] border text-sm hover:bg-[#3652AD] hover:text-white transition-colors"
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? 'Processing...' : 'Pay now'}
                  </button>
                </div>
              </div>
            )}

            {/* Invoice Status Badge */}
            {/* Invoice Status Badge */}
{/* Invoice Status Badge - Only show when not pending (since action buttons occupy that space) */}
            {invoiceStatus !== 'pending' && (
              <div className="p-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  invoiceStatus === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800' // Only cancelled left since we know it's not pending
                }`}>
                  {invoiceStatus === 'paid' && '✓ Paid'}
                  {invoiceStatus === 'cancelled' && '✗ Cancelled'}
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {displayTotal === 0 && (
              <div className="p-4">
                <p className="text-sm text-center text-yellow-600">
                  ⚠️ Invoice details loading...
                </p>
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          <p className="text-xs text-gray-500 mt-1 ml-1">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Profile picture for user's own messages */}
        {isUserMessage && (
          <div className="flex-shrink-0">
            {message.sender.profilePic ? (
              <img 
                src={message.sender.profilePic} 
                alt="You"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold">
                {message.sender.firstName?.[0]}{message.sender.lastName?.[0]}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Popup */}
      {orderDetails && (
        <PaymentPopup
          isOpen={isPaymentPopupOpen}
          onClose={() => setIsPaymentPopupOpen(false)}
          onOrderCreated={handleOrderCreated}
          onPaymentRedirect={handlePaymentRedirect}
          orderDetails={orderDetails}
        />
      )}
    </>
  );
}