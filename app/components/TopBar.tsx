'use client'
import React, { useState, useEffect } from 'react';
import { Search, Bell, MessageCircle, ChevronDown, Menu, User, X } from 'lucide-react';
import { useAuthStore } from '../lib/stores/useAuthStore';
import { useLogout } from '../lib/hooks/useAuthApis/useLogout';
import { useCheckAuth } from '../lib/hooks/useAuthApis/useCheckAuth';
import { useRouter } from 'next/navigation';

// Define the user interface
interface UserData {
  name?: string;
  email?: string;
  avatar?: string;
}

// Define the auth store interface
interface AuthStore {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const Header: React.FC = () => {
  // Use our authentication store with proper typing
  const { user, isAuthenticated, isLoading } = useAuthStore() as AuthStore;
  const { signOut } = useLogout();
  const router = useRouter();
  
  // Check auth status on component mount
  useCheckAuth();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut();
      setShowUserMenu(false);
      setShowMobileMenu(false);
      // Optional: Redirect to home page after logout
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (): void => {
    console.log('Search query:', searchQuery);
    setShowMobileSearch(false);
  };

  const toggleUserMenu = (): void => {
    router.push('/dashboard/settings')
  };

  const toggleMobileMenu = (): void => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleMobileSearch = (): void => {
    setShowMobileSearch(!showMobileSearch);
  };

  const handleNavigation = (path: string): void => {
    setShowMobileMenu(false);
    router.push(path);
  };

  // Common search component
  const SearchBar = ({ placeholder = "Search", isMobile = false }: { placeholder?: string; isMobile?: boolean }) => (
    <div className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-lg'}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
          className={`w-full pl-10 pr-4 py-1.5 text-gray-600 bg-gray-100 border border-gray-200 rounded-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            isMobile ? 'text-base' : 'text-sm'
          }`}
        />
        {isMobile && (
          <button
            onClick={() => setShowMobileSearch(false)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="bg-white h-[60px] shadow-sm w-full">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-black">LOGO</span>
            </div>
            <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 w-full">
      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 p-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <span className="text-lg font-medium">Search</span>
          </div>
          <SearchBar placeholder="What are you looking for?" isMobile={true} />
        </div>
      )}

      {/* Header for Logged Out Users */}
      {!isAuthenticated && (
        <div className="pb-0">
          <div className="max-w-6xl mx-auto px-4 py-4">
            {/* Top Bar - Mobile */}
            <div className="flex items-center justify-between lg:hidden">
              <button onClick={() => handleNavigation('/')} className="flex items-center">
                <span className="text-2xl font-bold text-black">LOGO</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMobileSearch}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => handleNavigation('/sell')}
                  className="px-4 py-2 bg-[#3652AD] text-sm text-white rounded-[100px] hover:bg-blue-700 transition-colors"
                >
                  Sell
                </button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between gap-4">
              {/* Logo and Menu */}
              <div className="flex items-center justify-between w-auto lg:w-[12%]">
                <button onClick={() => handleNavigation('/')} className="flex items-center gap-2">
                  <img src='/Navigation.png' alt='menu' className='w-8 h-6'/>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-black">LOGO</span>
                </div>
              </div>

              {/* Search Bar */}
              <SearchBar />

              {/* Navigation Links */}
              <nav className="flex items-center gap-6">
                <button 
                  onClick={() => handleNavigation('/feed')} 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Feed
                </button>
                <button 
                  onClick={() => handleNavigation('/requests')} 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Requests
                </button>
                <button 
                  onClick={() => handleNavigation('/login')} 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-space-grotesk"
                >
                  Login
                </button>
                <button 
                  onClick={() => handleNavigation('/sell')} 
                  className="px-5 py-2 bg-[#3652AD] text-sm text-white rounded-[100px] hover:bg-blue-700 transition-colors"
                >
                  Sell
                </button>
              </nav>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden fixed inset-0 bg-white z-40 pt-16 px-4">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => handleNavigation('/feed')}
                  className="py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border-b border-gray-100 text-left"
                >
                  Feed
                </button>
                <button
                  onClick={() => handleNavigation('/requests')}
                  className="py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border-b border-gray-100 text-left"
                >
                  Requests
                </button>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border-b border-gray-100 text-left"
                >
                  Login
                </button>
                <div className="pt-4">
                  <button
                    onClick={() => handleNavigation('/sell')}
                    className="block w-full text-center px-5 py-3 bg-[#3652AD] text-white rounded-[100px] hover:bg-blue-700 transition-colors"
                  >
                    Sell
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header for Logged In Users */}
      {isAuthenticated && (
        <div className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-1 sm:py-4">
            {/* Mobile Layout - Updated Design */}
            <div className="flex items-center justify-between lg:hidden">
              <button onClick={() => handleNavigation('/')} className="flex items-center">
                <span className="text-2xl font-bold text-black">LOGO</span>
              </button>

              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleNavigation('/notifications')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <Bell className="w-6 h-6 text-gray-700" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <button
                  onClick={toggleUserMenu}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user?.name || 'User'} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex items-center justify-between">
                <button onClick={() => handleNavigation('/')} className="flex items-center gap-2">
                  <img src='/Navigation.png' alt='menu' className='w-8 h-6'/>
                </button>
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-2xl font-bold text-black font-space-grotesk">LOGO</span>
                </div>
              </div>

              {/* Search Bar */}
              <SearchBar />

              {/* User Actions */}
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* Messages */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user?.name || 'User'} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* User Dropdown Menu */}
                  {/* {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-sm text-gray-500">{user?.email || ''}</p>
                      </div>
                      <button 
                        onClick={() => handleNavigation('/profile')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      <button 
                        onClick={() => handleNavigation('/settings')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </button>
                      <button 
                        onClick={() => handleNavigation('/orders')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Orders
                      </button>
                      <div className="border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )} */}
                </div>

                {/* Sell Button */}
                <button 
                  onClick={() => handleNavigation('/sell')}
                  className="px-6 py-2 bg-[#3652AD] text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sell
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu for Logged In Users */}
          
        </div>
      )}
    </div>
  );
};

export default Header;