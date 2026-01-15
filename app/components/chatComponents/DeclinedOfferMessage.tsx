import React from 'react';
import { MessageComponentProps } from '@/app/types/types';

export default function DeclinedOfferMessage({ 
  message, 
  currentUserId,
  chat,
  onDecline,
  onAcceptAndPay
}: MessageComponentProps) {
  const isSeller = chat && currentUserId === chat.seller._id;
  const sellerName = chat?.seller.firstName || 'Seller';

  
if (isSeller) {
    const buyerName = chat?.buyer?.firstName || 'Buyer';
    
    return (
      <div className="flex justify-end gap-3">
        <div className="flex flex-col space-y-1 items-end max-w-xs">
          <div className="rounded-2xl p-3 bg-[#FEE2E2]">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-[#DC2626] flex items-center justify-center flex-shrink-0">
                <img src='/x.png' width={14} height={14} alt="declined"/>
              </div>
              <div className="flex-1">
                <p className="text-sm text-black font-normal mb-1">
                  You declined {buyerName}'s offer
                </p>
                {message.offer?.bestPrice && (
                  <p className="text-sm text-black font-normal">
                    Best price: <span className="font-semibold">₦{message.offer.bestPrice.toLocaleString()}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
            </svg>
            <svg className="w-4 h-4 text-gray-400 -ml-2" viewBox="0 0 24 24" fill="none">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
            </svg>
            <p className="text-xs text-gray-500 ml-1">
              {(() => {
                const msgDate = new Date(message.createdAt);
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                
                const isToday = msgDate.toDateString() === today.toDateString();
                const isYesterday = msgDate.toDateString() === yesterday.toDateString();
                
                let dateStr = '';
                if (isToday) {
                  dateStr = 'Today';
                } else if (isYesterday) {
                  dateStr = 'Yesterday';
                } else {
                  dateStr = msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
                
                const timeStr = msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return `${dateStr} ${timeStr}`;
              })()}
            </p>
          </div>
        </div>
      </div>
    );
  }


  // If current user is the buyer (the one whose offer was declined)
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
        <div className="rounded-2xl p-4 w-full bg-[#FEE2E2] border border-[#FCA5A5]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-[#DC2626] flex items-center justify-center flex-shrink-0">
              <img src='/x.png' width={14} height={14}/>
            </div>
            <div className="flex flex-col">
            <div className="flex-1">
              <p className="text-sm text-black">
                {sellerName} declined your offer
              </p>
            </div>
            {message.offer?.bestPrice && (
            <div className="rounded-lg">
              <p>
                <span className="text-[16px] text-black">
                  Best price: <span className='font-bold'>₦{message.offer.bestPrice.toLocaleString()}</span>
                </span>
              </p>
            </div>
            
          )}
          </div>
          </div>

          {onDecline && onAcceptAndPay && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={onDecline}
                className="flex-1 px-4 py-2 text-[#DC2626] font-medium bg-[#CE24241A] border border-[#DC2626] rounded-full hover:bg-red-50 transition-colors text-xs"
              >
                Decline
              </button>
              <button
                onClick={() => onAcceptAndPay && onAcceptAndPay(message)}
                className="flex-1 px-4 py-2 bg-[#CE24241A] text-[#DC2626] font-medium rounded-full transition-colors text-xs border-[#DC2626] border"
              >
                Accept & pay
              </button>
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-500 ml-1">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}