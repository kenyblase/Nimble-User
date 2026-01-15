// api/authApi.ts
import apiClient from "./apiClient";

// Define more specific interfaces
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  // Add other user properties
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: User;
  message?: string;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
}

export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // If login successful, store the token
    if (response.data.token || response.data.accessToken) {
      const token = response.data.token || response.data.accessToken;
      storeToken(token!);
    }
    
    return response;
  },

  // Register new user
  register: async (userData: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<AuthResponse>('/auth/signup', userData);
    
    // If registration includes auto-login, store token
    if (response.data.token || response.data.accessToken) {
      const token = response.data.token || response.data.accessToken;
      storeToken(token!);
    }
    
    return response;
  },

  // Logout user
  logout: async (): Promise<ApiResponse> => {
    // Clear token first
    clearToken();
    return apiClient.post('/auth/logout');
  },

  // Check if user is authenticated
checkAuth: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response;
    } catch (error: any) {
      console.error('Auth check failed:', error);
      // Clear token if auth check fails
      if (error.response?.status === 401) {
        clearToken();
      }
      throw error;
    }
  },
  
  // Refresh token
  refreshToken: (token: string): Promise<ApiResponse<AuthResponse>> => 
    apiClient.post<AuthResponse>('/auth/refresh', { token }),

  // Forgot password
  forgotPassword: (email: string): Promise<ApiResponse<{ message: string }>> => 
    apiClient.post<{ message: string }>('/auth/forgot-password', { email }),

  // Reset password
  resetPassword: (token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> => 
    apiClient.post<{ message: string }>('/auth/reset-password', { token, newPassword }),
};

// Token storage functions (same as above)
const storeToken = (token: string): void => {
  try {
    if (typeof window === 'undefined') {
      console.log('⚠️ Not in browser environment, skipping token storage');
      return;
    }

    localStorage.setItem('token', token);
    
    const cookieSettings = [
      `token=${token}`,
      'path=/',
      `max-age=${60 * 60 * 24 * 7}`,
      'SameSite=Lax',
      ...(process.env.NODE_ENV === 'production' ? ['secure'] : []),
    ].join('; ');
    
    document.cookie = cookieSettings;
    
    console.log('✅ Token stored in localStorage and cookies');
  } catch (error) {
    console.error('❌ Error storing token:', error);
  }
};

const clearToken = (): void => {
  try {
    if (typeof window === 'undefined') {
      console.log('⚠️ Not in browser environment, skipping token clearance');
      return;
    }

    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log('✅ Token cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing token:', error);
  }
};

// Get token function
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem('token');
    if (localToken) return localToken;
    
    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    return cookieToken || null;
  }
  return null;
};