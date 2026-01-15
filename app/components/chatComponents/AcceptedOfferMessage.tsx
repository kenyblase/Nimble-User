import React from 'react';
import { MessageComponentProps } from '@/app/types/types';

export default function AcceptedOfferMessage({ 
  message, 
  currentUserId,
  chat,
  onPayNow 
}: MessageComponentProps) {
  const isSeller = chat && currentUserId === chat.seller._id;
  const sellerName = chat?.seller.firstName || 'Seller';
  const capitalized = sellerName.charAt(0).toUpperCase() + sellerName.slice(1);

  if (isSeller) {
    return (
      <div className="flex justify-end gap-3">
        <div className="flex flex-col space-y-2 items-end max-w-xs">
          <div className="rounded-2xl p-4 bg-green-50 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-700 font-medium">You accepted the offer</p>
            </div>
            
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-1">Agreed Price</p>
              <span className="text-2xl font-bold text-green-700">
                ₦{message.offer?.amount?.toLocaleString()}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        
        {/* User's profile picture for own messages */}
        <div className="flex-shrink-0">
          {chat?.seller.profilePic ? (
            <img 
              src={chat.seller.profilePic} 
              alt="You"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold">
              {chat?.seller.firstName?.[0]}{chat?.seller.lastName?.[0]}
            </div>
          )}
        </div>
      </div>
    );
  }

  // If current user is the buyer (the one whose offer was accepted)
  return (
    <div className="flex gap-3">
      {/* Seller Avatar */}
      <div className="flex-shrink-0">
        {chat?.seller.profilePic ? (
          <img 
            src={chat.seller.profilePic} 
            alt={sellerName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold">
            {chat?.seller.firstName?.[0]}{chat?.seller.lastName?.[0]}
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex flex-col space-y-1 flex-1">
        <div className="rounded-2xl p-4 max-w-xs bg-[#48AD361A] border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-[#48AD36] flex items-center justify-center flex-shrink-0">
              <img src='/accepted.png' width={14} height={14}/>
            </div>
            <div>
              <p className="text-[11px] text-black">
                {capitalized} accepted your offer!
              </p>
              <span className="text-sm font-bold text-black">
                ₦{message.offer?.amount?.toLocaleString()}
              </span>
            </div>
          </div>

          {onPayNow && (
            <button
              onClick={() => onPayNow(message)}
              className="w-full px-4 py-2 border-[#48AD36B2] border text-[#48AD36B2] font-medium rounded-[100px] hover:bg-green-700 transition-colors text-sm mb-3"
            >
              Pay Now
            </button>
          )}
        </div>
        
        <p className="text-xs text-gray-500 ml-1">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}