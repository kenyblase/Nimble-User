import { useState } from 'react';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../stores/useAuthStore';
import type { AuthResponse } from '../../api/authApi';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface UseRegisterReturn {
  register: (userData: RegisterData) => Promise<AuthResponse>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useRegister = (): UseRegisterReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.register(userData);
      const { user, token } = response.data;
      
      // Validate that user and token exist
      if (!user || !token) {
        throw new Error('Invalid response from server: missing user or token');
      }
      
      // Auto-login after registration
      login(user, token);
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
    clearError: () => setError(null)
  };
};