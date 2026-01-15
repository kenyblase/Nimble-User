// app/components/settingsComponents/SettingsComponentFactory.tsx
'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/TopBar';
import Footer from '@/app/components/Footer';
import BottomNavigation from '@/app/components/BottomNav';
import MobileTopBar from '@/app/components/MobileTopBar';

interface SettingsComponentFactoryProps {
  title: string;
  children: ReactNode;
  settingsRoute?: string;
  showFullLayout?: boolean;
  showActionButtons?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  isSaveDisabled?: boolean;
}

export default function SettingsComponentFactory({
  title,
  children,
  settingsRoute = '/dashboard/settings',
  showFullLayout = false,
  showActionButtons = true,
  onSave,
  onCancel
}: SettingsComponentFactoryProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push(settingsRoute);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      handleBack();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      handleBack();
    }
  };

  const content = (
    <>
      {/* Header with Back Button */}
      {/* <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
        <div className="lg:hidden mb-4">
        <button
          onClick={() => router.push(settingsRoute)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
         
        </button>
      </div>
        <h1 className="text-lg font-medium text-gray-900">{title}</h1>
      </div> */}

      {/* Component Content */}
      <div className="p-4 bg-white min-h-screen">
        {children}
      </div>

      {/* Action Buttons */}
      {/* {showActionButtons && (
        <div className="sticky bottom-0 left-0 right-0 flex gap-3 px-4 py-4 bg-white border-t border-gray-100">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3.5 bg-orange-50 text-orange-500 rounded-full font-medium hover:bg-orange-100 transition-colors text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors text-base"
          >
            Save
          </button>
        </div>
      )} */}
    </>
  );

  if (showFullLayout) {
    return (
      <div className="w-full flex flex-col min-h-screen bg-gray-50">
        {/* <div className="block md:hidden fixed top-0 left-0 right-0 z-50">
          <MobileTopBar/>
        </div> */}
        {content}
        <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
          <BottomNavigation/>
        </div>
        {/* <Footer/> */}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-white text-black">
      {content}
    </div>
  );
}