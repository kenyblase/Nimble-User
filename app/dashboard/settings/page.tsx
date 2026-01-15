// app/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsTab, MobileViewState } from '@/app/types/settings';
import { useLogout } from '@/app/lib/hooks/useAuthApis/useLogout';
import VerticalNavMenu from '@/app/components/SidebarNavigation';
import Footer from '@/app/components/Footer';
import BottomNavigation from '@/app/components/BottomNav';

const SettingsPage: React.FC = () => {
  const [mobileView, setMobileView] = useState<MobileViewState>({
    isMobile: false,
    showTabList: true,
    showContent: false
  });

  const router = useRouter();
  const { signOut } = useLogout();

  const tabs = [
    { id: 'personal' as SettingsTab, label: 'Personal profile', icon: '/personal.png' },
    { id: 'business' as SettingsTab, label: 'Business details', icon: '/business.png' },
    { id: 'shipping' as SettingsTab, label: 'Address', icon: '/address.png' },
    { id: 'withdrawal' as SettingsTab, label: 'Withdrawal details', icon: '/withdrawal-blue.png' },
    { id: 'password' as SettingsTab, label: 'Change password', icon: '/password.png' },
    { id: 'notifications' as SettingsTab, label: 'Notification settings', icon: '/notification.png' },
    // { id: 'delete' as SettingsTab, label: 'Delete account', icon: '/delete.png' },
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 1024;
      setMobileView({
        isMobile,
        showTabList: true,
        showContent: false
      });
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleTabClick = (tab: SettingsTab) => {
    router.push(`/dashboard/settings/${tab}`);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Mobile view
  if (mobileView.isMobile) {
    return (
      <div className="w-full flex flex-col min-h-screen bg-gray-50">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-gray-900">Settings</h1>
        </div>

        <div className="min-h-screen bg-white">
          <div className="px-4 py-6">
            <nav className="space-y-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className="w-full text-left px-4 py-4 flex items-center text-base font-normal border-b border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                >
                  <div className="mr-3 flex-shrink-0">
                    <img src={tab.icon} alt="" className="w-5 h-5 object-contain" />
                  </div>
                  <span>{tab.label}</span>
                </button>
              ))}
              
              <div className="border-gray-200 my-2"></div>
              
              <button 
                onClick={handleLogout} 
                className="w-full text-left px-4 py-3 flex items-center text-base font-normal text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
              >
                <div className="mr-3 flex-shrink-0">
                  <img src='/logout.png' alt="" className="w-5 h-5 object-contain" />
                </div>
                <span>Log out</span>
              </button>
            </nav>
          </div>
        </div>

        <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
          <BottomNavigation />
        </div>
        <Footer />
      </div>
    );
  }

  // Desktop view
  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50">
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
        <button
          onClick={() => router.back()}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-medium text-gray-900">Settings</h1>
      </div>

      <div className="w-full flex flex-col sm:flex-row justify-between lg:flex-row mx-auto p-3 sm:p-4 md:p-6 bg-gray-50 mt-4">
        <div className="w-[0%] lg:w-[20%]">
          <VerticalNavMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-lg shadow-sm p-4 lg:p-6">
            <div className="lg:w-80 border-r border-gray-200 pr-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className="w-full text-left px-4 py-3 flex items-center text-base font-normal text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 rounded-lg"
                  >
                    <div className="mr-3 flex-shrink-0">
                      <img src={tab.icon} alt="" className="w-5 h-5 object-contain" />
                    </div>
                    <span>{tab.label}</span>
                  </button>
                ))}
                
                <div className="border-t border-gray-200 my-4"></div>
                
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left px-4 py-3 flex items-center text-base font-normal text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 rounded-lg"
                >
                  <div className="mr-3 flex-shrink-0">
                    <img src='/logout.png' alt="" className="w-5 h-5 object-contain" />
                  </div>
                  <span>Log out</span>
                </button>
              </nav>
            </div>
            
            <div className="flex-1 pl-0 lg:pl-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-500 text-center py-12">
                  Select a setting from the menu to view or edit details
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SettingsPage;