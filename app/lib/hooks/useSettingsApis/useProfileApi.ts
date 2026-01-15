// lib/hooks/useProfileApi.ts
import { useState, useCallback } from 'react';
import { 
  profileApi, 
  UserProfile, 
  GetProfileResponse, 
  BusinessProfile,
  UpdateBusinessProfileResponse 
} from '@/app/lib/api/settings/profileApi';

interface UserBusinessProfile extends BusinessProfile {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useProfileApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [businessProfile, setBusinessProfile] = useState<UserBusinessProfile | null>(null);

  // Get user profile
  const getProfile = useCallback(async (): Promise<GetProfileResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileApi.getProfile();
      
      if (response.success && response.user) {
        setUserProfile(response.user);
      }
      
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch profile';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  // Get business profile
    // Get business profile
  const getBusinessProfile = useCallback(async (): Promise<UpdateBusinessProfileResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileApi.getBusinessProfile();
      
      if (response.success && response.data?.user?.businessDetails) {
        const businessDetails = response.data.user.businessDetails;
        
        // Transform to match BusinessProfile interface
        const transformedProfile: UserBusinessProfile = {
          businessName: businessDetails.businessName || '',
          businessInformation: businessDetails.businessInformation || '',
          address: businessDetails.address || '',
          city: businessDetails.city || '',
          state: businessDetails.state || '',
          _id: businessDetails._id,
          createdAt: businessDetails.createdAt,
          updatedAt: businessDetails.updatedAt
        };
        
        setBusinessProfile(transformedProfile);
      } else if (response.success && response.data) {
        // Handle case where data is directly in response
        const data = response.data as any;
        
        // Check if data has businessDetails structure
        if (data.businessName || data.businessInformation || data.address) {
          const transformedProfile: UserBusinessProfile = {
            businessName: data.businessName || '',
            businessInformation: data.businessInformation || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            _id: data._id,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          };
          
          setBusinessProfile(transformedProfile);
        } else {
          // If data doesn't match expected structure, set to null
          setBusinessProfile(null);
        }
      } else {
        // No business profile data found
        setBusinessProfile(null);
      }
      
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch business profile';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    gender?: string;
    profilePic?: string; // This should be the full base64 data URL
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileApi.updateProfile(data);
      
      if (response.success && response.user) {
        setUserProfile(response.user);
      }
      
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  // Update business profile
  const updateBusinessProfile = useCallback(async (data: BusinessProfile) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileApi.updateBusinessProfile(data);
      
      if (response.success) {
        // Update local state with new data
        const updatedProfile: UserBusinessProfile = {
          businessName: data.businessName,
          businessInformation: data.businessInformation,
          address: data.address,
          city: data.city,
          state: data.state,
          updatedAt: new Date().toISOString()
        };
        
        setBusinessProfile(prev => ({
          ...prev,
          ...updatedProfile
        }));
      }
      
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update business profile';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  // Upload profile picture
  const uploadProfilePicture = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert file to base64 for backend
      const base64Image = await convertFileToBase64(file);
      
      // Update profile with base64 image
      const response = await profileApi.updateProfile({ 
        profilePic: base64Image 
      });
      
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to upload image';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  // Remove profile picture
  const removeProfilePicture = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Send null or empty string to indicate removal
      const response = await profileApi.updateProfile({ 
        profilePic: '' 
      });
      
      if (response.success && response.user) {
        setUserProfile(response.user);
      }
      
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to remove profile picture';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  // Helper function to convert File to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data:image/...;base64, prefix if not needed by backend
        const base64Data = base64String.split(',')[1] || base64String;
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Format phone number to include +234 prefix
  const formatPhoneNumber = (phoneNumber: string | null | undefined): string => {
    if (!phoneNumber) return '+234';
    
    // Remove any non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');
    
    // If it's 10 digits (0701234567), add +234
    if (digits.length === 10) {
      return `+234${digits}`;
    }
    
    // If it's 11 digits and starts with 0 (07012345678)
    if (digits.length === 11 && digits.startsWith('0')) {
      return `+234${digits.substring(1)}`;
    }
    
    // If it's already in +234 format
    if (digits.length === 13 && digits.startsWith('234')) {
      return `+${digits}`;
    }
    
    // If it already has +, return as is
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }
    
    // Default: add + if not present
    return `+${digits}`;
  };

  // Extract just the digits for storage
  const normalizePhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/\D/g, '');
  };

  // Get phone digits only (for display)
  const getPhoneDigits = (phoneNumber: string): string => {
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Remove country code for display
    if (digits.startsWith('234') && digits.length === 13) {
      return digits.substring(3);
    }
    
    return digits;
  };

  // Clear error message
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear all states
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setUserProfile(null);
    setBusinessProfile(null);
  }, []);

  return {
    // States
    loading,
    error,
    userProfile,
    businessProfile,
    
    // Profile methods
    getProfile,
    updateProfile,
    uploadProfilePicture,
    removeProfilePicture,
    
    // Business profile methods
    getBusinessProfile,
    updateBusinessProfile,
    
    // Helper methods
    formatPhoneNumber,
    normalizePhoneNumber,
    getPhoneDigits,
    convertFileToBase64,
    
    // Utility methods
    clearError,
    reset
  };
};