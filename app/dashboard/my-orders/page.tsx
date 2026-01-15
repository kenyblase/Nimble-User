'use client'
import React, { useState } from 'react';
import Header from '@/app/components/TopBar';
import VerticalNavMenu from '@/app/components/SidebarNavigation';
import Footer from '@/app/components/Footer';
import ToPayTab from '@/app/components/myOrderComponents/ToPayTab';
import PaidTab from '@/app/components/myOrderComponents/PaidTab';
import AppealTab from '@/app/components/myOrderComponents/Appealtab';
import CompletedOrdersComponent from '@/app/components/myOrderComponents/NewCompleted';
import FailedOrdersComponent from '@/app/components/myOrderComponents/NewFailed';
import MobileTopBar from '@/app/components/MobileTopBar';
import BottomNavigation from '@/app/components/BottomNav';

type OrderTab = 'to-pay' | 'paid' | 'appeal' | 'completed' | 'failed';

const MyOrdersComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderTab>('to-pay');

  const tabs: { id: OrderTab; label: string }[] = [
    { id: 'to-pay', label: 'To pay' },
    { id: 'paid', label: 'Paid' },
    { id: 'appeal', label: 'Appeal' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'to-pay':
        return <ToPayTab />;
      case 'paid':
        return <PaidTab />;
      case 'appeal':
        return <AppealTab />;
      case 'completed':
        return <CompletedOrdersComponent />;
      case 'failed':
        return <FailedOrdersComponent/>;
      default:
        return <ToPayTab />;
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
     <div className="hidden md:block">
        <Header/>
      </div>

       <div className="block md:hidden fixed top-0 left-0 right-0 z-50">
              <MobileTopBar/>
            </div>
      <div className="w-full flex flex-col lg:flex-row flex-1 mx-auto p-3 sm:p-4 md:p-6 bg-gray-50 mt-[80px] sm:mt-0">
        {/* Sidebar - hidden on mobile, shown on lg screens */}
        <div className=" lg:block lg:w-64 xl:w-72 flex-shrink-0">
          <VerticalNavMenu/>
        </div>

        {/* Main content */}
        <div className="flex flex-col w-full lg:ml-6 xl:ml-8 lg:mt-[30px] max-w-7xl">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-2 sm:px-0">
            My orders
          </h1>

          {/* Tabs - Scrollable on mobile */}
          <div className="bg-white border-b border-gray-200 mb-4 sm:mb-6 -mx-3 sm:mx-0 overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors duration-200 relative whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-2 sm:px-0">
            {renderTabContent()}
          </div>
        </div>
      </div>
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation/>
      </div>
      <Footer/>
    </div>
  );
};

export default MyOrdersComponent;