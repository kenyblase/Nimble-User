import { useQuery } from '@tanstack/react-query';

export const useChatMessages = (chatId: string) => {
  return useQuery({
    queryKey: ['chatMessages', chatId],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // const backendUrl = 'http://localhost:4000';
      const backendUrl = 'https://nimble-backend-qfg0.onrender.com';

      const response = await fetch(`${backendUrl}/api/chats/messages/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to fetch messages: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    },
    enabled: !!chatId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};