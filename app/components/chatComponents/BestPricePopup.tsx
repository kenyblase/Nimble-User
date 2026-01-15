// components/BestPricePopup.tsx
import { useState } from 'react';

interface BestPricePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bestPrice: number) => void;
  currentOffer: number;
  productPrice: number;
  loading?: boolean;
}

export function BestPricePopup({ 
  isOpen, 
  onClose, 
  onSubmit, 
  currentOffer, 
  productPrice,
  loading = false 
}: BestPricePopupProps) {
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
      setError('Please enter a valid price');
      return;
    }

    if (price < currentOffer) {
      setError('Best price cannot be lower than the original offer');
      return;
    }

    if (price > productPrice) {
      setError('Best price cannot be higher than product price');
      return;
    }

    onSubmit(price);
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
        <div className="px-6 py-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 text-center">Set Best Price</h2>
          <div className="text-sm text-gray-600 mt-2 text-center space-y-1">
            <p>Original Offer: <span className="font-semibold">₦{currentOffer.toLocaleString()}</span></p>
            <p>Product Price: <span className="font-semibold">₦{productPrice.toLocaleString()}</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter your best price
            </label>
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
                placeholder={`${currentOffer.toLocaleString()}`}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-semibold"
                autoFocus
                disabled={loading}
                min={currentOffer}
                max={productPrice}
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
                'Send Best Price'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}