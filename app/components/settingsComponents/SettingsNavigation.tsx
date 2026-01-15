// app/components/settingsComponents/SettingsNavigation.tsx
'use client'
import { useRouter } from 'next/navigation';
import { SettingsTab } from '@/app/types/settings';

interface SettingsNavigationProps {
  currentTab?: SettingsTab;
}

const SettingsNavigation: React.FC<SettingsNavigationProps> = ({ currentTab }) => {
  const router = useRouter();
  
  const tabs: { id: SettingsTab; label: string; description: string }[] = [
    { id: 'personal', label: 'Personal Details', description: 'Update your personal information' },
    { id: 'business', label: 'Business Details', description: 'Manage business information' },
    { id: 'shipping', label: 'Shipping Address', description: 'Update shipping addresses' },
    { id: 'withdrawal', label: 'Withdrawal Details', description: 'Bank account information' },
    { id: 'password', label: 'Change Password', description: 'Update your password' },
    { id: 'notifications', label: 'Notifications', description: 'Configure notifications' },
    // { id: 'delete', label: 'Delete Account', description: 'Permanently delete account' },
  ];

  const navigateToTab = (tabId: SettingsTab) => {
    router.push(`/settings?tab=${tabId}`);
  };

  return (
    <div className="space-y-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => navigateToTab(tab.id)}
          className={`w-full text-left p-4 rounded-lg transition-all ${
            currentTab === tab.id
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-900">{tab.label}</h3>
              <p className="text-sm text-gray-600 mt-1">{tab.description}</p>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SettingsNavigation;