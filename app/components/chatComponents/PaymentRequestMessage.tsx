import React from 'react';
import { MessageComponentProps } from '@/app/types/types';

export default function PaymentRequestMessage({ 
  message, 
  currentUserId 
}: MessageComponentProps) {
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