'use client'
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Header from '@/app/components/TopBar';
import VerticalNavMenu from '@/app/components/SidebarNavigation';

interface Negotiation {
  id: string;
  buyerName: string;
  offerAmount: number;
  productName: string;
}

const NegotiationsPageComponent: React.FC = () => {
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [negotiations] = useState<Negotiation[]>([
    {
      id: '1',
      buyerName: 'Susan',
      offerAmount: 29000,
      productName: 'Tura face wash'
    },
    {
      id: '2',
      buyerName: 'Kofoworola',
      offerAmount: 30000,
      productName: 'Tura face wash'
    }
  ]);

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleDeclineOffer = (negotiationId: string) => {
    console.log('Decline offer:', negotiationId);
  };

  const handlePlaceOrder = (negotiationId: string) => {
    console.log('Accept offer and place order:', negotiationId);
  };

  const togglePriceFilter = () => {
    setShowPriceFilter(!showPriceFilter);
  };

  return (
    <div className='w-full'>
        <Header/>
    <div className="flex">
        <VerticalNavMenu/>
    <div className="w-[80%] mx-auto p-6 bg-gray-50 min-h-screen">
        
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Negotiations - Tura face wash
      </h1>

      {/* Filter Dropdown */}
      <div className="mb-6">
        <button
          onClick={togglePriceFilter}
          className="flex items-center justify-between w-64 px-4 py-3 bg-white border border-gray-300 rounded-lg text-blue-600 font-medium hover:bg-gray-50 transition-colors"
        >
          <span>Filter by price range</span>
          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showPriceFilter ? 'rotate-180' : ''}`} />
        </button>

        {/* Filter Options (expandable) */}
        {showPriceFilter && (
          <div className="mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Under ₦25,000</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">₦25,000 - ₦30,000</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Above ₦30,000</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Negotiations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {negotiations.map((negotiation) => (
          <div
            key={negotiation.id}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
          >
            {/* Offer Information */}
            <div className="mb-5">
              <p className="text-sm text-gray-600 mb-2">
                {negotiation.buyerName} sent an offer of:
              </p>
              <div className="text-2xl font-bold text-orange-600">
                {formatPrice(negotiation.offerAmount)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {/* Decline Offer Button */}
              <button
                onClick={() => handleDeclineOffer(negotiation.id)}
                className="flex-1 py-3 px-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors duration-200"
              >
                Decline offer
              </button>

              {/* Place Order Button */}
              <button
                onClick={() => handlePlaceOrder(negotiation.id)}
                className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                Place order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Info */}
      {/* <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2 text-sm">Component Features:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Page header with product name context</li>
          <li>• Filter dropdown for price range filtering</li>
          <li>• 2-column grid layout for negotiation cards</li>
          <li>• Buyer name and offer amount display</li>
          <li>• Orange text for offer amounts</li>
          <li>• Decline/Accept action buttons</li>
          <li>• Clean card design with hover effects</li>
          <li>• Expandable filter with checkbox options</li>
        </ul>
      </div> */}
      </div>
    </div>
    </div>
  );
};

export default NegotiationsPageComponent;