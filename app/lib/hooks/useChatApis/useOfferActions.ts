// hooks/useOfferActions.ts
import { useState } from 'react';
import { useAuthStore } from '@/app/lib/stores/useAuthStore';

interface OfferResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export const useOfferActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuthStore();

  const acceptOffer = async (messageId: string, bestPrice?: number) => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      
      const response = await fetch(`${backendUrl}/api/chats/messages/${messageId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          bestPrice: bestPrice || undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept offer');
      }

      const result: OfferResponse = await response.json();
      return result.data || result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept offer';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const declineOffer = async (messageId: string, bestPrice?: number) => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      
      const response = await fetch(`${backendUrl}/api/chats/messages/${messageId}/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          bestPrice: bestPrice || undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to decline offer');
      }

      const result: OfferResponse = await response.json();
      return result.data || result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decline offer';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { acceptOffer, declineOffer, loading, error };
};