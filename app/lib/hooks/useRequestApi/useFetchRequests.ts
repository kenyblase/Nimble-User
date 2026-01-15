import { useState, useEffect } from 'react';
import { requestsApi, Request } from '../../api/requestsApi';

export const useFetchRequests = () => {
  const [data, setData] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const requests = await requestsApi.getRequests();
      
      console.log('Transformed requests:', requests);
      
      if (Array.isArray(requests)) {
        setData(requests);
      } else {
        console.warn('Expected array but got:', requests);
        setData([]);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requests');
      console.error('Error fetching requests:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const refetch = () => {
    fetchRequests();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};