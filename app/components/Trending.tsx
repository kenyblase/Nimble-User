import React, { useState } from 'react';
import { Heart, ThumbsUp, MessageCircle, Share, Play } from 'lucide-react';

interface FeedItem {
  id: string;
  type: 'video' | 'image';
  thumbnail: string;
  duration?: string;
  likes: number;
  isLiked: boolean;
  thumbsUp: number;
  isThumbedUp: boolean;
  comments: number;
  shares: number;
  isBookmarked: boolean;
}

const TrendingFeedSection: React.FC = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    {
      id: '1',
      type: 'video',
      thumbnail: '/camera.png',
      duration: '00:10',
      likes: 10,
      isLiked: false,
      thumbsUp: 10,
      isThumbedUp: false,
      comments: 10,
      shares: 10,
      isBookmarked: false
    },
    {
      id: '2',
      type: 'image',
      thumbnail: '/camera.png',
      likes: 10,
      isLiked: false,
      thumbsUp: 10,
      isThumbedUp: false,
      comments: 10,
      shares: 10,
      isBookmarked: false
    },
    {
      id: '3',
      type: 'video',
      thumbnail: '/camera.png',
      duration: '00:10',
      likes: 10,
      isLiked: false,
      thumbsUp: 10,
      isThumbedUp: false,
      comments: 10,
      shares: 10,
      isBookmarked: false
    }
  ]);

  const toggleLike = (itemId: string) => {
    setFeedItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              isLiked: !item.isLiked,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1
            }
          : item
      )
    );
  };

  const toggleThumbsUp = (itemId: string) => {
    setFeedItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              isThumbedUp: !item.isThumbedUp,
              thumbsUp: item.isThumbedUp ? item.thumbsUp - 1 : item.thumbsUp + 1
            }
          : item
      )
    );
  };

  const toggleBookmark = (itemId: string) => {
    setFeedItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, isBookmarked: !item.isBookmarked }
          : item
      )
    );
  };

  const handlePlay = (itemId: string) => {
    console.log('Playing video:', itemId);
  };

  const handleShare = (itemId: string) => {
    console.log('Sharing item:', itemId);
  };

  const handleComment = (itemId: string) => {
    console.log('Opening comments for:', itemId);
  };

  const handleViewAll = () => {
    console.log('View all trending items');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Trending in feed</h2>
        <button
          onClick={handleViewAll}
          className="px-4 py-2 text-orange-600 border border-orange-600 rounded-full hover:bg-orange-50 transition-colors duration-200 text-sm font-medium"
        >
          View all
        </button>
      </div>

      {/* Feed Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            {/* Media Container */}
            <div className="relative aspect-video bg-gray-100 group cursor-pointer">
              <img
                src={item.thumbnail}
                alt={`Feed item ${item.id}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE3NVYxNzVIMjI1VjEyNUgxNzVaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg==';
                }}
              />

              {/* Video Play Button */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => handlePlay(item.id)}
                    className="w-16 h-16 bg-black bg-opacity-60 rounded-full flex items-center justify-center group-hover:bg-opacity-80 transition-colors duration-200"
                  >
                    <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                  </button>
                </div>
              )}

              {/* Duration Badge for Videos */}
              {item.type === 'video' && item.duration && (
                <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Play className="w-3 h-3" fill="currentColor" />
                  <span>{item.duration}</span>
                </div>
              )}

              {/* Bookmark Button */}
              <button
                onClick={() => toggleBookmark(item.id)}
                className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-colors duration-200"
              >
                <Heart
                  className={`w-4 h-4 ${
                    item.isBookmarked
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-600 hover:text-red-500'
                  }`}
                />
              </button>
            </div>

            {/* Engagement Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                {/* Left Side Actions */}
                <div className="flex items-center gap-4">
                  {/* Like Button */}
                  <button
                    onClick={() => toggleLike(item.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        item.isLiked
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                    <span className="text-sm">{item.likes}</span>
                  </button>

                  {/* Thumbs Up Button */}
                  <button
                    onClick={() => toggleThumbsUp(item.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    <ThumbsUp
                      className={`w-4 h-4 ${
                        item.isThumbedUp
                          ? 'fill-blue-500 text-blue-500'
                          : 'text-gray-600'
                      }`}
                    />
                    <span className="text-sm">{item.thumbsUp}</span>
                  </button>

                  {/* Comments Button */}
                  <button
                    onClick={() => handleComment(item.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors duration-200"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{item.comments}</span>
                  </button>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => handleShare(item.id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-500 transition-colors duration-200"
                >
                  <Share className="w-4 h-4" />
                  <span className="text-sm">{item.shares}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Info */}
      {/* <div className="mt-8 bg-orange-50 rounded-lg p-4">
        <h3 className="font-semibold text-orange-800 mb-2">Component Features:</h3>
        <ul className="text-sm text-orange-700 space-y-1">
          <li>• Mixed video and image feed items with proper play buttons</li>
          <li>• Interactive engagement metrics (likes, thumbs up, comments, shares)</li>
          <li>• Video duration badges and bookmark functionality</li>
          <li>• Responsive grid layout (1-3 columns based on screen size)</li>
          <li>• Hover effects and smooth transitions</li>
          <li>• State management for all user interactions</li>
          <li>• Fallback images for missing media</li>
        </ul>
      </div> */}
    </div>
  );
};

export default TrendingFeedSection;