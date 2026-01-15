// stores/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id?: string;
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  balance?: number;
  pendingBalance?: number;
  role?: 'user' | 'vendor' | 'admin';
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
  setUser: (data: User) => void;
  setToken: (token: string) => void;
  clearUser: () => void;
  login: (userData: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  // ✅ New method to get token safely
  getToken: () => string | null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      hasHydrated: false,

      setUser: (data) => set({ user: data }),

      setToken: (token) => {
        set({ token });
        // Also sync to localStorage for non-React code
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", token);
        }
      },

      clearUser: () => set({ user: null }),

      login: (userData, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", token);
          
          // Store in cookie as backup
          const cookieSettings = [
            `authToken=${token}`,
            "path=/",
            `max-age=${60 * 60 * 24 * 7}`, // 7 days
            "SameSite=Lax",
            ...(process.env.NODE_ENV === "production" ? ["secure"] : []),
          ].join("; ");
          document.cookie = cookieSettings;
        }

        set({
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        console.log("✅ Login successful - user and token stored");
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });

        console.log("✅ Logout successful - all data cleared");
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setHasHydrated: (state) => set({ hasHydrated: state }),

      // ✅ NEW: Safe token getter that checks multiple sources
      getToken: () => {
        const state = get();
        
        // First, try Zustand store
        if (state.token) {
          return state.token;
        }
        
        // If Zustand doesn't have it but we're in browser, check localStorage
        if (typeof window !== "undefined") {
          const localToken = localStorage.getItem("authToken");
          if (localToken) {
            console.log("🔄 Token found in localStorage, syncing to Zustand");
            // Sync back to Zustand
            set({ token: localToken });
            return localToken;
          }
        }
        
        return null;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        console.log("🔄 Rehydrating auth store...");
        return (state, error) => {
          if (error) {
            console.error("❌ Rehydration error:", error);
          } else {
            console.log("✅ Rehydration started");
            
            // Small delay to ensure rehydration completes
            setTimeout(() => {
              if (state) {
                state.isLoading = false;
                state.hasHydrated = true;
                
                // ✅ Double-check token sync
                if (state.token && typeof window !== "undefined") {
                  localStorage.setItem("authToken", state.token);
                } else if (!state.token && typeof window !== "undefined") {
                  // If Zustand doesn't have token but localStorage does, sync it
                  const localToken = localStorage.getItem("authToken");
                  if (localToken) {
                    console.log("🔄 Syncing localStorage token to Zustand");
                    state.token = localToken;
                    state.isAuthenticated = true;
                  }
                }
                
                console.log("✅ Rehydration complete");
                console.log("Token:", state.token ? "✓" : "✗");
                console.log("User:", state.user ? "✓" : "✗");
                console.log("Authenticated:", state.isAuthenticated);
              }
            }, 100);
          }
        };
      },
    }
  )
);

// ✅ Export a helper function to get token safely
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  
  // Try Zustand store first
  const state = useAuthStore.getState();
  if (state.token) return state.token;
  
  // Fallback to localStorage
  return localStorage.getItem("authToken");
};