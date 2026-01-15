import apiClient from './apiClient';

export interface Request {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  maxRating: number;
  image: string;
  location: string;
  isWishlisted: boolean;
  // Add other fields that match your API response
  _id?: string;
  description?: string;
  category?: string;
  condition?: string;
  images?: string[];
  status?: string;
  createdAt?: string;
}

export interface CreateRequestData {
  category: string;
  productImages: File[];
  videoLink?: string;
  title: string;
  location: {
    city: string;
    state: string;
  };
  condition: string;
  description: string;
  price: number;
  isNegotiable: boolean;
}


export const requestsApi = {
  // Create new request
  createRequest: async (requestData: CreateRequestData): Promise<{ 
  success: boolean; 
  message: string; 
  data: Request 
}> => {
  const formData = new FormData();
  
  console.log('📦 Creating request with data:', {
    category: requestData.category,
    title: requestData.title,
    location: requestData.location,
    condition: requestData.condition,
    price: requestData.price,
    isNegotiable: requestData.isNegotiable,
    productImagesCount: requestData.productImages.length,
    videoLink: requestData.videoLink
  });

  // Append basic fields
  formData.append('category', requestData.category);
  formData.append('title', requestData.title);
  formData.append('description', requestData.description);
  formData.append('price', requestData.price.toString());
  formData.append('condition', requestData.condition);
  formData.append('isNegotiable', requestData.isNegotiable.toString());
  
  // Append location as JSON string
  if (requestData.location) {
    formData.append('location', JSON.stringify({
      city: requestData.location.city || '',
      state: requestData.location.state || ''
    }));
  } else {
    console.warn('⚠️ Location data is missing, using empty values');
    formData.append('location', JSON.stringify({
      city: '',
      state: ''
    }));
  }
  
  if (requestData.videoLink) {
    formData.append('videoLink', requestData.videoLink);
  }
  
  // Append images
  requestData.productImages.forEach((image, index) => {
    console.log(`📸 Appending image ${index + 1}:`, image.name, image.type);
    formData.append('productImages', image);
  });

  // Log FormData contents for debugging
  console.log('📋 FormData contents:');
  for (let [key, value] of formData.entries()) {
    if (key === 'productImages') {
      console.log(`  ${key}:`, (value as File).name, (value as File).type);
    } else if (key === 'location') {
      console.log(`  ${key}:`, value); // This will show the JSON string
    } else {
      console.log(`  ${key}:`, value);
    }
  }

  try {
    const response = await apiClient.post('/requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Request creation successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Request creation failed:', error);
    throw error;
  }
},

  // Fetch all requests
  getRequests: async (): Promise<Request[]> => {
    const response = await apiClient.get('/requests/');
    
    console.log('Raw Requests API Response:', response.data);
    
    // Extract requests from the nested structure (adjust based on your API response)
    if (response.data && response.data.success && Array.isArray(response.data.requests)) {
      const requests = response.data.requests;
      console.log('Extracted requests:', requests);
      
      // Transform the API data to match our Request interface
      return requests.map((request: any) => ({
        id: request._id || request.id,
        name: request.name || request.title || 'Untitled Request',
        price: request.price || request.budget || 0,
        originalPrice: request.originalPrice,
        rating: request.averageRating || request.rating || 0,
        maxRating: 5,
        image: request.images && request.images.length > 0 ? request.images[0] : '/placeholder-request.jpg',
        location: request.location ? 
          `${request.location.city || ''}, ${request.location.state || ''}`.trim() : 
          'Location not specified',
        isWishlisted: false,
        description: request.description,
        category: request.category,
        condition: request.condition,
        status: request.status,
        createdAt: request.createdAt
      }));
    } else if (Array.isArray(response.data)) {
      // If the API directly returns an array
      return response.data.map((request: any) => ({
        id: request._id || request.id,
        name: request.name || request.title || 'Untitled Request',
        price: request.price || request.budget || 0,
        originalPrice: request.originalPrice,
        rating: request.averageRating || request.rating || 0,
        maxRating: 5,
        image: request.images && request.images.length > 0 ? request.images[0] : '/placeholder-request.jpg',
        location: request.location ? 
          `${request.location.city || ''}, ${request.location.state || ''}`.trim() : 
          'Location not specified',
        isWishlisted: false,
        description: request.description,
        category: request.category,
        condition: request.condition,
        status: request.status,
        createdAt: request.createdAt
      }));
    } else {
      console.warn('Unexpected requests API response format:', response.data);
      return [];
    }
  },

  // You can add other request-related API calls here
  getRequestById: async (id: string): Promise<Request> => {
    const response = await apiClient.get(`/requests/${id}`);
    return response.data;
  },

  // createRequest: async (requestData: any): Promise<Request> => {
  //   const response = await apiClient.post('/requests/', requestData);
  //   return response.data;
  // },
};