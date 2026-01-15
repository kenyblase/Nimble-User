import React from 'react';
import { MessageComponentProps } from '@/app/types/types';

export default function BuyerDeclinedCounterMessage({ 
  message, 
  currentUserId,
  chat
}: MessageComponentProps) {
  const isBuyer = chat && currentUserId === chat.buyer._id;
  const sellerName = chat?.seller.firstName || 'Seller';
  const buyerName = chat?.buyer.firstName || 'Buyer';

  if (isBuyer) {
    return (
      <div className="flex flex-col space-y-2 items-end">
        <div className="rounded-2xl p-4 max-w-xs bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-black font-medium">
                You declined {sellerName}'s offer
              </p>
              <span className="text-sm font-bold text-black">
                ₦{message.offer?.bestPrice?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      {chat?.buyer.profilePic ? (
        <img 
          src={chat.buyer.profilePic} 
          alt={buyerName}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          {chat?.buyer.firstName?.[0]}{chat?.buyer.lastName?.[0]}
        </div>
      )}

      <div className="flex flex-col space-y-1 flex-1">
        <div className="rounded-2xl p-4 w-[70%] bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-black font-medium">
                {buyerName} declined your offer
              </p>
              <span className="text-sm font-bold text-black">
                ₦{message.offer?.bestPrice?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 ml-1">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}