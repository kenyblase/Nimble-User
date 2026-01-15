import React, { useState } from 'react';

interface Offer {
  id: string;
  productName: string;
  listPrice: number;
  offerPrice: number;
  buyerName: string;
  image: string;
  status: 'pending' | 'accepted' | 'declined';
}


const OffersTabComponent: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: '1',
      productName: 'Photopulse camera',
      listPrice: 40000,
      offerPrice: 30000,
      buyerName: 'Kofoworola',
      image: '/body.png',
      status: 'pending'
    },
    {
      id: '2',
      productName: 'Photopulse camera',
      listPrice: 40000,
      offerPrice: 30000,
      buyerName: 'Kofoworola',
      image: '/camera.png',
      status: 'pending'
    },
    {
      id: '3',
      productName: 'Photopulse camera',
      listPrice: 40000,
      offerPrice: 30000,
      buyerName: 'Kofoworola',
      image: '/camera.png',
      status: 'pending'
    }
  ]);


  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleAcceptOffer = (offerId: string) => {
    setOffers(prev =>
      prev.map(offer =>
        offer.id === offerId
          ? { ...offer, status: 'accepted' as const }
          : offer
      )
    );
    console.log('Accepted offer:', offerId);
  };

  const handleDeclineOffer = (offerId: string) => {
    setOffers(prev =>
      prev.map(offer =>
        offer.id === offerId
          ? { ...offer, status: 'declined' as const }
          : offer
      )
    );
    console.log('Declined offer:', offerId);
  };

  const pendingOffers = offers.filter(offer => offer.status === 'pending');

  return (
    <div className="w-full mx-auto bg-gray-50 min-h-screen">
      {/* Page Header */}

      {/* Tabs */}
      

      {/* Offers Grid */}
      {pendingOffers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              {/* Product Image */}
              <div className="aspect-square ">
                <img
                  src={offer.image}
                  alt={offer.productName}
                  className="w-[90%] flex flex-col m-auto h-[90%] rounded-[8px] justify-center items-center mt-[15px] object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgMTEyLjVIMTc1VjE4Ny41SDEyNVYxMTIuNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                  }}
                />
              </div>

              {/* Offer Details */}
              <div className="p-5 pt-0">
                {/* Product Name */}
                <h3 className="text-sm font-light text-gray-900 mb-2">
                  {offer.productName}
                </h3>

                {/* List Price */}
                <div className="text-sm font-bold text-gray-900 mb-3">
                  {formatPrice(offer.listPrice)}
                </div>

                {/* Offer Information */}
                <div className="mb-4 border-t pt-3 border-gray-200">
                  <p className="text-sm text-[#CF5E0DCC] mb-1">
                    {offer.buyerName} sent an offer of:
                  </p>
                  <div className="text-xl font-bold text-gray-900">
                    {formatPrice(offer.offerPrice)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDeclineOffer(offer.id)}
                    className="flex-1 py-2.5 px-4 border-2 text-[11px] text-[#3652AD] rounded-full cursor-pointer"
                  >
                    Decline offer
                  </button>
                  <button
                    onClick={() => handleAcceptOffer(offer.id)}
                    className="flex-1 py-2.5 px-4 border-2 text-[11px] text-white bg-[#3652AD] rounded-full cursor-pointer"
                  >
                    Accept offer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No offers yet</h3>
          <p className="text-gray-500">Incoming offers will appear here</p>
        </div>
      )}

      {/* Demo Info */}
      
    </div>
  );
};

export default OffersTabComponent;