import { useState } from 'react';
import { requestsApi, CreateRequestData, Request } from '../../api/requestsApi';
interface UseCreateRequestReturn {
  createRequest: (requestData: CreateRequestData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  request: Request | null;
}

export const useCreateRequest = (): UseCreateRequestReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [request, setRequest] = useState<Request | null>(null);

  const createRequest = async (requestData: CreateRequestData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      console.log('🔄 Starting request creation...');
      console.log('📤 Request data being sent:', {
        ...requestData,
        productImages: requestData.productImages.map(img => ({
          name: img.name,
          type: img.type,
          size: img.size
        }))
      });

      // Validate required fields
      if (!requestData.location) {
        throw new Error('Location data is required');
      }

      if (!requestData.location.city || !requestData.location.state) {
        throw new Error('Both city and state are required in location');
      }

      const response = await requestsApi.createRequest(requestData);
      
      console.log('✅ Request creation response received:', response);
      
      if (response.success) {
        setRequest(response.data);
        setSuccess(true);
        console.log('🎉 Request created successfully!');
      } else {
        throw new Error(response.message || 'Failed to create request');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create request';
      setError(errorMessage);
      console.error('❌ Error creating request:', err);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    createRequest,
    loading,
    error,
    success,
    request,
  };
};