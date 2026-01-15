// hooks/useCheckAuth.ts
import { useEffect } from 'react';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../stores/useAuthStore';

export const useCheckAuth = () => {
  const {
    user,
    token,
    login,
    logout,
    setLoading,
    isLoading,
    isAuthenticated,
    hasHydrated,
  } = useAuthStore();
-
  useEffect(() => {
    if (!hasHydrated) {
      console.log('⏳ Waiting for store hydration...');
      return;
    }

    const checkAuthStatus = async () => {
      console.log(
        '🔍 Auth Check - Token:',
        token ? 'exists' : 'missing',
        'User:',
        user ? 'exists' : 'missing'
      );

      if (!token) {
        console.log('❌ No token - not authenticated');
        logout();
        setLoading(false);
        return;
      }

      if (token && user && isAuthenticated) {
        console.log('✅ Already authenticated with user data');
        setLoading(false);
        return;
      }

      if (token && !user) {
        try {
          console.log('🔄 Token exists but no user data - fetching...');
          setLoading(true);
          const response = await authApi.checkAuth();
          const userData = response.data;
          login(userData, token);
          console.log('✅ User data fetched and logged in');
        } catch (error: any) {
          console.error('❌ Failed to fetch user data:', error);
          console.log('⚠️ Cannot verify token - logging out');
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [hasHydrated, token, user, isAuthenticated, login, logout, setLoading]);

  // Return the complete auth state
  return { 
    isLoading, 
    user,
    token,
    isAuthenticated,
    hasHydrated 
  };
};