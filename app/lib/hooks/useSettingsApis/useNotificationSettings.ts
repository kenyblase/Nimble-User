import { useState, useCallback, useEffect } from 'react';
import { 
  profileApi, 
  NotificationSetting, 
  NotificationSettings as INotificationSettings,
  NotificationResponse 
} from '@/app/lib/api/settings/profileApi';
import toast from 'react-hot-toast';

interface UseNotificationSettingsReturn {
  // State
  settings: INotificationSettings;
  loading: boolean;
  error: string | null;
  success: string | null;
  
  // Actions
  fetchSettings: () => Promise<NotificationResponse>;
  updateEmailSettings: (settings: NotificationSetting[]) => Promise<NotificationResponse>;
  updateInAppSettings: (settings: NotificationSetting[]) => Promise<NotificationResponse>;
  updateAllSettings: (settings: { email: NotificationSetting[]; inApp: NotificationSetting[] }) => Promise<NotificationResponse>;
  
  // Utilities
  resetState: () => void;
}

export const useNotificationSettings = (): UseNotificationSettingsReturn => {
  const [settings, setSettings] = useState<INotificationSettings>({
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Helper function to convert array format to object format

  // Helper function to convert string array to object format
const arrayToObjectFormat = (settingsArray: any[]) => {
  console.log('🔄 Converting array to object:', settingsArray);
  
  if (!Array.isArray(settingsArray)) {
    console.log('⚠️ Not an array, returning defaults');
    return {
      messages: true,
      offers: true,
      paymentApproval: true,
      newsletter: true
    };
  }
  
  // Check if it's an array of objects
  if (settingsArray.length > 0 && typeof settingsArray[0] === 'object') {
    console.log('📦 Array of objects detected');
    const result = {
      messages: true,
      offers: true,
      paymentApproval: true,
      newsletter: true
    };
    
    settingsArray.forEach((setting: any) => {
      if (setting.type && setting.type in result) {
        result[setting.type as keyof typeof result] = setting.enabled;
      }
    });
    
    return result;
  }
  
  // Assume it's an array of strings (enabled notification types)
  console.log('🔤 Array of strings detected:', settingsArray);
  const enabledTypes = settingsArray.filter(item => typeof item === 'string');
  
  return {
    messages: enabledTypes.includes('messages'),
    offers: enabledTypes.includes('offers'),
    paymentApproval: enabledTypes.includes('paymentApproval'),
    newsletter: enabledTypes.includes('newsletter')
  };
};

// Helper function to convert object format to string array
const objectToArrayFormat = (settingsObj: any): string[] => {
  console.log('🔄 Converting object to string array:', settingsObj);
  
  const enabledTypes: string[] = [];
  
  Object.entries(settingsObj).forEach(([type, enabled]) => {
    if (enabled === true) {
      enabledTypes.push(type);
    }
  });
  
  console.log('📤 Enabled types:', enabledTypes);
  return enabledTypes;
};



  const fetchSettings = useCallback(async (): Promise<NotificationResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await profileApi.getNotificationSettings();
      
      if (result.success) {
        console.log('Notification settings API result:', result);
        
        // Convert array format to object format for frontend
        const emailSettings = arrayToObjectFormat(result.data?.emailSettings || []);
        const appSettings = arrayToObjectFormat(result.data?.appSettings || []);
        
        console.log('Converted settings:', { emailSettings, appSettings });
        
        setSettings({
          email: emailSettings,
          inApp: appSettings
        });
      } else {
        console.log('Failed to fetch notification settings:', result.message);
        setError(result.message);
      }
      
      setLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch notification settings';
      console.error('Error fetching notification settings:', err);
      setError(errorMessage);
      setLoading(false);
      
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  }, []);

  const updateEmailSettings = useCallback(async (settingsArray: NotificationSetting[]): Promise<NotificationResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await profileApi.updateEmailNotifications(settingsArray);
      
      if (result.success) {
        setSuccess(result.message);
        toast.success(result.message || 'Email notification settings updated');
        
        // Update local state with the new settings
        const updatedEmailSettings = arrayToObjectFormat(settingsArray);
        setSettings(prev => ({
          ...prev,
          email: updatedEmailSettings
        }));
      } else {
        setError(result.message);
        toast.error(result.message || 'Failed to update email notifications');
      }
      
      setLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update email notifications';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  }, []);

  const updateInAppSettings = useCallback(async (settingsArray: NotificationSetting[]): Promise<NotificationResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await profileApi.updateInAppNotifications(settingsArray);
      
      if (result.success) {
        setSuccess(result.message);
        toast.success(result.message || 'In-app notification settings updated');
        
        // Update local state with the new settings
        const updatedAppSettings = arrayToObjectFormat(settingsArray);
        setSettings(prev => ({
          ...prev,
          inApp: updatedAppSettings
        }));
      } else {
        setError(result.message);
        toast.error(result.message || 'Failed to update in-app notifications');
      }
      
      setLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update in-app notifications';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  }, []);

  const updateAllSettings = useCallback(async (settingsData: { 
    email: NotificationSetting[]; 
    inApp: NotificationSetting[] 
  }): Promise<NotificationResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await profileApi.updateAllNotificationSettings(settingsData);
      
      if (result.success) {
        setSuccess(result.message);
        toast.success(result.message || 'All notification settings updated');
        
        // Update local state with the new settings
        const updatedEmailSettings = arrayToObjectFormat(settingsData.email);
        const updatedAppSettings = arrayToObjectFormat(settingsData.inApp);
        
        setSettings({
          email: updatedEmailSettings,
          inApp: updatedAppSettings
        });
      } else {
        setError(result.message);
        toast.error(result.message || 'Failed to update notification settings');
      }
      
      setLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update notification settings';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  }, []);

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  // Clear success/error messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        resetState();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, resetState]);

  return {
    settings,
    loading,
    error,
    success,
    fetchSettings,
    updateEmailSettings,
    updateInAppSettings,
    updateAllSettings,
    resetState,
  };
};