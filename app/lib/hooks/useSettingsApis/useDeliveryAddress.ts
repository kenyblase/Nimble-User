import { useState, useCallback, useEffect } from 'react';
import { profileApi, DeliveryAddress, ApiResponse } from '@/app/lib/api/settings/profileApi';
import toast from 'react-hot-toast';

interface UseDeliveryAddressReturn {
  // State
  addresses: DeliveryAddress[];
  loading: boolean;
  error: string | null;
  success: string | null;
  
  // Actions
  fetchAddresses: () => Promise<ApiResponse>;
  addAddress: (addressData: Omit<DeliveryAddress, '_id'>) => Promise<ApiResponse>;
  deleteAddress: (address: string, phoneNumber: string) => Promise<ApiResponse>;
  setDefaultAddress: (address: string, phoneNumber: string) => Promise<ApiResponse>;
  
  // Utilities
  resetState: () => void;
  getDefaultAddress: () => DeliveryAddress | null;
}

export const useDeliveryAddress = (): UseDeliveryAddressReturn => {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchAddresses = useCallback(async (): Promise<ApiResponse> => {
  setLoading(true);
  setError(null);
  setSuccess(null);

  try {
    const result = await profileApi.getDeliveryAddresses();
    
    if (result.success && result.data?.deliveryAddresses) {
      setAddresses(result.data.deliveryAddresses);
    } else {
      setAddresses([]); // Set empty array if no addresses
    }
    
    setLoading(false);
    return result;
  } catch (err: any) {
    const errorMessage = err.message || 'Failed to fetch delivery addresses';
    setError(errorMessage);
    setLoading(false);
    
    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
}, []);

  const addAddress = useCallback(async (addressData: Omit<DeliveryAddress, '_id'>): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Transform phone to phoneNumber for backend
      const backendAddress = {
        ...addressData,
        phoneNumber: addressData.phoneNumber,
      };
      
      const result = await profileApi.addDeliveryAddress(backendAddress);
      
      if (result.success) {
        setSuccess(result.message);
        // Refresh addresses
        await fetchAddresses();
      } else {
        setError(result.message);
      }
      
      setLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add delivery address';
      setError(errorMessage);
      setLoading(false);
      
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  }, [fetchAddresses]);

  const deleteAddress = useCallback(async (address: string, phoneNumber: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await profileApi.deleteDeliveryAddress(address, phoneNumber);
      
      if (result.success) {
        setSuccess(result.message);
        // Refresh addresses
        await fetchAddresses();
      } else {
        setError(result.message);
      }
      
      setLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete delivery address';
      setError(errorMessage);
      setLoading(false);
      
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  }, [fetchAddresses]);

  const setDefaultAddress = useCallback(async (address: string, phoneNumber: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await profileApi.setDefaultDeliveryAddress(address, phoneNumber);
      
      if (result.success) {
        setSuccess(result.message);
        // Update local state
        setAddresses(prev => 
          prev.map(addr => ({
            ...addr,
            isDefault: addr.address === address && addr.phoneNumber === phoneNumber
          }))
        );
      } else {
        setError(result.message);
      }
      
      setLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to set default address';
      setError(errorMessage);
      setLoading(false);
      
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  }, []);

  const getDefaultAddress = useCallback((): DeliveryAddress | null => {
    return addresses.find(addr => addr.isDefault) || null;
  }, [addresses]);

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
    addresses,
    loading,
    error,
    success,
    fetchAddresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    resetState,
    getDefaultAddress,
  };
};