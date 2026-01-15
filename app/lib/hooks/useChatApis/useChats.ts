import { useState, useEffect } from 'react';

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

interface UseChatsReturn {
  chats: Chat[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useChats = (): UseChatsReturn => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = async () => {
    try {
      setLoading(true);
      setError(null);

      const authToken = localStorage.getItem('token');
      if (!authToken) {
        setError('Please log in to view your chats');
        setLoading(false);
        return;
      }

      const backendUrl = 'https://nimble-backend-qfg0.onrender.com';

            // const backendUrl = 'http://localhost:4000';

      
      const response = await fetch(`${backendUrl}/api/chats`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Chats response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in again');
        } else if (response.status === 404) {
          setError('Chats endpoint not found');
        } else {
          throw new Error(`Failed to fetch chats: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      console.log('Chats data received:', data);
      
      if (data.success && data.data) {
        setChats(data.data);
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return {
    chats,
    loading,
    error,
    refetch: fetchChats,
  };
};