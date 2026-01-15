import { useState } from 'react';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../stores/useAuthStore';
import type { AuthResponse } from '../../api/authApi';

// Define interfaces
interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  balance?: number;
  role?: 'user' | 'vendor' | 'admin';
  isVerified?: boolean;
}

interface UseLoginReturn {
  login: (credentials: LoginCredentials, rememberMe?: boolean) => Promise<AuthResponse>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useLogin = (): UseLoginReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);

  const signIn = async (credentials: LoginCredentials, rememberMe: boolean = false): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(credentials);
      const { user, token } = response.data;
      
      // Validate that user and token exist
      if (!user || !token) {
        throw new Error('Invalid response from server: missing user or token');
      }
      
      // Update global state - check your useAuthStore to see the correct signature
      // If login only accepts 2 arguments, remove the third one
      login(user, token); // Remove rememberMe parameter
      
      // If you need to handle rememberMe, you might need to store it separately
      // For example, you could store it in localStorage or another state
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.log(errorMessage)
      throw new Error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    login: signIn,
    loading,
    error,
    clearError
  };
};