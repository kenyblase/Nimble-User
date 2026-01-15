'use client';

import React, { useState } from 'react';

export default function DeclineOfferPopup({ 
  isOpen, 
  onClose, 
  onSubmit,
  offerAmount,
  currentPrice,
  loading = false
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: { bestPrice: number }) => void;
  offerAmount: number;
  currentPrice: number;
  loading?: boolean;
}) {
  const [bestPrice, setBestPrice] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!bestPrice) {
      setError('Please enter your best price');
      return;
    }

    const price = parseFloat(bestPrice);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (price > currentPrice) {
      setError('Best price cannot be higher than listing price');
      return;
    }

    if (price <= offerAmount) {
      setError('Best price should be higher than the offer');
      return;
    }

    onSubmit({ bestPrice: price });
    setBestPrice('');
  };

  const handleCancel = () => {
    setBestPrice('');
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
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 text-center">Decline Offer</h2>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Buyer's offer: ₦{offerAmount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Listing price: ₦{currentPrice.toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              What's your best price?
            </label>
            <p className="text-xs text-gray-500 mb-3 text-center">
              Let the buyer know the lowest price you can accept
            </p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-lg">
                ₦
              </span>
              <input
                type="number"
                value={bestPrice}
                onChange={(e) => {
                  setBestPrice(e.target.value);
                  setError('');
                }}
                placeholder="0"
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-center font-semibold"
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
              disabled={!bestPrice || loading}
              className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Declining...
                </>
              ) : (
                'Decline & Send'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}