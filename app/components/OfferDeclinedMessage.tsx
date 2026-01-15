// components/OfferDeclinedMessage.tsx

interface Message {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  offer?: {
    bestPrice?: number;
  };
  createdAt: string | Date;
}

interface OfferDeclinedMessageProps {
  message: Message;
  currentUserId: string;
  onAcceptBestPrice?: (message: Message) => void;
  onDeclineBestPrice?: (message: Message) => void;
}

export function OfferDeclinedMessage({ 
  message, 
  currentUserId,
  onAcceptBestPrice,
  onDeclineBestPrice 
}: OfferDeclinedMessageProps) {
  const isUserMessage = message.sender._id === currentUserId;
  const hasBestPrice = !!message.offer?.bestPrice;

  if (isUserMessage) {
    return (
      <div className="flex flex-col space-y-2 items-end">
        <div className="rounded-2xl p-4 max-w-xs bg-red-50 border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm text-red-800 font-medium">You declined the offer</p>
          </div>
          
          {hasBestPrice && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Best price offered:</p>
              <p className="text-lg font-bold text-gray-900">
                ₦{message.offer!.bestPrice!.toLocaleString()}
              </p>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      {/* User Avatar */}
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

      <div className="flex flex-col space-y-2 flex-1">
        <div className="rounded-2xl p-4 max-w-xs bg-red-50 border border-red-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-red-800 font-medium">
                {message.sender.firstName} declined your offer
              </p>
              {hasBestPrice && (
                <p className="text-lg font-bold text-gray-900 mt-1">
                  Best price: ₦{message.offer!.bestPrice!.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons for buyer to respond to best price */}
          {hasBestPrice && onAcceptBestPrice && onDeclineBestPrice && (
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => onDeclineBestPrice(message)}
                className="flex-1 px-4 py-2 text-red-600 font-medium bg-white border-2 border-red-300 rounded-full hover:bg-red-50 transition-colors text-sm"
              >
                Decline
              </button>
              <button
                onClick={() => onAcceptBestPrice(message)}
                className="flex-1 px-4 py-2 text-red-600 font-medium bg-white border-2 border-red-300 rounded-full hover:bg-red-50 transition-colors text-sm"
              >
                Accept & Pay
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