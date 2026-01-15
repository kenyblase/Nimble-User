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

// Define Message interface
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
  type: 'text' | 'invoice' | 'payment' | 'offer' | 'extra-charge' | 'offer-accepted' | 'payment-request';
  text?: string;
  offer?: {
    amount: number;
    status: 'sent' | 'accepted' | 'declined';
    proposedBy: string;
    bestPrice?: number;
  };
  invoice?: any;
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

// Make Offer Popup Component - Updated Design
function MakeOfferPopup({ 
  isOpen, 
  onClose, 
  onSubmit,
  currentPrice 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (offerData: { amount: number }) => void;
  currentPrice: number;
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
    onClose();
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
              className="flex-1 px-4 py-3 text-gray-700 font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!offerAmount}
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Send Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Payment Request Component
function PaymentRequestPopup({ 
  isOpen, 
  onClose, 
  onPay,
  amount 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onPay: () => void;
  amount: number;
}) {
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
          <h2 className="text-xl font-bold text-gray-900 text-center">Complete Payment</h2>
          <p className="text-lg font-semibold text-gray-900 mt-2 text-center">
            ₦{amount.toLocaleString()}
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600 text-center mb-4">
              Proceed to complete your payment for this accepted offer
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Offer Amount</span>
                <span className="font-semibold">₦{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-semibold">₦0</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>₦{amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Later
            </button>
            <button
              onClick={onPay}
              className="flex-1 px-4 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Offer Sent Message Component
function OfferSentMessage({ 
  message, 
  currentUserId,
  onAcceptOffer 
}: { 
  message: Message; 
  currentUserId: string;
  onAcceptOffer?: (message: Message) => void;
}) {
  const isUserMessage = message.sender._id === currentUserId;
  const isAccepted = message.offer?.status === 'accepted';

  if (isUserMessage) {
    return (
      <div className="flex flex-col space-y-2 items-end">
        <div className="rounded-2xl p-4 max-w-xs bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 font-medium">You sent an offer</p>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900">
              ₦{message.offer?.amount?.toLocaleString()}
            </span>
          </div>

          {isAccepted && (
            <div className="mt-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-xs font-medium">
              Offer Accepted
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    );
  }

  // Other user's offer - show accept button if not accepted
  return (
    <div className="flex flex-col space-y-2 items-start">
      <div className="rounded-2xl p-4 max-w-xs bg-gray-50 border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 font-medium">
            {message.sender.firstName} sent an offer
          </p>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ₦{message.offer?.amount?.toLocaleString()}
          </span>
        </div>

        {!isAccepted && onAcceptOffer && (
          <button
            onClick={() => onAcceptOffer(message)}
            className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Accept Offer
          </button>
        )}

        {isAccepted && (
          <div className="mt-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-xs font-medium">
            You accepted this offer
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}

// Offer Accepted Message Component
function OfferAcceptedMessage({ 
  message, 
  currentUserId,
  onPayNow 
}: { 
  message: Message; 
  currentUserId: string;
  onPayNow?: (message: Message) => void;
}) {
  const isUserAccepted = message.sender._id === currentUserId;

  return (
    <div className="flex flex-col space-y-2 items-center">
      <div className="rounded-2xl p-4 max-w-xs bg-green-50 border border-green-200 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-green-800 font-medium">
            {isUserAccepted ? 'You accepted the offer' : `${message.sender.firstName} accepted your offer`}
          </p>
        </div>
        
        <div className="mb-3">
          <span className="text-lg font-bold text-gray-900">
            ₦{message.offer?.amount?.toLocaleString()}
          </span>
        </div>

        {!isUserAccepted && onPayNow && (
          <button
            onClick={() => onPayNow(message)}
            className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Pay Now
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}

// Payment Request Message Component
function PaymentRequestMessage({ 
  message, 
  currentUserId 
}: { 
  message: Message; 
  currentUserId: string;
}) {
  return (
    <div className="flex flex-col space-y-2 items-center">
      <div className="rounded-2xl p-4 max-w-xs bg-blue-50 border border-blue-200 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-blue-800 font-medium">Your mode of payment</p>
        </div>
        
        <div className="mb-4">
          <span className="text-xl font-bold text-gray-900">
            ₦{message.offer?.amount?.toLocaleString()}
          </span>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Payment processing...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}

// Regular Message Component
function RegularMessage({ 
  message, 
  currentUserId 
}: { 
  message: Message; 
  currentUserId: string;
}) {
  const isUserMessage = message.sender._id === currentUserId;
  const isAdminMessage = message.isFromAdmin;

  return (
    <div className={`flex flex-col space-y-2 ${isUserMessage ? 'items-end' : 'items-start'}`}>
      <div className={`rounded-2xl p-3 max-w-xs ${
        isUserMessage ? 'bg-blue-600 text-white' : 
        isAdminMessage ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-900'
      }`}>
        {!isUserMessage && (
          <p className={`text-xs font-medium mb-1 ${
            isAdminMessage ? 'text-purple-200' : 'text-gray-600'
          }`}>
            {message.sender.firstName} {message.sender.lastName}
            {isAdminMessage && ' (Admin)'}
          </p>
        )}
        <p className="text-sm leading-relaxed">
          {message.text}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-gray-500">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
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
  useEffect(() => {
    if (!currentUser?._id) return;

    const socket = initSocket(currentUser._id);
    
    socket.on("newMessage", (message: Message) => {
      setLocalMessages(prev => {
        const messageExists = prev.some(msg => msg._id === message._id);
        if (messageExists) return prev;
        return [...prev, message];
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, [queryClient, currentUser?._id]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  // Handler functions
  const handleBack = () => {
    router.back();
  };

  const handleMakeOffer = () => {
    setIsMakeOfferPopupOpen(true);
  };

  const handleSubmitOffer = async (offerData: { amount: number }) => {
    if (!chatId || !currentUser) return;
    
    const tempOfferMessage: Message = {
      _id: `temp-offer-${Date.now()}`,
      tempId: `temp-offer-${Date.now()}`,
      chat: chatId,
      sender: {
        _id: currentUser._id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        profilePic: currentUser.profilePic
      },
      text: '',
      type: 'offer',
      offer: {
        amount: offerData.amount,
        status: 'sent',
        proposedBy: currentUser._id
      },
      readBy: [currentUser._id],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setLocalMessages(prev => [...prev, tempOfferMessage]);

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
      
    } catch (error) {
      console.error('❌ Error sending offer:', error);
      setLocalMessages(prev => prev.filter(msg => msg.tempId !== tempOfferMessage.tempId));
      alert('Failed to send offer. Please try again.');
    }
  };

  const handleAcceptOffer = async (offerMessage: Message) => {
    if (!chatId || !currentUser) return;

    try {
      // Update the offer status to accepted
      const acceptedOffer = await sendMessage({
        chatId,
        type: 'offer-accepted',
        text: '',
        offer: {
          amount: offerMessage.offer?.amount || 0,
          status: 'accepted',
          proposedBy: offerMessage.sender._id
        }
      });

      console.log('✅ Offer accepted:', acceptedOffer._id);

      // Automatically create payment request after accepting
      setTimeout(() => {
        handleCreatePaymentRequest(offerMessage);
      }, 1000);

    } catch (error) {
      console.error('❌ Error accepting offer:', error);
      alert('Failed to accept offer. Please try again.');
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
        _id: currentUser._id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        profilePic: currentUser.profilePic
      },
      text: messageText,
      type: 'text',
      readBy: [currentUser._id],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setLocalMessages(prev => [...prev, tempMessage]);
    setMessage('');

    try {
      await sendMessage({
        chatId,
        type: 'text',
        text: messageText
      });
    } catch (error) {
      console.error('❌ Error sending message:', error);
      setLocalMessages(prev => prev.filter(msg => msg.tempId !== tempMessage.tempId));
      setMessage(messageText);
    }
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
    router.push('/auth/login');
    return null;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading chat...</div>;
  }

  if (error || !chat) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="text-lg text-red-500 mb-4">{error?.message || 'Chat not found'}</div>
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
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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

        <button onClick={handleMakeOffer} className="px-6 py-2 bg-blue-600 text-white font-medium text-sm rounded-full hover:bg-blue-700 transition-colors">
          Make an offer
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Product Card */}
        {chat.product && (
          <div className="mb-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              {chat.product.images && chat.product.images.length > 0 ? (
                <img src={chat.product.images[0]} alt={chat.product.name} className="w-14 h-14 rounded-lg object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-orange-200 flex items-center justify-center">
                  <div className="w-8 h-10 bg-orange-500 rounded" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">{chat.product.name}</p>
                <p className="text-lg font-bold text-gray-900">₦{chat.product.price.toLocaleString()}</p>
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
                      {msg.type === 'offer' && (
                        <OfferSentMessage 
                          message={msg}
                          currentUserId={currentUser?._id || ''}
                          onAcceptOffer={handleAcceptOffer}
                        />
                      )}
                      {msg.type === 'offer-accepted' && (
                        <OfferAcceptedMessage 
                          message={msg}
                          currentUserId={currentUser?._id || ''}
                          onPayNow={handlePayNow}
                        />
                      )}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      />

      <PaymentRequestPopup
        isOpen={isPaymentRequestPopupOpen}
        onClose={() => setIsPaymentRequestPopupOpen(false)}
        onPay={handleProcessPayment}
        amount={selectedOffer?.offer?.amount || 0}
      />
    </div>
  );
}