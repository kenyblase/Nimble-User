// lib/api/settings/profileApi.ts
import apiClient from '../apiClient';

// Personal Profile Interfaces
export interface UserProfile {
  _id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  profilePic?: string;
  email?: string;
  businessDetails?: BusinessProfile;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetProfileResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}

// Business Profile Interfaces
export interface BusinessProfile {
  businessName: string;
  businessInformation: string;
  address: string;
  city: string;
  state: string;
}

export interface UpdateBusinessProfileResponse {
  success: boolean;
  message: string;
  data?: {
    user?: any;
  };
}

export interface DeliveryAddress {
  _id?: string;
  name: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  isDefault: boolean;
  zipcode?: string;
}

export interface DeliveryAddressResponse {
  success: boolean;
  message: string;
  data?: {
    deliveryAddresses: DeliveryAddress[];
  };
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}


export interface WithdrawalOption {
  _id?: string;
  name?: string; // Optional: your backend might not require name
  bankName: string; // Backend uses bankName, not provider
  accountNumber: string;
  isDefault: boolean;
}

export interface WithdrawalResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export type NotificationSetting = {
  type: string;
  enabled: boolean;
  _id?: string;
};

export interface EmailNotificationSettings {
  messages: boolean;
  offers: boolean;
  paymentApproval: boolean;
  newsletter: boolean;
}

export interface InAppNotificationSettings {
  messages: boolean;
  offers: boolean;
  paymentApproval: boolean;
  newsletter: boolean;
}

export interface NotificationSettings {
  email: EmailNotificationSettings;
  inApp: InAppNotificationSettings;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}


