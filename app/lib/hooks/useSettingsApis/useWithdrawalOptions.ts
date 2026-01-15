import { useState, useCallback, useEffect } from 'react';
import { profileApi, WithdrawalOption, WithdrawalResponse } from '@/app/lib/api/settings/profileApi'
import toast from 'react-hot-toast';

interface UseWithdrawalOptionsReturn {
  // State
  options: WithdrawalOption[];
  loading: boolean;
  error: string | null;
  success: string | null;
  
  // Actions
  fetchOptions: () => Promise<WithdrawalResponse>;
  addOption: (optionData: Omit<WithdrawalOption, '_id'>) => Promise<WithdrawalResponse>;
  setDefaultOption: (accountNumber: string, bankName: string) => Promise<WithdrawalResponse>;
  deleteOption: (accountNumber: string, bankName: string) => Promise<WithdrawalResponse>;
  
  // Utilities
  resetState: () => void;
  getDefaultOption: () => WithdrawalOption | null;
}

export const useWithdrawalOptions = (): UseWithdrawalOptionsReturn => {
  const [options, setOptions] = useState<WithdrawalOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchOptions = useCallback(async (): Promise<WithdrawalResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await profileApi.getWithdrawalOptions();
      
      if (result.success && result.data?.withdrawalOptions) {
        setOptions(result.data.withdrawalOptions);
      } else {
        setOptions([]);
      }
      
      setLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch withdrawal options';
      setError(errorMessage);
      setLoading(false);
      
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  }, []);

  const addOption = useCallback(async (optionData: Omit<WithdrawalOption, '_id'>): Promise<WithdrawalResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Map frontend field names to backend field names
      const backendOption = {
        ...optionData,
        bankName: optionData.bankName, // Ensure we use bankName for backend
      };
      
      const result = await profileApi.addWithdrawalOption(backendOption);
      
      if (result.success) {
        setSuccess(result.message);
        toast.success(result.message || 'Withdrawal option added successfully');
        // Refresh options
        await fetchOptions();
      } else {
        setError(result.message);
        toast.error(result.message || 'Failed to add withdrawal option');
      }
      
      setLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add withdrawal option';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  }, [fetchOptions]);

  const setDefaultOption = useCallback(async (accountNumber: string, bankName: string): Promise<WithdrawalResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await profileApi.setDefaultWithdrawalOption(accountNumber, bankName);
      
      if (result.success) {
        setSuccess(result.message);
        // Update local state
        setOptions(prev => 
          prev.map(option => ({
            ...option,
            isDefault: option.accountNumber === accountNumber && option.bankName === bankName
          }))
        );
        toast.success(result.message || 'Default withdrawal option updated');
      } else {
        setError(result.message);
        toast.error(result.message || 'Failed to set default option');
      }
      
      setLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to set default withdrawal option';
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

  const deleteOption = useCallback(async (accountNumber: string, bankName: string): Promise<WithdrawalResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await profileApi.deleteWithdrawalOption(accountNumber, bankName);
      
      if (result.success) {
        setSuccess(result.message);
        toast.success(result.message || 'Withdrawal option deleted successfully');
        // Refresh options
        await fetchOptions();
      } else {
        setError(result.message);
        toast.error(result.message || 'Failed to delete withdrawal option');
      }
      
      setLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete withdrawal option';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  }, [fetchOptions]);

  const getDefaultOption = useCallback((): WithdrawalOption | null => {
    return options.find(option => option.isDefault) || null;
  }, [options]);

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
    options,
    loading,
    error,
    success,
    fetchOptions,
    addOption,
    setDefaultOption,
    deleteOption,
    resetState,
    getDefaultOption,
  };
};