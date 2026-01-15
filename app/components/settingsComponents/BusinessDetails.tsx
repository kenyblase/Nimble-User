'use client';

import { useState, useEffect } from 'react';
import SettingsComponentFactory from './SettingsComponentFactory';
import { useBusinessProfileApi } from '@/app/lib/hooks/useSettingsApis/useBusinessProfileApi';

interface BusinessDetailsProps {
  initialData?: {
    businessName: string;
    about: string;
    address: string;
    city: string;
    state: string;
  };
  cities?: string[];
  states?: string[];
  onSave?: (data: BusinessDetailsFormData) => void;
  onCancel?: () => void;
  settingsRoute?: string;
  showFullLayout?: boolean;
}

interface BusinessDetailsFormData {
  businessName: string;
  about: string;
  address: string;
  city: string;
  state: string;
}

export default function BusinessDetails({
  initialData = {
    businessName: '',
    about: '',
    address: '',
    city: '',
    state: ''
  },
  cities = ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Benin City'],
  states = ['Lagos', 'FCT', 'Rivers', 'Kano', 'Oyo', 'Edo'],
  onSave,
  onCancel,
  settingsRoute = '/settings',
  showFullLayout = false
}: BusinessDetailsProps) {
  const [formData, setFormData] = useState<BusinessDetailsFormData>(initialData);
  const { 
    updateBusinessProfile, 
    getBusinessProfile, // Make sure this is destructured
    isLoading, 
    error, 
    success, 
    resetState 
  } = useBusinessProfileApi();

  // Load initial data from API on component mount
  useEffect(() => {
    const loadBusinessProfile = async () => {
      try {
        const response = await getBusinessProfile(); // Use getBusinessProfile from hook
        if (response && response.data && response.data.businessDetails) {
          const businessDetails = response.data.businessDetails;
          setFormData({
            businessName: businessDetails.businessName || '',
            about: businessDetails.businessInformation || '', // Note: mapping here
            address: businessDetails.address || '',
            city: businessDetails.city || '',
            state: businessDetails.state || ''
          });
        }
      } catch (err) {
        console.error('Failed to load business profile:', err);
        // You might want to handle this error state in your UI
      }
    };

    loadBusinessProfile();
  }, [getBusinessProfile]); // Add getBusinessProfile to dependency array

  // Rest of your component remains the same...
  // Handle success/error messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        resetState();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, resetState]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Prepare data for API - map "about" to "businessInformation"
      const apiData = {
        businessName: formData.businessName,
        businessInformation: formData.about, // This is the mapping
        address: formData.address,
        city: formData.city,
        state: formData.state
      };

      // Call the API
      const result = await updateBusinessProfile(apiData);

      if (result.success) {
        // If custom onSave is provided, call it
        if (onSave) {
          onSave(formData);
        }
      }
    } catch (err) {
      // Error is already handled in the hook
      console.error('Failed to save business details:', err);
    }
  };

  const handleCancel = () => {
    // Reset form to initial data
    setFormData(initialData);
    
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <SettingsComponentFactory
      title="Business Details"
      settingsRoute={settingsRoute}
      showFullLayout={showFullLayout}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      <div className="flex flex-col">
        {/* Status Messages */}
        {(success || error) && (
          <div className="px-6">
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 px-6 py-6">
          <div className="space-y-6">
            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-900 mb-2">
                Business name
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white disabled:opacity-50"
                placeholder="Enter your business name"
              />
            </div>

            {/* About */}
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-900 mb-2">
                About
              </label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="This will be displayed on your profile"
                rows={4}
                disabled={isLoading}
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base placeholder:text-gray-400 resize-none bg-white disabled:opacity-50"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white disabled:opacity-50"
                placeholder="Enter your business address"
              />
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-900 mb-2">
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base appearance-none bg-white cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.25rem',
                    color: formData.city ? '#1f2937' : '#9ca3af'
                  }}
                >
                  <option value="" disabled>City</option>
                  {cities.map((city) => (
                    <option key={city} value={city} className="text-gray-900">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-900 mb-2">
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base appearance-none bg-white cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.25rem',
                    color: formData.state ? '#1f2937' : '#9ca3af'
                  }}
                >
                  <option value="" disabled>State</option>
                  {states.map((state) => (
                    <option key={state} value={state} className="text-gray-900">
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="px-6 bg-white border-t border-gray-100 mt-[40px]">
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-6 py-2 bg-[#FE7A3633] cursor-pointer text-[#FE7A36] rounded-full font-medium text-base transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 px-6 py-2 bg-[#3652AD] text-white rounded-full font-medium text-base transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>
    </SettingsComponentFactory>
  );
}

// Helper function to fetch business profile (you can move this to your hook)
