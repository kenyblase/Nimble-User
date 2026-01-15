// hooks/useChat.ts - Fixed version
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[];
}

export interface Chat {
  _id: string;
  buyer: User;
  seller: User;
  product: Product;
  lastMessage: string;
  lastMessageSentAt: string;
  isReported: boolean;
  adminInvolved: string[];
  updatedAt: string;
  createdAt: string;
}

interface UseChatReturn {
  chat: Chat | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useChat = (chatId: string | null): UseChatReturn => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ Call hook unconditionally
    const { token, hasHydrated } = useAuthStore();


  const fetchChat = async () => {
    if (!chatId) {
      setLoading(false);
      setError('No chat ID provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // ✅ Use the safe token getter
      const authToken = useAuthStore.getState().getToken();
      
      console.log('🔐 Chat token check:', {
        hasHydrated,
        zustandToken: token ? '✓' : '✗',
        safeToken: authToken ? '✓' : '✗'
      });

      if (!authToken) {
        if (!hasHydrated) {
          console.log('🔄 Store still hydrating, waiting...');
          setTimeout(() => {
            fetchChat();
          }, 100);
          return;
        }
        throw new Error('No authentication token found');
      }

      const backendUrl = 'https://nimble-backend-qfg0.onrender.com';
      // const backendUrl = 'http://localhost:4000';
      
      console.log(`📡 Making request to: ${backendUrl}/api/chats/${chatId}`);
      
      const response = await fetch(`${backendUrl}/api/chats/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📨 Response status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Chat not found with ID: ${chatId}`);
        } else if (response.status === 403) {
          throw new Error('Access denied to this chat');
        } else if (response.status === 401) {
          throw new Error('Authentication failed - please log in again');
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      const responseText = await response.text();
      console.log('📨 Raw response text:', responseText);

      if (!responseText) {
        throw new Error('Empty response from server');
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('📦 Parsed response data:', data);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      // Handle different possible response structures
      if (data.success) {
        if (data.data) {
          if (data.data.chat) {
            console.log('✅ Found chat in data.data.chat');
            setChat(data.data.chat);
          } else if (data.data._id) {
            console.log('✅ Found chat in data.data');
            setChat(data.data);
          } else {
            console.log('✅ Found chat in data.data (direct)');
            setChat(data.data);
          }
        } else {
          if (data.chat) {
            console.log('✅ Found chat in data.chat');
            setChat(data.chat);
          } else {
            console.log('✅ Found chat in data (root)');
            setChat(data);
          }
        }
        setError(null);
      } else {
        throw new Error(data.message || `API returned success: false - ${JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error('❌ Error fetching chat:', err);
      setError(err instanceof Error ? err.message : 'Failed to load chat');
      setChat(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
  }, [chatId, token]); // ✅ Add token to dependency array

  return {
    chat,
    loading,
    error,
    refetch: fetchChat,
  };
};