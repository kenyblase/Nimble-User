import React, { useState, useRef, useEffect } from 'react';
import { Settings, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCheckAuth } from '../lib/hooks/useAuthApis/useCheckAuth';

interface MenuItem {
  id: string;
  label: string;
  path?: string;
  hasSubmenu?: boolean;
  submenuItems?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  label: string;
  path: string;
}

export default function MobileTopBar() {
  const { user, isLoading } = useCheckAuth();
  const pathname = usePathname();
  const router = useRouter();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({
    orders: false
  });
  const settingsRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    { id: 'overview', label: 'Overview', path: '/dashboard/user' },
    { id: 'my-listing', label: 'My listing', path: '/dashboard/my-listings' },
    { id: 'my-ads', label: 'My ads', path: '/my-ads' },
    { 
      id: 'orders', 
      label: 'Orders', 
      hasSubmenu: true, 
      submenuItems: [
        { id: 'my-orders', label: 'My orders', path: '/dashboard/my-orders' },
        { id: 'incoming-orders', label: 'Incoming orders', path: '/dashboard/orders' }
      ] 
    },
    { id: 'my-requests', label: 'My requests', path: '/dashboard/my-requests' },
    { id: 'messages', label: 'Messages', path: '/dashboard/message' },
    { id: 'reviews', label: 'Reviews', path: '/dashboard/reviews' },
    { id: 'saved-items', label: 'Saved items', path: '/dashboard/saved-items' },
    { id: 'transactions', label: 'Transactions', path: '/dashboard/transactions' },
    { id: 'settings', label: 'Settings', path: '/dashboard/settings' }
  ];

  const getInitials = (user: any) => {
    if (!user) return 'GU';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (lastName) {
      return lastName[0].toUpperCase();
    } else if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return 'GU';
  };

  const getDisplayName = (user: any) => {
    if (!user) return 'Guest User';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    } else if (user.email) {
      return user.email;
    }
    
    return 'Guest User';
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (item.path && pathname === item.path) {
      return true;
    }
    
    if (item.hasSubmenu && item.submenuItems) {
      return item.submenuItems.some(subItem => pathname === subItem.path);
    }
    
    return false;
  };

  const isSubItemActive = (subItem: SubMenuItem): boolean => {
    return pathname === subItem.path;
  };

  const toggleSubmenu = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.hasSubmenu) {
      toggleSubmenu(item.id);
    } else {
      setIsMenuOpen(false);
    }
  };

  const settingsRoute = () => {
    router.push('/dashboard/settings');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-sidebar') && !target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const renderMenuContent = () => (
    <nav className="space-y-1">
      {menuItems.map((item) => {
        const isActive = isItemActive(item);
        
        return (
          <div key={item.id}>
            {item.hasSubmenu ? (
              <button
                onClick={() => handleMenuClick(item)}
                className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                }`}
              >
                <span>{item.label}</span>
                <div className="ml-2">
                  {expandedItems[item.id] ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </button>
            ) : (
              <Link
                href={item.path || '#'}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            )}

            {item.hasSubmenu && expandedItems[item.id] && item.submenuItems && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                {item.submenuItems.map((subItem) => {
                  const isSubActive = isSubItemActive(subItem);
                  
                  return (
                    <Link
                      key={subItem.id}
                      href={subItem.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
                        isSubActive
                          ? 'text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-200'
                      }`}
                    >
                      {subItem.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  if (isLoading) {
    return (
      <div className="w-full bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
          </div>
          <div className="w-9 h-9 bg-gray-300 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-white border-b border-gray-200 relative">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side - Menu button and Profile */}
          <div className="flex items-center gap-3">
            <button 
              className="menu-button p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menu"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {getInitials(user)}
            </div>
            <span className="text-gray-900 font-medium text-base">
              {getDisplayName(user)}
            </span>
          </div>
          
          {/* Right side - Settings */}
          <div className="relative" ref={settingsRef}>
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Settings"
              onClick={settingsRoute}
            >
              <Settings className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Slide-in Sidebar */}
      <div 
        className={`mobile-sidebar fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ height: '100vh' }}
      >
        <div className="w-64 h-full bg-white border-r border-gray-200 p-4 overflow-y-auto">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {renderMenuContent()}
        </div>
      </div>
    </>
  );
}