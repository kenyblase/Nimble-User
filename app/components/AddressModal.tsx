'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDeliveryAddress } from '@/app/lib/hooks/useSettingsApis/useDeliveryAddress';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAddress?: {
    id: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    isDefault: boolean;
    zipcode?: string;
  } | null;
  onAddressSaved?: () => void;
}

const AddressModal = ({ 
  isOpen, 
  onClose, 
  editingAddress = null,
  onAddressSaved 
}: AddressModalProps) => {
  const { addAddress, loading: apiLoading } = useDeliveryAddress();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    isDefault: true
  });

  const cities = ['Lagos', 'Ibadan', 'Abuja', 'Port Harcourt', 'Kano', 'Enugu'];
  const states = ['Lagos', 'Oyo', 'FCT', 'Rivers', 'Kano', 'Enugu'];

  // Reset form when modal opens/closes or editing address changes
  useEffect(() => {
    if (isOpen) {
      if (editingAddress) {
        // Editing mode
        setFormData({
          name: editingAddress.name,
          phone: editingAddress.phone,
          address: editingAddress.address,
          city: editingAddress.city,
          state: editingAddress.state,
          zipcode: editingAddress.zipcode || '',
          isDefault: editingAddress.isDefault
        });
      } else {
        // Add new mode
        setFormData({
          name: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipcode: '',
          isDefault: true
        });
      }
    }
  }, [isOpen, editingAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleSaveAddress = async () => {
    try {
      setIsLoading(true);
      
      // Validate form
      if (!formData.name.trim()) {
        toast.error('Name is required');
        return;
      }
      
      if (!formData.phone.trim()) {
        toast.error('Phone number is required');
        return;
      }
      
      if (formData.phone.length < 10) {
        toast.error('Phone number must be at least 10 digits');
        return;
      }
      
      if (!formData.address.trim()) {
        toast.error('Address is required');
        return;
      }
      
      if (!formData.city.trim()) {
        toast.error('City is required');
        return;
      }
      
      if (!formData.state.trim()) {
        toast.error('State is required');
        return;
      }
      
      // Prepare data for backend
      const addressData = {
        name: formData.name.trim(),
        phoneNumber: formData.phone, // Note: backend expects phoneNumber
        address: formData.address.trim(),
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode.trim(),
        isDefault: formData.isDefault
      };
      
      const result = await addAddress(addressData);
      
      if (result.success) {
        toast.success('Address saved successfully');
        onClose();
        if (onAddressSaved) {
          onAddressSaved();
        }
      } else {
        toast.error(result.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Failed to save address:', error);
      toast.error('Failed to save address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isLoading || apiLoading) return;
    onClose();
  };

  if (!isOpen) return null;

  const loading = isLoading || apiLoading;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-70 flex items-end justify-end z-50 pb-0 ">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={handleCancel}
          disabled={loading}
          className="absolute top-6 right-6 w-8 h-8 bg-red-400 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {editingAddress ? 'Edit delivery address' : 'Add new delivery address'}
        </h2>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-100"
              placeholder="Enter your full name"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
              Phone number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-100"
              placeholder="08012345678"
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
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-100"
              placeholder="Enter your full address"
            />
          </div>

          {/* Zipcode */}
          {/* <div>
            <label htmlFor="zipcode" className="block text-sm font-medium text-gray-900 mb-2">
              ZIP/Postal Code (Optional)
            </label>
            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-100"
              placeholder="100001"
            />
          </div> */}

          {/* City and State */}
          <div className="grid grid-cols-2 gap-3">
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
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer disabled:bg-gray-100"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem',
                  color: formData.city ? '#000' : '#9ca3af'
                }}
              >
                <option value="">City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
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
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer disabled:bg-gray-100"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem',
                  color: formData.state ? '#000' : '#9ca3af'
                }}
              >
                <option value="">State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Save as Default Checkbox */}
        <div className="mt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              disabled={loading}
              className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <span className="text-sm text-gray-700">Save address as default</span>
          </label>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveAddress}
          disabled={loading}
          className="w-full mt-6 px-6 py-2 bg-[#3652AD] text-white rounded-full font-medium  transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            'Save address'
          )}
        </button>
      </div>
    </div>
  );
};

export default AddressModal;