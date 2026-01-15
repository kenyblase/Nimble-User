'use client'
import React, { useState } from 'react';
import { Heart, ThumbsUp, MessageCircle, Share, Play, MoreHorizontal } from 'lucide-react';
import Header from '../components/TopBar';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNav';

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
  user: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  description: string;
  timeAgo: string;
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
      isBookmarked: false,
      user: {
        name: 'Agnes David',
        avatar: '/avatars/agnes.jpg'
      },
      description: 'Luxury jeans for women...',
      timeAgo: '2h'
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
      isBookmarked: false,
      user: {
        name: 'Agnes David',
        avatar: '/avatars/agnes.jpg'
      },
      description: 'Luxury jeans for women...',
      timeAgo: '4h'
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
      isBookmarked: false,
      user: {
        name: 'Agnes David',
        avatar: '/avatars/agnes.jpg'
      },
      description: 'Luxury jeans for women...',
      timeAgo: '6h'
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
    <div className='w-full min-h-screen bg-gray-50'>
      {/* Header - Visible only on desktop/tablet */}
      <div className="hidden md:block">
        <Header/>
      </div>
      
      {/* Main Content with bottom padding for mobile nav */}
      <main className="pb-20 md:pb-0">
        <div className="w-full max-w-2xl mx-auto px-4 py-8">
          {/* Feed Items */}
          <div className="space-y-6">
            {feedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between p-4 pb-3">
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {item.user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    {/* User Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {item.user.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Menu Button */}
                  <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Media Container */}
                <div className="relative bg-gray-100">
                  <img
                    src={item.thumbnail}
                    alt={`Post by ${item.user.name}`}
                    className="w-full aspect-video object-cover"
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
                        className="w-16 h-16 bg-black bg-opacity-60 rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors duration-200"
                      >
                        <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                      </button>
                    </div>
                  )}

                  {/* Duration Badge for Videos */}
                  {item.type === 'video' && item.duration && (
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Play className="w-3 h-3" fill="currentColor" />
                      <span>{item.duration}</span>
                    </div>
                  )}

                  {/* Time Badge */}
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {item.timeAgo}
                  </div>
                </div>

                {/* Engagement Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    {/* Left Side Actions */}
                    <div className="flex items-center gap-6">
                      {/* Like Button */}
                      <button
                        onClick={() => toggleLike(item.id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            item.isLiked
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-600'
                          }`}
                        />
                        <span className="text-sm font-medium">{item.likes}</span>
                      </button>

                      {/* Comments Button */}
                      <button
                        onClick={() => handleComment(item.id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.comments}</span>
                      </button>

                      {/* Share Button */}
                      <button
                        onClick={() => handleShare(item.id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors duration-200"
                      >
                        <Share className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.shares}</span>
                      </button>
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(item.id)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          item.isBookmarked
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Action Button - Adjusted position for mobile nav */}
          <div className="fixed bottom-20 right-6 md:bottom-6">
            <button className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200">
              <span className="text-white text-2xl">+</span>
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <Footer/>
      </main>
      
      {/* Bottom Navigation - Visible only on mobile */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default TrendingFeedSection;