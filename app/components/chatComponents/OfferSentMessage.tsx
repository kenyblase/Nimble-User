import React from 'react';
import { useAuthStore } from '@/app/lib/stores/useAuthStore';
import { useCheckAuth } from '@/app/lib/hooks/useAuthApis/useCheckAuth';
import { MessageComponentProps } from '@/app/types/types';

export default function OfferSentMessage({ 
  message, 
  currentUserId,
  chat,
  onAcceptOffer,
  onDeclineOffer 
}: MessageComponentProps) {
  const isUserMessage = message.sender._id === currentUserId;
  const isAccepted = message.offer?.status === 'accepted';
  const isDeclined = message.offer?.status === 'declined';
  
  const isSeller = chat && currentUserId === chat.seller._id;
  const isThisOfferFromBuyer = chat && message.sender._id === chat.buyer._id;
  const showActionButtons = isSeller && isThisOfferFromBuyer && !isAccepted && !isDeclined;

  const { user: currentUser } = useAuthStore();
  useCheckAuth();

  if (isUserMessage) {
    return (
      <div className="flex justify-end gap-3">
        <div className="flex flex-col space-y-2 items-end max-w-xs">
          <div className="rounded-2xl flex flex-col p-4 bg-blue-50 border border-blue-100">
            <div className=" flex flex-col ">
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[#3652AD] flex items-center justify-center">
                  <img src='/accepted.png' width={14} height={14}/>
                </div>
                <div>
                <p className="text-sm text-gray-600 font-medium">You sent an offer of</p>
                <span className="text-sm font-bold text-gray-900">
                ₦{message.offer?.amount?.toLocaleString()}
                </span>
                </div>
                </div>
                
            </div>

            {isAccepted && (
              <div className="mt-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-xs font-medium">
                ✅ Offer Accepted
              </div>
            )}
            {isDeclined && (
              <div className="mt-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg text-xs font-medium">
                ❌ Offer Declined
              </div>
            )}
          </div>
           <div className="flex items-center gap-1 mt-1">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
            </svg>
            {/* <svg className="w-4 h-4 text-gray-400 -ml-2" viewBox="0 0 24 24" fill="none">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
            </svg> */}
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
          {/* <p className="text-xs text-gray-500">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p> */}
        </div>
        </div>
        
        {/* User's profile picture for own messages */}
        {/* <div className="flex-shrink-0">
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
        </div> */}
      </div>
    );
  }

  // Other user's offer - show accept/decline buttons for seller
  return (
    <div className="flex gap-3">
      {/* User Avatar for other's messages */}
      <div className="flex-shrink-0">
        {message.sender.profilePic ? (
          <img 
            src={message.sender.profilePic} 
            alt={message.sender.firstName}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {message.sender.firstName?.[0]}{message.sender.lastName?.[0]}
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex flex-col space-y-2 flex-1">
        <div className="rounded-2xl p-4 max-w-xs bg-indigo-50 border border-indigo-100">
          {/* Offer Icon and Text */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-900 font-normal">
                {message.sender.firstName} sent you an offer
              </p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">
                ₦{message.offer?.amount?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action buttons - only show for seller and if offer is not already accepted/declined */}
          {showActionButtons && onAcceptOffer && onDeclineOffer && (
            <div className="flex gap-3">
              <button
                onClick={() => onDeclineOffer(message)}
                className="flex-1 px-6 py-2.5 text-indigo-600 font-medium bg-white border-2 border-indigo-300 rounded-full hover:bg-indigo-50 transition-colors text-sm"
              >
                Decline
              </button>
              <button
                onClick={() => onAcceptOffer(message)}
                className="flex-1 px-6 py-2.5 text-indigo-600 font-medium bg-white border-2 border-indigo-300 rounded-full hover:bg-indigo-50 transition-colors text-sm"
              >
                Accept
              </button>
            </div>
          )}

          {/* Status indicators */}
          {isAccepted && (
            <div className="mt-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-xs font-medium text-center">
              ✅ You accepted this offer
            </div>
          )}
          {isDeclined && (
            <div className="mt-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg text-xs font-medium text-center">
              ❌ You declined this offer
            </div>
          )}
          
          {/* Info for non-sellers */}
          {!showActionButtons && !isAccepted && !isDeclined && (
            <div className="mt-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs text-center">
              Waiting for seller response
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