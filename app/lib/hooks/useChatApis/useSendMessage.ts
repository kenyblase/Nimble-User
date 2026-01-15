// app/lib/hooks/useChatApis/useSendMessage.ts
import { useState } from 'react';
import { useSocket } from '@/app/lib/hooks/useSocket';

export const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();

  const sendMessage = async (messageData: {
    chatId: string;
    type: 'text' | 'offer' | 'invoice' | 'payment' | 'extra-charge' | 'offer-accepted' | 'payment-request';
    text?: string;
    offer?: {
      amount: number;
      status?: 'sent' | 'accepted' | 'declined';
      proposedBy?: string;
      initialOfferMessageId?: string;
    };
    invoice?: any;
    payment?: any;
    extraCharge?: any;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`https://nimble-backend-qfg0.onrender.com/api/chats/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }

      const result = await response.json();
      const sentMessage = result.data || result;
      
      // Emit socket event for real-time updates
      if (socket) {
        socket.emit('sendMessage', {
          ...sentMessage,
          chatId: messageData.chatId
        });
      }

      return sentMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
};