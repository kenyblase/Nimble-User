// lib/hooks/useBusinessProfileApi.ts
import { useState, useCallback } from 'react';
import { profileApi, BusinessProfile, UpdateBusinessProfileResponse } from '@/app/lib/api/settings/profileApi';

interface UseBusinessProfileApiReturn {
  updateBusinessProfile: (businessData: BusinessProfile) => Promise<UpdateBusinessProfileResponse>;
  getBusinessProfile: () => Promise<any>;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  resetState: () => void;
}

export const useBusinessProfileApi = (): UseBusinessProfileApiReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateBusinessProfile = useCallback(async (businessData: BusinessProfile): Promise<UpdateBusinessProfileResponse> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await profileApi.updateBusinessProfile(businessData);
      
      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.message);
      }
      
      setIsLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  }, []);

  const getBusinessProfile = useCallback(async (): Promise<any> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await profileApi.getBusinessProfile();
      setIsLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch business profile';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const fetchBusinessProfile = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/check-auth`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch business profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching business profile:', error);
    throw error;
  }
};

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    updateBusinessProfile,
    getBusinessProfile,
    isLoading,
    error,
    success,
    resetState,
  };
};