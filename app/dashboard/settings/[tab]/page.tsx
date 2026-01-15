// app/settings/[tab]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { SettingsTab } from '@/app/types/settings';
import PersonalDetails from '@/app/components/settingsComponents/PersonalDetails';
import BusinessDetails from '@/app/components/settingsComponents/BusinessDetails';
import ShippingAddress from '@/app/components/settingsComponents/ShippingAddress';
import WithdrawalDetails from '@/app/components/settingsComponents/WithdrawalDetails';
import ChangePassword from '@/app/components/settingsComponents/ChangePassword';
import NotificationSettings from '@/app/components/settingsComponents/NotificationSettings';
import DeleteAccount from '@/app/components/settingsComponents/DeleteAccount';

interface TabPageProps {
  params: Promise<{ tab: string }>;
}

const TabPage: React.FC<TabPageProps> = ({ params }) => {
  const router = useRouter();
  const [tab, setTab] = useState<SettingsTab | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const resolvedParams = await params;
        const tabParam = resolvedParams.tab;
        
        // Validate if the tab is a valid SettingsTab
        const validTabs: SettingsTab[] = [
          'personal', 'business', 'shipping', 'withdrawal', 
          'password', 'notifications', 'delete'
        ];
        
        if (validTabs.includes(tabParam as SettingsTab)) {
          setTab(tabParam as SettingsTab);
        } else {
          notFound();
        }
      } catch (error) {
        console.error('Error fetching params:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchParams();
  }, [params]);

  const renderTabContent = () => {
    if (!tab) return null;

    switch (tab) {
      case 'personal':
        return <PersonalDetails settingsRoute="/dashboard/settings" showFullLayout />;
      case 'business':
        return <BusinessDetails settingsRoute="/dashboard/settings" showFullLayout />;
      case 'shipping':
        return <ShippingAddress settingsRoute="/dashboard/settings" showFullLayout />;
      case 'withdrawal':
        return <WithdrawalDetails settingsRoute="/dashboard/settings" showFullLayout />;
      case 'password':
        return <ChangePassword settingsRoute="/dashboard/settings" showFullLayout />;
      case 'notifications':
        return <NotificationSettings settingsRoute="/dashboard/settings" showFullLayout />;
      case 'delete':
        return <DeleteAccount settingsRoute="/dashboard/settings" showFullLayout />;
      default:
        return notFound();
    }
  };

  const getTabTitle = () => {
    if (!tab) return 'Settings';
    
    switch (tab) {
      case 'personal': return 'Personal Details';
      case 'business': return 'Business Details';
      case 'shipping': return 'Shipping Address';
      case 'withdrawal': return 'Withdrawal Details';
      case 'password': return 'Change Password';
      case 'notifications': return 'Notification Settings';
      case 'delete': return 'Delete Account';
      default: return 'Settings';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!tab) {
    return notFound();
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50">
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white">
        <button
          onClick={() => router.push('/dashboard/settings')}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-medium text-gray-900">{getTabTitle()}</h1>
      </div>

      <div className="flex-1">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TabPage;