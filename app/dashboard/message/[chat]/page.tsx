'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/lib/stores/useAuthStore';
import { useCheckAuth } from '@/app/lib/hooks/useAuthApis/useCheckAuth';
import { useSendMessage } from '@/app/lib/hooks/useChatApis/useSendMessage';
import { useChatMessages } from '@/app/lib/hooks/useChatApis/useChatMessages';
import { useChat } from '@/app/lib/hooks/useChatApis/useChat';
import { initSocket } from '@/app/lib/socket/socket';
import { useQueryClient } from '@tanstack/react-query';

import DeclineOfferPopup from '@/app/components/chatComponents/DeclineOfferPopup';
import {
  RegularMessage,
  OfferSentMessage,
  AcceptedOfferMessage,
  DeclinedOfferMessage,
  BuyerDeclinedCounterMessage,
  PaymentRequestMessage,
} from '@/app/components/chatComponents';
import InvoiceMessage from '@/app/components/chatComponents/InvoiceMessage';


// Define Message interface
// Update the Message interface
// Update the invoice interface in the Message interface
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
      price: number;
    }>;
    notes?: string;
    subtotal?: number; // Add this
    deliveryFee?: number; // Add this
    commission?: number; // Add this
    youReceive?: number; // Add this
  };
  payment?: any;
  extraCharge?: any;
  isFromAdmin?: boolean;
  readBy?: string[];
  tempId?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  avatar?: string;
  
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[];
}

interface Chat {
  _id: string;
  buyer: User;
  seller: User;
  product: Product;
  lastMessage: string;
  isReported: boolean;
  adminInvolved: string[];
  updatedAt: string;
  createdAt: string;
}

