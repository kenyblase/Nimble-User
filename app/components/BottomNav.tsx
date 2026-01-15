import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, HelpCircle, Plus, MessageSquare, User } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'feed', label: 'Feed', icon: FileText, href: '/feed' },
    { id: 'requests', label: 'Requests', icon: HelpCircle, href: '/requests' },
    { id: 'sell', label: 'Sell', icon: Plus, href: '/dashboard/my-listings/create-listing' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/dashboard/message' },
    { id: 'account', label: 'Account', icon: User, href: '/dashboard/user' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="w-full mx-auto bg-white">
      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-2 py-2">
        <div className="flex items-center justify-between">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);
            
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 transition-colors duration-200 ${
                  active ? '' : 'hover:bg-gray-50'
                } rounded-lg`}
              >
                {/* Icon container with background for active state */}
                <div className={`p-2 rounded-full mb-1 transition-colors duration-200 ${
                  active 
                    ? tab.id === 'sell' 
                      ? 'bg-black text-white' 
                      : 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon 
                    className={`w-5 h-5 ${
                      tab.id === 'sell' && active ? 'text-white' : ''
                    }`} 
                  />
                </div>
                
                {/* Label */}
                <span className={`text-xs font-medium transition-colors duration-200 ${
                  active 
                    ? tab.id === 'sell' 
                      ? 'text-black' 
                      : 'text-blue-600'
                    : 'text-gray-600'
                }`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;