export const profileApi = {
  // Get user profile
  getProfile: async (): Promise<GetProfileResponse> => {
    try {
      const response = await apiClient.get('/auth/check-auth');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    gender?: string;
    profilePic?: string;
  }): Promise<UpdateProfileResponse> => {
    try {
      const response = await apiClient.post('/settings/profile', data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Get business profile
  getBusinessProfile: async (): Promise<UpdateBusinessProfileResponse> => {
    try {
      const response = await apiClient.get('/auth/check-auth');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching business profile:', error);
      throw error;
    }
  },

  // Update business profile
  updateBusinessProfile: async (data: BusinessProfile): Promise<UpdateBusinessProfileResponse> => {
    try {
      const response = await apiClient.post('/settings/business-profile', data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating business profile:', error);
      throw error;
    }
  },

 getDeliveryAddresses: async (): Promise<DeliveryAddressResponse> => {
  try {
    const response = await apiClient.get('/auth/check-auth');
    
    // Check if user and deliveryAddress exist in response
    const user = response.data?.user;
    const deliveryAddresses = user?.deliveryAddress || [];
    
    return {
      success: true,
      message: 'Delivery addresses fetched successfully',
      data: {
        deliveryAddresses: deliveryAddresses
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch delivery addresses',
      error: error.response?.data?.error || error.message,
    };
  }
},

  addDeliveryAddress: async (newAddress: Omit<DeliveryAddress, '_id'>): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post('/settings/add-delivery-address', {
        newAddress: {
          ...newAddress,
          phoneNumber: newAddress.phoneNumber,
        }
      });
      return {
        success: true,
        message: response.data.message || 'Address added successfully',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add delivery address',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  updateDeliveryAddress: async (addressId: string, addressData: Partial<DeliveryAddress>): Promise<DeliveryAddressResponse> => {
    try {
      const response = await apiClient.put(`/user/delivery-addresses/${addressId}`, addressData);
      return {
        success: true,
        message: response.data.message || 'Address updated successfully',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update delivery address',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  deleteDeliveryAddress: async (address: string, phoneNumber: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.delete('/settings/delete-delivery-address', {
        data: { address, phoneNumber }
      });
      return {
        success: true,
        message: response.data.message || 'Address deleted successfully',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete delivery address',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  setDefaultDeliveryAddress: async (address: string, phoneNumber: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post('/set-delivery-address', {
        address,
        phoneNumber
      });
      return {
        success: true,
        message: response.data.message || 'Default address updated successfully',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to set default address',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  // Get complete user data (personal + business)
  getUserData: async (): Promise<{
    personal: GetProfileResponse;
    business: UpdateBusinessProfileResponse;
  }> => {
    try {
      const [personal, business] = await Promise.all([
        profileApi.getProfile(),
        profileApi.getBusinessProfile()
      ]);
      
      return { personal, business };
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  },

  changePassword: async (passwordData: ChangePasswordData): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post('/settings/change-password', passwordData);
      return {
        success: true,
        message: response.data.message || 'Password changed successfully',
        data: response.data,
      };
    } catch (error: any) {
      console.error('Change password error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to change password',
        error: error.response?.data?.error || error.message,
      };
    }
  },

    getWithdrawalOptions: async (): Promise<WithdrawalResponse> => {
  try {
    // Fetch user profile which contains withdrawalOptions
    const response = await apiClient.get('/auth/check-auth');
    
    // Check if the response has the expected structure
    console.log('Withdrawal options API response:', response.data);
    
    const user = response.data?.user;
    const withdrawalOptions = user?.withdrawalOptions || [];
    
    console.log('Extracted withdrawal options:', withdrawalOptions);
    
    return {
      success: true,
      message: 'Withdrawal options fetched successfully',
      data: {
        withdrawalOptions: withdrawalOptions,
        user: user
      },
    };
  } catch (error: any) {
    console.error('Error fetching withdrawal options:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch withdrawal options',
      error: error.response?.data?.error || error.message,
    };
  }
},

  addWithdrawalOption: async (newOption: Omit<WithdrawalOption, '_id'>): Promise<WithdrawalResponse> => {
    try {
      const response = await apiClient.post('/settings/add-withdrawal-option', {
        newOption: {
          bankName: newOption.bankName, // Note: backend uses bankName, not provider
          accountNumber: newOption.accountNumber,
          isDefault: newOption.isDefault
        }
      });
      
      return {
        success: true,
        message: response.data.message || 'Withdrawal option added successfully',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to add withdrawal option',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  setDefaultWithdrawalOption: async (accountNumber: string, bankName: string): Promise<WithdrawalResponse> => {
    try {
      const response = await apiClient.post('/settings/set-withdrawal-option', {
        accountNumber,
        bankName
      });
      
      return {
        success: true,
        message: response.data.message || 'Default withdrawal option set successfully',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to set default withdrawal option',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  deleteWithdrawalOption: async (accountNumber: string, bankName: string): Promise<WithdrawalResponse> => {
    try {
      const response = await apiClient.delete('/settings/delete-withdrawal-option', {
        data: { accountNumber, bankName }
      });
      
      return {
        success: true,
        message: response.data.message || 'Withdrawal option deleted successfully',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete withdrawal option',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  getNotificationSettings: async (): Promise<NotificationResponse> => {
  try {
    console.log('🔄 Fetching notification settings...');
    const response = await apiClient.get('/auth/check-auth');
    
    const user = response.data?.user;
    console.log('📋 User data received:', {
      userId: user?._id,
      hasEmailSettings: !!user?.EmailNotificationSettings,
      hasAppSettings: !!user?.AppNotificationSettings,
      emailSettings: user?.EmailNotificationSettings,
      appSettings: user?.AppNotificationSettings
    });
    
    const emailSettings = user?.EmailNotificationSettings || [];
    const appSettings = user?.AppNotificationSettings || [];
    
    console.log('🔍 Raw settings:', {
      emailSettings,
      appSettings,
      emailType: typeof emailSettings,
      appType: typeof appSettings,
      isEmailArray: Array.isArray(emailSettings),
      isAppArray: Array.isArray(appSettings)
    });
    
    // Helper function to convert string array to object format
    const convertStringArrayToObject = (settingsArray: any[]): any => {
      if (!Array.isArray(settingsArray)) {
        console.log('⚠️ Not an array, returning defaults');
        return {
          messages: true,
          offers: true,
          paymentApproval: true,
          newsletter: true
        };
      }
      
      // If it's an array of strings (enabled notification types)
      const enabledTypes = settingsArray.filter(item => typeof item === 'string');
      
      console.log('🔢 Enabled types found:', enabledTypes);
      
      return {
        messages: enabledTypes.includes('messages'),
        offers: enabledTypes.includes('offers'),
        paymentApproval: enabledTypes.includes('paymentApproval'),
        newsletter: enabledTypes.includes('newsletter')
      };
    };
    
    const emailSettingsObj = convertStringArrayToObject(emailSettings);
    const appSettingsObj = convertStringArrayToObject(appSettings);
    
    console.log('🎯 Converted settings:', {
      email: emailSettingsObj,
      inApp: appSettingsObj
    });
    
    return {
      success: true,
      message: 'Notification settings fetched successfully',
      data: {
        emailSettings: emailSettings,
        appSettings: appSettings,
        emailSettingsObj,
        appSettingsObj,
        user: user
      },
    };
  } catch (error: any) {
    console.error('❌ Error fetching notification settings:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch notification settings',
      error: error.response?.data?.error || error.message,
    };
  }
},

updateEmailNotifications: async (updatedNotifications: NotificationSetting[]): Promise<NotificationResponse> => {
  try {
    console.log('🔄 Sending email notifications:', updatedNotifications);
    
    // Convert array of objects to array of enabled notification types (strings)
    const enabledNotifications = updatedNotifications
  .filter(setting => setting.enabled)
  .map(setting => setting.type);
    
    console.log('📤 Converted to strings:', enabledNotifications);
    
    const response = await apiClient.post('/settings/email-notifications', {
      updatedNotifications: enabledNotifications  // Send array of strings, not objects
    });
    
    console.log('✅ Email notifications updated successfully:', response.data);
    
    return {
      success: true,
      message: response.data.message || 'Email notification settings updated successfully',
      data: response.data,
    };
  } catch (error: any) {
    console.error('❌ Error updating email notifications:', {
      error: error.response?.data,
      status: error.response?.status,
      dataSent: updatedNotifications
    });
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update email notifications',
      error: error.response?.data?.error || error.message,
    };
  }
},

updateInAppNotifications: async (updatedNotifications: NotificationSetting[]): Promise<NotificationResponse> => {
  try {
    console.log('🔄 Sending in-app notifications:', updatedNotifications);
    
    // Convert array of objects to array of enabled notification types (strings)
    const enabledNotifications = updatedNotifications
  .filter(setting => setting.enabled)
  .map(setting => setting.type);
    
    console.log('📤 Converted to strings:', enabledNotifications);
    
    const response = await apiClient.post('/settings/app-notifications', {
      updatedNotifications: enabledNotifications  // Send array of strings, not objects
    });
    
    console.log('✅ In-app notifications updated successfully:', response.data);
    
    return {
      success: true,
      message: response.data.message || 'In-app notification settings updated successfully',
      data: response.data,
    };
  } catch (error: any) {
    console.error('❌ Error updating in-app notifications:', {
      error: error.response?.data,
      status: error.response?.status,
      dataSent: updatedNotifications
    });
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update in-app notifications',
      error: error.response?.data?.error || error.message,
    };
  }
},


  updateAllNotificationSettings: async (settings: {
    email: NotificationSetting[];
    inApp: NotificationSetting[];
  }): Promise<NotificationResponse> => {
    try {
      // Update both email and in-app notifications
      const [emailResult, appResult] = await Promise.all([
        profileApi.updateEmailNotifications(settings.email),
        profileApi.updateInAppNotifications(settings.inApp)
      ]);

      if (emailResult.success && appResult.success) {
        return {
          success: true,
          message: 'All notification settings updated successfully',
          data: {
            email: emailResult.data,
            inApp: appResult.data
          },
        };
      } else {
        return {
          success: false,
          message: emailResult.message || appResult.message || 'Failed to update some notification settings',
          error: emailResult.error || appResult.error,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to update notification settings',
        error: error.message,
      };
    }
  },
  
};