// Make Offer Popup Component - Fixed Integration
function MakeOfferPopup({ 
  isOpen, 
  onClose, 
  onSubmit,
  currentPrice,
  loading = false
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (offerData: { amount: number }) => void;
  currentPrice: number;
  loading?: boolean;
}) {
  const [offerAmount, setOfferAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!offerAmount) {
      setError('Please enter an offer amount');
      return;
    }

    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount > currentPrice) {
      setError('Offer amount cannot be higher than current price');
      return;
    }

    onSubmit({ amount });
    setOfferAmount('');
  };

  const handleCancel = () => {
    setOfferAmount('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-sm mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 text-center">Make an Offer</h2>
          <p className="text-sm text-gray-600 mt-2 text-center">Current price: ₦{currentPrice.toLocaleString()}</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter your offer amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-lg">
                ₦
              </span>
              <input
                type="number"
                value={offerAmount}
                onChange={(e) => {
                  setOfferAmount(e.target.value);
                  setError('');
                }}
                placeholder="0"
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-semibold"
                autoFocus
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 px-4 py-3 text-gray-700 font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!offerAmount || loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Offer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Payment Request Component
// function PaymentRequestPopup({ 
//   isOpen, 
//   onClose, 
//   onPay,
//   amount 
// }: { 
//   isOpen: boolean; 
//   onClose: () => void; 
//   onPay: () => void;
//   amount: number;
// }) {
//   if (!isOpen) return null;

//   return (
//     <div 
//       className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <div 
//         className="bg-white rounded-2xl w-full max-w-sm mx-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="px-6 py-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-900 text-center">Complete Payment</h2>
//           <p className="text-lg font-semibold text-gray-900 mt-2 text-center">
//             ₦{amount.toLocaleString()}
//           </p>
//         </div>

//         <div className="px-6 py-6">
//           <div className="mb-6">
//             <p className="text-sm text-gray-600 text-center mb-4">
//               Proceed to complete your payment for this accepted offer
//             </p>
            
//             <div className="bg-gray-50 rounded-lg p-4 mb-4">
//               <div className="flex justify-between text-sm mb-2">
//                 <span className="text-gray-600">Offer Amount</span>
//                 <span className="font-semibold">₦{amount.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Platform Fee</span>
//                 <span className="font-semibold">₦0</span>
//               </div>
//               <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-semibold">
//                 <span>Total</span>
//                 <span>₦{amount.toLocaleString()}</span>
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-3 text-gray-700 font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
//             >
//               Later
//             </button>
//             <button
//               onClick={onPay}
//               className="flex-1 px-4 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
//             >
//               Pay Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// Create Invoice Popup Component
function CreateInvoicePopup({ 
  isOpen, 
  onClose, 
  onSubmit,
  currentPrice,
  productName,
  productImage,
  loading = false
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (invoiceData: { 
    amount: number; 
    quantity: number;
    pricePerUnit: number;
    deliveryFee: number;
    description?: string 
  }) => void;
  currentPrice: number;
  productName?: string;
  productImage?: string;
  loading?: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState(currentPrice.toString());
  const [deliveryFee, setDeliveryFee] = useState('0');
  const [error, setError] = useState('');
  const commissionRate = 0.1;

  const calculateAmounts = () => {
    const price = parseFloat(pricePerUnit) || 0;
    const total = price * quantity;
    const commission = total * commissionRate;
    const delivery = parseFloat(deliveryFee) || 0;
    const youReceive = total - commission + delivery;
    
    return {
      total,
      commission,
      delivery,
      youReceive
    };
  };

  const amounts = calculateAmounts();

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  console.log('📋 Form values:', {
    pricePerUnit,
    quantity,
    deliveryFee
  });

  if (!pricePerUnit) {
    setError('Please enter a price per unit');
    return;
  }

  const price = parseFloat(pricePerUnit);
  console.log('💰 Parsed price:', price);
  
  if (isNaN(price) || price <= 0) {
    setError('Please enter a valid amount');
    return;
  }

  const delivery = parseFloat(deliveryFee) || 0;
  const subtotal = price * quantity;
  const totalAmount = subtotal + delivery;

  // Create description for display
  const description = `Quantity: ${quantity}, Price per unit: ₦${price.toLocaleString()}, Delivery: ₦${delivery.toLocaleString()}`;
  
  console.log('📝 Calculated values:', {
    quantity,
    price,
    delivery,
    subtotal,
    totalAmount
  });

  // Pass all values directly
  onSubmit({ 
    amount: totalAmount,
    quantity: quantity,
    pricePerUnit: price,
    deliveryFee: delivery,
    description: description
  });
};


  const handleCancel = () => {
    setQuantity(1);
    setPricePerUnit('');
    setDeliveryFee('0');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl w-full max-w-sm mx-auto absolute bottom-0 left-0 right-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Create invoice</h2>
          <button 
            onClick={handleCancel}
            className="text-pink-500 font-medium text-sm"
            disabled={loading}
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-6 max-h-[70vh] overflow-y-auto">
          {/* Product Info */}
          <div className="flex items-center gap-3 mb-6">
            {productImage ? (
              <img 
                src={productImage} 
                alt={productName || 'Product'}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {productName || 'Product'}
              </p>
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Quantity:
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={loading || quantity <= 1}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              >
                −
              </button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                disabled={loading}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Amount per unit */}
          <div className="mb-6">
  <label className="block text-sm font-medium text-gray-900 mb-3">
    Amount (per unit)
  </label>
  <div className="relative">
    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium">
      ₦
    </span>
    <input
      type="number"
      value={pricePerUnit}
      onChange={(e) => {
        setPricePerUnit(e.target.value);
        setError('');
      }}
      placeholder="0"
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      disabled={loading}
    />
  </div>
</div>

          {/* You will receive & Commission */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <label className="block text-xs text-gray-600 mb-2">
                You will receive
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-sm">
                  ₦
                </span>
                <input
                  type="text"
                  value={Math.round(amounts.youReceive).toLocaleString()}
                  readOnly
                  className="w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Commission: 10%
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-sm">
                  ₦
                </span>
                <input
                  type="text"
                  value={Math.round(amounts.commission).toLocaleString()}
                  readOnly
                  className="w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Delivery fee */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Delivery fee
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium">
                ₦
              </span>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={!pricePerUnit || loading}
            className="w-full px-4 py-3.5 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create invoice'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// Add this User Menu Popup Component (add before ChatDetailPage)
function UserMenuPopup({ 
  isOpen, 
  onClose,
  displayUser,
  onReportUser,
  onFollowUser,
  onViewProfile,
  onAppeal,
  onDelete
}: { 
  isOpen: boolean;
  onClose: () => void;
  displayUser?: User;
  onReportUser: () => void;
  onFollowUser: () => void;
  onViewProfile: () => void;
  onAppeal: () => void;
  onDelete: () => void;
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed top-16 right-4 z-50 bg-white rounded-2xl shadow-lg overflow-hidden w-64">
        {/* User Info */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            {displayUser?.profilePic ? (
              <img 
                src={displayUser.profilePic} 
                alt={`${displayUser.firstName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold">
                {displayUser?.firstName?.[0]}{displayUser?.lastName?.[0]}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {displayUser?.firstName} {displayUser?.lastName}
              </p>
              <p className="text-xs text-gray-500">User Profile</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <button
            onClick={() => {
              onReportUser();
              onClose();
            }}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-2v-2m0 0H9m3 0h3m-9-7.5V3a1.5 1.5 0 011.5-1.5h12A1.5 1.5 0 0121 3v12a1.5 1.5 0 01-1.5 1.5H4.5" />
            </svg>
            <span className="text-sm font-medium">Report user</span>
          </button>

          <button
            onClick={() => {
              onFollowUser();
              onClose();
            }}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm6-13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium">Follow user</span>
          </button>

          <button
            onClick={() => {
              onViewProfile();
              onClose();
            }}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm font-medium">View profile</span>
          </button>

          <button
            onClick={() => {
              onAppeal();
              onClose();
            }}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Appeal</span>
          </button>

          <div className="border-t border-gray-200 my-2"></div>

          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="text-sm font-medium">Delete</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default function ChatDetailPage() {
  // State and hooks
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isMakeOfferPopupOpen, setIsMakeOfferPopupOpen] = useState(false);
  const [isPaymentRequestPopupOpen, setIsPaymentRequestPopupOpen] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isDeclineOfferPopupOpen, setIsDeclineOfferPopupOpen] = useState(false);
const [selectedOfferToDecline, setSelectedOfferToDecline] = useState<Message | null>(null);
const [isCreateInvoicePopupOpen, setIsCreateInvoicePopupOpen] = useState(false);

  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const { user: currentUser, isAuthenticated, isLoading: authLoading, hasHydrated } = useAuthStore();
  useCheckAuth();

  const chatId = Array.isArray(params.chat) ? params.chat[0] : params.chat;

  const { 
    chat, 
    loading: chatLoading, 
    error: chatError 
  } = useChat(chatId || '');

  const { 
    data: messagesData,
    isLoading: messagesLoading, 
    error: messagesError 
  } = useChatMessages(chatId || '');

  const { 
    sendMessage, 
    loading: sendMessageLoading, 
    error: sendMessageError 
  } = useSendMessage();

  const loading = authLoading || chatLoading || messagesLoading;
  const error = chatError || messagesError;

  // Initialize messages from API
  useEffect(() => {
    if (messagesData?.data && messagesData.data.length > 0) {
      setLocalMessages(messagesData.data);
    } else if (messagesData && Array.isArray(messagesData)) {
      setLocalMessages(messagesData);
    }
  }, [messagesData]);

  // Socket setup
  // Socket setup - Update this section
useEffect(() => {
  if (!currentUser?._id) return;

  const socket = initSocket(currentUser._id);
  
  socket.on("newMessage", (message: Message) => {
    console.log('📨 Socket received new message:', {
      type: message.type,
      hasInvoice: !!message.invoice,
      invoiceData: message.invoice
    });
    
    setLocalMessages(prev => {
      const messageExists = prev.some(msg => msg._id === message._id);
      if (messageExists) return prev;
      
      // If it's an invoice message with missing data, we might need to check if we have
      // a temp message with the data
      if (message.type === 'invoice' && (!message.invoice || !message.invoice.items)) {
        console.log('⚠️ Invoice message from socket has missing data');
        
        // Check if we have a temp message with this ID
        const tempMessage = prev.find(msg => 
          msg.tempId && msg._id === `temp-${message._id}` || 
          (msg.sender._id === message.sender._id && 
           msg.type === 'invoice' && 
           Math.abs(new Date(msg.createdAt).getTime() - new Date(message.createdAt).getTime()) < 5000)
        );
        
        if (tempMessage?.invoice) {
          console.log('🔄 Merging temp invoice data with socket message');
          // Merge the temp invoice data with the socket message
          const mergedMessage = {
            ...message,
            invoice: tempMessage.invoice
          };
          return [...prev.filter(msg => msg.tempId !== tempMessage.tempId), mergedMessage];
        }
      }
      
      return [...prev, message];
    });
  });

  return () => {
    socket.off("newMessage");
  };
}, [queryClient, currentUser?._id, localMessages]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  // Handler functions
  const handleBack = () => {
    router.back();
  };

  const handleDeclineCounterOffer = () => {
  // When buyer declines the seller's counter-offer/best price
  alert('Offer declined. You can make a new offer if you wish.');
  // Optionally, you could open the Make Offer popup here
  // setIsMakeOfferPopupOpen(true);
};

const handleCreateInvoice = () => {
  setIsCreateInvoicePopupOpen(true);
};

const handlePayInvoice = async (invoiceMessage: Message) => {
  if (!chatId || !currentUser) return;

  const isBuyer = currentUser._id === chat?.buyer._id;
  if (!isBuyer) {
    alert('Only the buyer can pay invoices');
    return;
  }

  // Update invoice status optimistically - FIXED VERSION
  setLocalMessages(prev =>
    prev.map(msg => {
      if (msg._id !== invoiceMessage._id) return msg;
      
      // Create a safe updated invoice object
      const currentInvoice = msg.invoice;
      if (!currentInvoice) return msg;
      
      return {
        ...msg,
        invoice: {
          ...currentInvoice,
          amount: currentInvoice.amount || 0, // Ensure amount is always a number
          status: 'paid' as const
        }
      };
    })
  );

  try {
    // Send payment message
    const paymentMessage = await sendMessage({
      chatId,
      type: 'payment',
      text: 'Payment completed for invoice',
      payment: {
        amount: invoiceMessage.invoice?.amount || 0,
        invoiceId: invoiceMessage._id,
        status: 'completed'
      }
    });

    console.log('✅ Payment recorded:', paymentMessage._id);
    
    // You would integrate with actual payment gateway here
    alert('Redirecting to payment gateway...');
    
  } catch (error) {
    console.error('❌ Error processing payment:', error);
    // Revert optimistic update
    setLocalMessages(prev =>
      prev.map(msg => {
        if (msg._id !== invoiceMessage._id) return msg;
        
        const currentInvoice = msg.invoice;
        if (!currentInvoice) return msg;
        
        return {
          ...msg,
          invoice: {
            ...currentInvoice,
            amount: currentInvoice.amount || 0,
            status: 'pending' as const
          }
        };
      })
    );
    alert('Failed to process payment. Please try again.');
  }
};


const handleDeclineInvoice = async (invoiceMessage: Message) => {
  if (!chatId || !currentUser) return;

  const isBuyer = currentUser._id === chat?.buyer._id;
  if (!isBuyer) {
    alert('Only the buyer can decline invoices');
    return;
  }

  if (confirm('Are you sure you want to decline this invoice?')) {
    // Update invoice status optimistically - FIXED VERSION
    setLocalMessages(prev =>
      prev.map(msg => {
        if (msg._id !== invoiceMessage._id) return msg;
        
        const currentInvoice = msg.invoice;
        if (!currentInvoice) return msg;
        
        return {
          ...msg,
          invoice: {
            ...currentInvoice,
            amount: currentInvoice.amount || 0,
            status: 'cancelled' as const
          }
        };
      })
    );

    try {
      const declinedMessage = await sendMessage({
        chatId,
        type: 'text',
        text: `${currentUser.firstName} declined the invoice of ₦${invoiceMessage.invoice?.amount?.toLocaleString()}`
      });

      console.log('✅ Invoice declined notification sent');
      
    } catch (error) {
      console.error('❌ Error declining invoice:', error);
      // Revert optimistic update
      setLocalMessages(prev =>
        prev.map(msg => {
          if (msg._id !== invoiceMessage._id) return msg;
          
          const currentInvoice = msg.invoice;
          if (!currentInvoice) return msg;
          
          return {
            ...msg,
            invoice: {
              ...currentInvoice,
              amount: currentInvoice.amount || 0,
              status: 'pending' as const
            }
          };
        })
      );
      alert('Failed to decline invoice. Please try again.');
    }
  }
};


const handleAcceptCounterOffer = (offerMessage: Message) => {
  // When buyer accepts the seller's counter-offer/best price
  // This should proceed to payment
  setSelectedOffer(offerMessage);
  setIsPaymentRequestPopupOpen(true);
};

  const handleMakeOffer = () => {
    setIsMakeOfferPopupOpen(true);
  };

 // Fixed handleSubmitOffer - Messages show immediately
const handleSubmitOffer = async (offerData: { amount: number }) => {
  if (!chatId || !currentUser) return;

  if (!currentUser._id) {
  console.error('Current user ID is undefined');
  return;
}
  
  const tempOfferMessage: Message = {
    _id: `temp-offer-${Date.now()}`,
    tempId: `temp-offer-${Date.now()}`,
    chat: chatId,
    sender: {
      _id: currentUser._id!,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      profilePic: currentUser.avatar 
    },
    text: '',
    type: 'offer',
    offer: {
      amount: offerData.amount,
      status: 'sent',
      proposedBy: currentUser._id
    },
    readBy: [currentUser._id!],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Show message immediately
  setLocalMessages(prev => [...prev, tempOfferMessage]);
  setIsMakeOfferPopupOpen(false);

  try {
    const savedOffer = await sendMessage({
      chatId,
      type: 'offer',
      text: '',
      offer: {
        amount: offerData.amount,
        status: 'sent',
        proposedBy: currentUser._id
      }
    });
    
    console.log('✅ Offer saved to database:', savedOffer._id);
    
    // Replace temp message with actual saved message
    setLocalMessages(prev => 
      prev.map(msg => msg.tempId === tempOfferMessage.tempId ? savedOffer : msg)
    );
    
  } catch (error) {
    console.error('❌ Error sending offer:', error);
    // Remove failed message
    setLocalMessages(prev => prev.filter(msg => msg.tempId !== tempOfferMessage.tempId));
    alert('Failed to send offer. Please try again.');
  }
};

  useEffect(() => {
  if (messagesData) {
    console.log('📨 Fetched messages:', messagesData);
    
    // Check if offers are in the data
    const offerMessages = localMessages.filter(msg => msg.type === 'offer');
    console.log('💰 Offer messages found:', offerMessages.length);
    
    offerMessages.forEach(offer => {
      console.log('📊 Offer details:', {
        id: offer._id,
        amount: offer.offer?.amount,
        status: offer.offer?.status,
        sender: offer.sender.firstName,
        isFromSeller: offer.sender._id === chat?.seller._id
      });
    });
  }
}, [messagesData, localMessages, chat]);

const handleAcceptOffer = async (offerMessage: Message) => {
  if (!chatId || !currentUser) return;

  const isSeller = currentUser._id === chat?.seller._id;
  if (!isSeller) {
    alert('Only the seller can accept offers');
    return;
  }

  try {
    const acceptedOffer = await sendMessage({
      chatId,
      type: 'offer',  // ← Important: use 'offer-accepted' type
      text: `${currentUser.firstName} accepted your offer`,
      offer: {
        amount: offerMessage.offer?.amount || 0,
        status: 'accepted',
        proposedBy: offerMessage.sender._id,
        initialOfferMessageId: offerMessage._id
      }
    });

    alert('Offer accepted! Payment request has been sent to the buyer.');
  } catch (error) {
    console.error('Error accepting offer:', error);
    alert('Failed to accept offer. Please try again.');
  }
};

const handleDeclineOffer = async (offerMessage: Message) => {
  if (!chatId || !currentUser) return;

  const isSeller = currentUser._id === chat?.seller._id;
  if (!isSeller) {
    alert('Only the seller can decline offers');
    return;
  }

  // Just set the offer and open popup - NO API CALL HERE
  setSelectedOfferToDecline(offerMessage);
  setIsDeclineOfferPopupOpen(true);
};

const handleSubmitDeclineWithBestPrice = async (data: { bestPrice: number }) => {
  if (!chatId || !currentUser || !selectedOfferToDecline) return;

  // Create temp declined message immediately for optimistic UI
  const tempDeclineMessage: Message = {
    _id: `temp-decline-${Date.now()}`,
    tempId: `temp-decline-${Date.now()}`,
    chat: chatId,
    sender: {
      _id: currentUser._id!,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      profilePic: currentUser.avatar 
    },
    text: '',
    type: 'offer',
    offer: {
      amount: selectedOfferToDecline.offer?.amount || 0,
      status: 'declined',
      proposedBy: selectedOfferToDecline.sender._id,
      initialOfferMessageId: selectedOfferToDecline._id,
      bestPrice: data.bestPrice
    },
    readBy: [currentUser._id!],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Optimistically update UI - show declined message immediately
  setLocalMessages(prev => [...prev, tempDeclineMessage]);
  
  // Close popup
  setIsDeclineOfferPopupOpen(false);
  
  // Clear the selected offer
  const offerToDecline = selectedOfferToDecline;
  setSelectedOfferToDecline(null);

  try {
    // Send the actual decline message to server
    const declinedOffer = await sendMessage({
      chatId,
      type: 'offer',
      text: `${currentUser.firstName} declined your offer`,
      offer: {
        amount: offerToDecline.offer?.amount || 0,
        status: 'declined',
        proposedBy: offerToDecline.sender._id,
        initialOfferMessageId: offerToDecline._id,
        bestPrice: data.bestPrice
      } as any // Add type assertion to fix TypeScript error
    });

    // Replace temp message with actual server response
    setLocalMessages(prev =>
      prev.map(msg =>
        msg.tempId === tempDeclineMessage.tempId ? declinedOffer : msg
      )
    );

    console.log('✅ Offer declined with best price sent');
  } catch (error) {
    console.error('❌ Error declining offer:', error);
    
    // Revert optimistic update on error
    setLocalMessages(prev =>
      prev.filter(msg => msg.tempId !== tempDeclineMessage.tempId)
    );
    
    // Re-select the offer and reopen popup for retry
    setSelectedOfferToDecline(offerToDecline);
    setIsDeclineOfferPopupOpen(true);
    alert('Failed to decline offer. Please try again.');
  }
};

  const handleCreatePaymentRequest = async (offerMessage: Message) => {
    if (!chatId || !currentUser) return;

    try {
      const paymentRequest = await sendMessage({
        chatId,
        type: 'payment-request',
        text: '',
        offer: {
          amount: offerMessage.offer?.amount || 0,
          status: 'accepted',
          proposedBy: offerMessage.sender._id
        }
      });

      console.log('✅ Payment request created:', paymentRequest._id);

    } catch (error) {
      console.error('❌ Error creating payment request:', error);
    }
  };

  const handlePayNow = (offerMessage: Message) => {
    setSelectedOffer(offerMessage);
    setIsPaymentRequestPopupOpen(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedOffer) return;

    console.log('💳 Processing payment for offer:', selectedOffer.offer?.amount);
    
    // Here you would integrate with your payment gateway
    // For now, we'll just close the popup and show a success message
    setIsPaymentRequestPopupOpen(false);
    
    // Simulate payment processing
    setTimeout(() => {
      alert('Payment processed successfully!');
    }, 2000);
  };

  const handleSendMessage = async () => {
  if (!message.trim() || !chatId || !currentUser) return;

  const messageText = message.trim();
  
  const tempMessage: Message = {
    _id: `temp-${Date.now()}`,
    tempId: `temp-${Date.now()}`,
    chat: chatId,
    sender: {
      _id: currentUser._id!,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      profilePic: currentUser.avatar
    },
    text: messageText,
    type: 'text',
    readBy: [currentUser._id!],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Show message immediately
  setLocalMessages(prev => [...prev, tempMessage]);
  setMessage('');

  try {
    const savedMessage = await sendMessage({
      chatId,
      type: 'text',
      text: messageText
    });
    
    // Replace temp message with actual saved message
    setLocalMessages(prev => 
      prev.map(msg => msg.tempId === tempMessage.tempId ? savedMessage : msg)
    );
  } catch (error) {
    console.error('❌ Error sending message:', error);
    // Remove failed message
    setLocalMessages(prev => prev.filter(msg => msg.tempId !== tempMessage.tempId));
    setMessage(messageText); // Restore message for retry
    alert('Failed to send message. Please try again.');
  }
};

const handleSubmitInvoice = async (invoiceData: { 
  amount: number; 
  quantity: number;
  pricePerUnit: number;
  deliveryFee: number;
  description?: string 
}) => {
  console.log('🔍 handleSubmitInvoice RECEIVED FULL DATA:', invoiceData);
  
  if (!chatId || !currentUser || !currentUser._id) { // ← Add check for currentUser._id
    console.log('❌ Missing chatId or currentUser or currentUser._id');
    return;
  }

  const isSeller = currentUser._id === chat?.seller._id;
  if (!isSeller) {
    console.log('❌ Only seller can create invoices');
    alert('Only the seller can create invoices');
    return;
  }

  // Use values directly from invoiceData
  const quantity = invoiceData.quantity;
  const price = invoiceData.pricePerUnit;
  const delivery = invoiceData.deliveryFee;
  const subtotal = price * quantity;
  const commission = subtotal * 0.1;
  const youReceive = subtotal - commission + delivery;

  console.log('📊 Invoice values:', {
    quantity,
    price,
    delivery,
    subtotal,
    commission,
    youReceive,
    total: invoiceData.amount
  });

  const tempInvoiceMessage: Message = {
    _id: `temp-invoice-${Date.now()}`,
    tempId: `temp-invoice-${Date.now()}`,
    chat: chatId,
    sender: {
      _id: currentUser._id!, // ← Now TypeScript knows this is not undefined
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      profilePic: currentUser.avatar 
    },
    text: invoiceData.description || '',
    type: 'invoice',
    invoice: {
      amount: invoiceData.amount,
      description: invoiceData.description,
      status: 'pending',
      currency: 'NGN',
      subtotal: subtotal,
      deliveryFee: delivery,
      commission: commission,
      youReceive: youReceive,
      items: [{
        name: chat?.product?.name || 'Product',
        quantity: quantity,
        price: price
      }]
    },
    readBy: [currentUser._id!],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  console.log('💬 Temp invoice created:', tempInvoiceMessage);

  // Show message immediately (optimistic UI)
  setLocalMessages(prev => [...prev, tempInvoiceMessage]);

  try {
    const savedInvoice = await sendMessage({
      chatId,
      type: 'invoice',
      text: invoiceData.description || '',
      invoice: {
        amount: invoiceData.amount,
        description: invoiceData.description,
        status: 'pending',
        currency: 'NGN',
        subtotal: subtotal,
        deliveryFee: delivery,
        commission: commission,
        youReceive: youReceive,
        items: [{
          name: chat?.product?.name || 'Product',
          quantity: quantity,
          price: price
        }]
      } as any // Add type assertion
    });
    
    console.log('📡 Raw server response:', JSON.stringify(savedInvoice, null, 2));
    console.log('🔍 Checking invoice property:', savedInvoice?.invoice);
    console.log('🔍 Checking for invoice data in response:', {
      hasInvoice: !!savedInvoice?.invoice,
      invoiceKeys: savedInvoice?.invoice ? Object.keys(savedInvoice.invoice) : [],
      invoiceAmount: savedInvoice?.invoice?.amount,
      invoiceDescription: savedInvoice?.invoice?.description,
      invoiceItems: savedInvoice?.invoice?.items,
      invoiceSubtotal: savedInvoice?.invoice?.subtotal
    });
    
    // Create a COMPLETE invoice message with ALL data
    const completeInvoiceMessage: Message = {
      // Use server ID and timestamps
      _id: savedInvoice._id || tempInvoiceMessage._id,
      chatId: savedInvoice.chatId || chatId,
      chat: savedInvoice.chat || chatId,
      sender: {
        _id: currentUser._id!,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        profilePic: currentUser.avatar
      },
      text: invoiceData.description || '',
      type: 'invoice',
      invoice: {
        amount: invoiceData.amount,
        description: invoiceData.description,
        status: 'pending',
        currency: 'NGN',
        subtotal: subtotal,
        deliveryFee: delivery,
        commission: commission,
        youReceive: youReceive,
        items: [{
          name: chat?.product?.name || 'Product',
          quantity: quantity,
          price: price
        }]
      },
      readBy: [currentUser._id!],
      createdAt: savedInvoice.createdAt || new Date().toISOString(),
      updatedAt: savedInvoice.updatedAt || new Date().toISOString()
    };
    
    console.log('🎯 COMPLETE invoice message for display:', completeInvoiceMessage);
    
    // Replace temp message with complete invoice message
    setLocalMessages(prev => 
      prev.map(msg => msg.tempId === tempInvoiceMessage.tempId ? completeInvoiceMessage : msg)
    );
    
    // Also, for socket updates, update the messages array directly
    // This ensures when the buyer receives the message via socket, it has all data
    setTimeout(() => {
      setLocalMessages(prev => 
        prev.map(msg => 
          msg._id === savedInvoice._id ? completeInvoiceMessage : msg
        )
      );
    }, 100);
    
    // Close popup AFTER successful API call
    setIsCreateInvoicePopupOpen(false);
    
  } catch (error) {
    console.error('❌ Error creating invoice:', error);
    
    // Remove failed temp message
    setLocalMessages(prev => prev.filter(msg => msg.tempId !== tempInvoiceMessage.tempId));
    
    // Show error to user
    alert('Failed to create invoice. Please try again.');
    
    // Keep popup open so user can retry
  }
};


// In InvoiceMessage component, add this parsing logic:
const parseInvoiceDetails = (description: string) => {
  const quantityMatch = description.match(/Quantity: (\d+)/);
  const priceMatch = description.match(/Price per unit: ₦([\d,]+)/);
  const deliveryMatch = description.match(/Delivery: ₦([\d,]+)/);
  
  const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
  const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
  const delivery = deliveryMatch ? parseFloat(deliveryMatch[1].replace(/,/g, '')) : 0;
  const subtotal = price * quantity;
  const commission = subtotal * 0.1; // 10% commission
  const youReceive = subtotal - commission + delivery;
  
  return {
    quantity,
    price,
    delivery,
    subtotal,
    commission,
    youReceive
  };
};


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (user: User) => {
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  const isBuyer = currentUser?._id === chat?.buyer._id;
  const displayUser = isBuyer ? chat?.seller : chat?.buyer;
  const userRole = isBuyer ? 'Seller' : 'Buyer';

  // Group messages by date for display
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(localMessages);

  // Conditional returns
  if (!hasHydrated || authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading chat...</div>;
  }

  if (error || !chat) {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="text-lg text-red-500 mb-4">
        {typeof error === 'string' ? error : error?.message || 'Chat not found'}
      </div>
      <button onClick={() => router.push('/dashboard/message')} className="px-4 py-2 bg-blue-500 text-white rounded">
        Back to Messages
      </button>
    </div>
  );
}

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      
<div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
  <div className="flex items-center gap-3">
    <button onClick={handleBack} className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    {displayUser?.profilePic ? (
      <img src={displayUser.profilePic} alt={`${displayUser.firstName} ${displayUser.lastName}`} className="w-10 h-10 rounded-full object-cover" />
    ) : (
      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-sm font-semibold">
        {displayUser ? getInitials(displayUser) : 'U'}
      </div>
    )}

    <div>
      <h1 className="text-lg font-semibold text-gray-900">
        {displayUser?.firstName} {displayUser?.lastName}
      </h1>
      <p className="text-sm text-gray-500">{userRole}</p>
    </div>
  </div>

  <div className="flex items-center gap-2">
    
    
    {/* Menu Button */}
    <button 
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
    >
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
    </button>
  </div>

  {/* User Menu Popup */}
  <UserMenuPopup
    isOpen={isMenuOpen}
    onClose={() => setIsMenuOpen(false)}
    displayUser={displayUser}
    onReportUser={() => {
      console.log('Report user clicked');
      alert('Report user functionality');
    }}
    onFollowUser={() => {
      console.log('Follow user clicked');
      alert('Follow user functionality');
    }}
    onViewProfile={() => {
      console.log('View profile clicked');
      router.push(`/profile/${displayUser?._id}`);
    }}
    onAppeal={() => {
      console.log('Appeal clicked');
      alert('Appeal functionality');
    }}
    onDelete={() => {
      console.log('Delete clicked');
      alert('Delete functionality');
    }}
  />
</div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
  {/* Product Card with Details */}
  {chat.product && (
  <div className="mb-6 w-full bg-white border-gray-200">
    {/* Seller Info Header */}
    {/* <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
          {chat.seller.firstName?.[0]}{chat.seller.lastName?.[0]}
        </div>
        <span className="font-semibold text-gray-900 text-sm">
          {chat.seller.firstName} {chat.seller.lastName}
        </span>
      </div>
    </div> */}

    {/* Product Details */}
    <div className='flex flex-row items-center justify-between'>
  <div className="flex items-start gap-3 flex-1">
    {chat.product.images && chat.product.images.length > 0 ? (
      <img 
        src={chat.product.images[0]} 
        alt={chat.product.name} 
        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
      />
    ) : (
      <div className="w-16 h-16 rounded-lg bg-orange-200 flex items-center justify-center flex-shrink-0">
        <div className="w-8 h-10 bg-orange-500 rounded" />
      </div>
    )}
    
    <div className="flex-1 min-w-0">
      {/* Product name with ellipsis */}
      <h3 className="text-sm text-gray-600 line-clamp-2 mb-1">
        {chat.product.name.length > 10 
          ? chat.product.name.substring(0, 10) + '....' 
          : chat.product.name}
      </h3>
      {/* Price */}
      <p className="text-[15px] font-bold text-gray-900">
        ₦{chat.product.price.toLocaleString()}
      </p>
    </div>
  </div>

  {/* Action Buttons - Now properly inside the flex container */}
  {/* Action Buttons - Different for buyer vs seller */}
<div className="flex items-center gap-3 ml-4 flex-shrink-0">
  <button
    onClick={() => router.push(`/product/${chat.product._id}`)}
    className="px-3 py-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors text-[9px] whitespace-nowrap"
  >
    View product details
  </button>
  
  {/* Show "Make an offer" for buyers, "Create invoice" for sellers */}
  {isBuyer ? (
    <button
      onClick={handleMakeOffer}
      className="px-3 py-2 bg-[#3652AD] text-white rounded-full hover:bg-blue-700 transition-colors text-[9px] whitespace-nowrap"
    >
      Make an offer
    </button>
  ) : (
    <button
      onClick={handleCreateInvoice}
      className="px-3 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors text-[9px] whitespace-nowrap"
    >
      Create invoice
    </button>
  )}
</div>
</div>
  </div>
  )}

  {/* Chat Messages */}
  <div className="space-y-6">
    {Object.entries(messageGroups).map(([date, messages]) => (
      <div key={date}>
        {/* Date separator */}
        <div className="flex justify-center my-4">
          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-500">
            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
        
        {/* Messages for this date */}
        <div className="space-y-4">
      {messages.map((msg) => {
  const isTempMessage = msg.tempId && (msg._id.startsWith('temp-') || msg._id.startsWith('temp-offer-'));
  
  return (
    <div key={msg._id} className={`${isTempMessage ? 'opacity-60' : 'opacity-100'}`}>
      {/* OFFER MESSAGES - Check status to determine which component to show */}
      {msg.type === 'invoice' && (
          <InvoiceMessage 
          message={msg}
          currentUserId={currentUser?._id || ''}
          chat={chat}
          onPayInvoice={handlePayInvoice}
          onDeclineInvoice={handleDeclineInvoice}
        />
        )}

      {msg.type === 'offer' && msg.offer?.status === 'sent' && (
        <OfferSentMessage 
          message={msg}
          currentUserId={currentUser?._id || ''}
          chat={chat}
          onAcceptOffer={handleAcceptOffer}
          onDeclineOffer={handleDeclineOffer}
        />
      )}
      
      {msg.type === 'offer' && msg.offer?.status === 'accepted' && (
        <AcceptedOfferMessage 
          message={msg}
          currentUserId={currentUser?._id || ''}
          chat={chat}
          onPayNow={handlePayNow}
        />
      )}
      
      {/* DECLINED OFFER - Only render once with buttons */}
      {msg.type === 'offer' && msg.offer?.status === 'declined' && (
        <DeclinedOfferMessage 
          message={msg}
          currentUserId={currentUser?._id || ''}
          chat={chat}
          onDecline={handleDeclineCounterOffer}
          onAcceptAndPay={handleAcceptCounterOffer}
        />
      )}
      
      {/* OTHER MESSAGE TYPES */}
      {msg.type === 'payment-request' && (
        <PaymentRequestMessage 
          message={msg}
          currentUserId={currentUser?._id || ''}
        />
      )}
      
      {msg.type === 'text' && (
        <RegularMessage 
          message={msg}
          currentUserId={currentUser?._id || ''}
        />
      )}
      {msg.type === 'counter-declined' && (
      <BuyerDeclinedCounterMessage 
        message={msg}
        currentUserId={currentUser?._id || ''}
        chat={chat}
      />
    )}
    </div>
  );
})}
        </div>
      </div>
    ))}
    <div ref={messagesEndRef} />
  </div>
</div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full text-black placeholder-gray-500 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sendMessageLoading}
            />
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>

      {/* Popups */}
      <MakeOfferPopup
        isOpen={isMakeOfferPopupOpen}
        onClose={() => setIsMakeOfferPopupOpen(false)}
        onSubmit={handleSubmitOffer}
        currentPrice={chat.product?.price || 0}
        loading={sendMessageLoading}
      />

    <DeclineOfferPopup
  isOpen={isDeclineOfferPopupOpen}
  onClose={() => {
    setIsDeclineOfferPopupOpen(false);
    setSelectedOfferToDecline(null); // Clear the selected offer when popup closes
  }}
  onSubmit={handleSubmitDeclineWithBestPrice}
  offerAmount={selectedOfferToDecline?.offer?.amount || 0}
  currentPrice={chat.product?.price || 0}
  loading={sendMessageLoading}
/>

      {/* <PaymentRequestPopup
        isOpen={isPaymentRequestPopupOpen}
        onClose={() => setIsPaymentRequestPopupOpen(false)}
        onPay={handleProcessPayment}
        amount={selectedOffer?.offer?.amount || 0}
      /> */}

  <CreateInvoicePopup
  isOpen={isCreateInvoicePopupOpen}
  onClose={() => setIsCreateInvoicePopupOpen(false)}
  onSubmit={(data) => handleSubmitInvoice(data)}
  currentPrice={chat.product?.price || 0}
  productName={chat.product?.name}
  productImage={chat.product?.images?.[0]}
  loading={sendMessageLoading}
/>
    </div>
  );
}