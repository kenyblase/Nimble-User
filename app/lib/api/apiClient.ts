import axios from 'axios';
import { getAuthToken } from '../stores/useAuthStore'; // Import the helper function

const apiClient = axios.create({
  baseURL: 'https://nimble-backend-qfg0.onrender.com/api',
  // baseURL: 'http://localhost:4000/api',
  timeout: 80000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ SINGLE request interceptor (removed duplicate)
apiClient.interceptors.request.use(
  (config) => {
    // Get token from your Zustand store (which checks localStorage)
    const token = getAuthToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token attached to request:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No token found for request');
    }
    
    // Don't set Content-Type for FormData (let browser set it)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🔒 Authentication failed - clearing tokens');
      
      // Clear invalid tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token'); // Clean up old token too
      }
      
      // Optional: Redirect to login
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;