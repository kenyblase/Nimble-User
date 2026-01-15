import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onBack?: () => void;
  onFollow?: () => void;
  isFollowing?: boolean;
}

const SellHeader: React.FC<HeaderProps> = ({ 
  onBack, 
  onFollow, 
  isFollowing = false 
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [following, setFollowing] = useState(isFollowing);

  const handleFollow = () => {
    setFollowing(!following);
    onFollow?.();
  };

  return (
    <header className="w-full bg-gray-50 border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>

        {/* Search Input */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
              className="w-full pl-12 pr-4 py-2 bg-white border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Follow Button */}
        <button
          onClick={handleFollow}
          className={`flex-shrink-0 px-8 py-2 rounded-full font-medium transition-all ${
            following
              ? 'bg-gray-200 text-black hover:bg-gray-300'
              : 'bg-black text-white'
          }`}
        >
          {following ? 'Following' : 'Follow'}
        </button>
      </div>
    </header>
  );
};

export default SellHeader;