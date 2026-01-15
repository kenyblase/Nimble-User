import { useState, useCallback } from 'react';
import { profileApi, ChangePasswordData, ApiResponse } from '@/app/lib/api/settings/profileApi';
import toast from 'react-hot-toast';

interface UsePasswordReturn {
  loading: boolean;
  error: string | null;
  success: string | null;
  changePassword: (data: ChangePasswordData) => Promise<ApiResponse>;
  resetState: () => void;
}

export const usePassword = (): UsePasswordReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const changePassword = useCallback(async (passwordData: ChangePasswordData): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Frontend validation
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (passwordData.newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      const result = await profileApi.changePassword(passwordData);
      
      if (result.success) {
        setSuccess(result.message);
        toast.success(result.message || 'Password changed successfully');
      } else {
        setError(result.message);
        toast.error(result.message || 'Failed to change password');
      }
      
      setLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
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

  return {
    loading,
    error,
    success,
    changePassword,
    resetState,
  };
};