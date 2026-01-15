import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

const VerticalNavMenu: React.FC = () => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({
    orders: false
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarHeight, setSidebarHeight] = useState('72vh');
  const desktopSidebarRef = useRef<HTMLDivElement>(null);

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
    { id: 'messages', label: 'Messages', path: '/dashboard/messages' },
    { id: 'reviews', label: 'Reviews', path: '/reviews' },
    { id: 'saved-items', label: 'Saved items', path: '/saved-items' },
    { id: 'transactions', label: 'Transactions', path: '/transactions' },
    { id: 'settings', label: 'Settings', path: '/dashboard/settings' }
  ];

  // Calculate dynamic sidebar height based on actual content
  useEffect(() => {
    const calculateHeight = () => {
      if (!desktopSidebarRef.current) return '72vh';
      
      const content = desktopSidebarRef.current.querySelector('nav');
      if (!content) return '72vh';
      
      // Get the actual content height
      const contentHeight = content.scrollHeight;
      
      // Add padding (p-4 = 1rem = 16px top and bottom = 32px total)
      const padding = 32;
      const totalHeight = contentHeight + padding;
      
      // Convert to viewport height or use min-height
      const viewportHeight = window.innerHeight;
      const heightInVh = (totalHeight / viewportHeight) * 100;
      
      // Set a minimum of 72vh and maximum of 95vh
      const finalHeight = Math.max(72, Math.min(heightInVh, 95));
      
      return `${finalHeight}vh`;
    };

    // Use setTimeout to ensure the DOM has updated after state changes
    const timeoutId = setTimeout(() => {
      const newHeight = calculateHeight();
      setSidebarHeight(newHeight);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [expandedItems, menuItems]);

  // Check if a menu item is active based on current pathname
  const isItemActive = (item: MenuItem): boolean => {
    if (item.path && pathname === item.path) {
      return true;
    }
    
    if (item.hasSubmenu && item.submenuItems) {
      return item.submenuItems.some(subItem => pathname === subItem.path);
    }
    
    return false;
  };

  // Check if a submenu item is active
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
    }
    // Close mobile menu when an item is clicked (on mobile)
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside (optional)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.vertical-nav-menu')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Render menu content (shared between desktop and mobile)
  const renderMenuContent = () => (
    <nav className="space-y-1">
      {menuItems.map((item) => {
        const isActive = isItemActive(item);
        
        return (
          <div key={item.id}>
            {/* Main menu item */}
            {item.hasSubmenu ? (
              <button
                onClick={() => handleMenuClick(item)}
                className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive
                    ? ' text-blue-600  '
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
                onClick={() => window.innerWidth < 768 && setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive
                    ? ' text-blue-600 '
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            )}

            {/* Submenu items */}
            {item.hasSubmenu && expandedItems[item.id] && item.submenuItems && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                {item.submenuItems.map((subItem) => {
                  const isSubActive = isSubItemActive(subItem);
                  
                  return (
                    <Link
                      key={subItem.id}
                      href={subItem.path}
                      onClick={() => window.innerWidth < 768 && setIsMobileMenuOpen(false)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
                        isSubActive
                          ? ' text-blue-600 '
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

  return (
    <>
      {/* Mobile Menu Button - Hidden when mobile menu is open */}
      <div className={`md:hidden hidden top-4 left-4 z-50 transition-opacity duration-300 ${
        isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-white rounded-lg border border-gray-200 shadow-md"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div 
        ref={desktopSidebarRef}
        className="mt-[20px] hidden md:block vertical-nav-menu"
        style={{ height: sidebarHeight, minHeight: '72vh', maxHeight: '95vh' }}
      >
        <div className="w-44 h-full bg-white rounded-lg border border-gray-200 p-4 sticky top-6 transition-all duration-300 ease-in-out overflow-hidden">
          {renderMenuContent()}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed md:hidden" />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`fixed top-0 left-0 z-40 vertical-nav-menu md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ height: '100vh' }}
      >
        <div className="w-64 h-full bg-white border-r border-gray-200 p-4 overflow-y-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={toggleMobileMenu}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {renderMenuContent()}
        </div>
      </div>
    </>
  );
};

export default VerticalNavMenu;