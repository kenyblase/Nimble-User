'use client';

import { useState, useEffect, useCallback } from 'react';
import SettingsComponentFactory from './SettingsComponentFactory';
import { useNotificationSettings } from '@/app/lib/hooks/useSettingsApis/useNotificationSettings';
import toast from 'react-hot-toast';

interface NotificationSettingsProps {
  onSave?: (settings: any) => void;
  onCancel?: () => void;
  settingsRoute?: string;
  showFullLayout?: boolean;
}

// Toggle Component
const Toggle = ({ 
  isOn, 
  onToggle,
  disabled = false
}: { 
  isOn: boolean; 
  onToggle: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onToggle}
    disabled={disabled}
    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
      isOn ? 'bg-blue-600' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
        isOn ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

export default function NotificationSettings({
  onSave,
  onCancel,
  settingsRoute = '/settings',
  showFullLayout = false
}: NotificationSettingsProps) {
  const {
    settings,
    loading,
    error,
    success,
    fetchSettings,
    updateAllSettings,
    resetState
  } = useNotificationSettings();

  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Show toast messages
  useEffect(() => {
    if (success) {
      toast.success(success);
      resetState();
    }
    if (error) {
      toast.error(error);
      resetState();
    }
  }, [success, error, resetState]);

  // Update local settings when settings change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const loadSettings = async () => {
    try {
      await fetchSettings();
    } catch (err) {
      console.error('Failed to load notification settings:', err);
    }
  };

  const handleToggle = (category: 'email' | 'inApp', setting: keyof typeof settings.email) => {
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings[category],
        [setting]: !localSettings[category][setting]
      }
    };
    
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Convert object format to array format for backend
      const emailSettingsArray = Object.entries(localSettings.email).map(([type, enabled]) => ({
        type,
        enabled
      }));

      const inAppSettingsArray = Object.entries(localSettings.inApp).map(([type, enabled]) => ({
        type,
        enabled
      }));

      const result = await updateAllSettings({
        email: emailSettingsArray,
        inApp: inAppSettingsArray
      });

      if (result.success) {
        setHasChanges(false);
        
        // Call parent onSave if provided
        if (onSave) {
          onSave(localSettings);
        }
      }
    } catch (err) {
      console.error('Failed to save notification settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original settings
    setLocalSettings(settings);
    setHasChanges(false);
    
    if (onCancel) {
      onCancel();
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all notification settings to default?')) {
      const defaultSettings = {
        email: {
          messages: true,
          offers: true,
          paymentApproval: true,
          newsletter: true
        },
        inApp: {
          messages: true,
          offers: true,
          paymentApproval: true,
          newsletter: true
        }
      };
      
      setLocalSettings(defaultSettings);
      setHasChanges(true);
    }
  };

  const isLoading = loading || saving;

  return (
    <SettingsComponentFactory
      title="Notification settings"
      settingsRoute={settingsRoute}
      showFullLayout={showFullLayout}
      onSave={handleSave}
      onCancel={handleCancel}
      // isSaveDisabled={!hasChanges || isLoading}
      showActionButtons={false}
    >
      <div className="flex flex-col">
        {/* Status Messages */}
        {(success || error) && (
          <div className="px-6 pt-6">
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                ✓ {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                ⚠ {error}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <div className="flex-1 px-6 py-6">
            <div className="space-y-8">
              {/* Email Notifications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900">Email notifications</h2>
                  {/* <span className="text-xs text-gray-500">Receive notifications via email</span> */}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm text-gray-700">Messages</span>
                      {/* <p className="text-xs text-gray-500">New messages and conversations</p> */}
                    </div>
                    <Toggle
                      isOn={localSettings.email.messages}
                      onToggle={() => handleToggle('email', 'messages')}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm text-gray-700">Offers & Promotions</span>
                      {/* <p className="text-xs text-gray-500">Special offers and discounts</p> */}
                    </div>
                    <Toggle
                      isOn={localSettings.email.offers}
                      onToggle={() => handleToggle('email', 'offers')}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm text-gray-700">Payment Approvals</span>
                      {/* <p className="text-xs text-gray-500">Payment status updates</p> */}
                    </div>
                    <Toggle
                      isOn={localSettings.email.paymentApproval}
                      onToggle={() => handleToggle('email', 'paymentApproval')}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm text-gray-700">Newsletter</span>
                      {/* <p className="text-xs text-gray-500">Weekly updates and news</p> */}
                    </div>
                    <Toggle
                      isOn={localSettings.email.newsletter}
                      onToggle={() => handleToggle('email', 'newsletter')}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* In-app Notifications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900">In-app notifications</h2>
                  {/* <span className="text-xs text-gray-500">Notifications within the app</span> */}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm text-gray-700">Messages</span>
                      {/* <p className="text-xs text-gray-500">New messages and conversations</p> */}
                    </div>
                    <Toggle
                      isOn={localSettings.inApp.messages}
                      onToggle={() => handleToggle('inApp', 'messages')}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm text-gray-700">Offers & Promotions</span>
                      {/* <p className="text-xs text-gray-500">Special offers and discounts</p> */}
                    </div>
                    <Toggle
                      isOn={localSettings.inApp.offers}
                      onToggle={() => handleToggle('inApp', 'offers')}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm text-gray-700">Payment Approvals</span>
                      {/* <p className="text-xs text-gray-500">Payment status updates</p> */}
                    </div>
                    <Toggle
                      isOn={localSettings.inApp.paymentApproval}
                      onToggle={() => handleToggle('inApp', 'paymentApproval')}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm text-gray-700">Newsletter</span>
                      {/* <p className="text-xs text-gray-500">Weekly updates and news</p> */}
                    </div>
                    <Toggle
                      isOn={localSettings.inApp.newsletter}
                      onToggle={() => handleToggle('inApp', 'newsletter')}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reset to Defaults Button */}
            {/* <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleResetToDefaults}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
              >
                Reset all to default settings
              </button>
            </div> */}
          </div>
        )}

        {/* Action Buttons - Only show if there are changes */}
        {hasChanges && !loading && (
          <div className="sticky bottom-0 px-6 py-2 bg-white border-t border-gray-100 mt-8">
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 px-6 py-2 bg-[#FE7A3633] text-[#FE7A36] rounded-full font-medium text-md transition-colors hover:bg-[#FE7A3644] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 px-6 py-2 bg-[#3652AD] text-white rounded-full font-medium text-sm transition-colors hover:bg-[#2a418a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </SettingsComponentFactory>
  );
}