import { useAuthStore } from "../../stores/useAuthStore";
import { authApi } from "../../api/authApi";
import { useCallback } from "react";

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  const signOut = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      logout();
    }
  }, [logout]);

  return { signOut };
};