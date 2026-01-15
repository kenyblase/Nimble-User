'use client';

import { useState, useEffect, useCallback } from 'react';
import SettingsComponentFactory from './SettingsComponentFactory';
import { useDeliveryAddress } from '@/app/lib/hooks/useSettingsApis/useDeliveryAddress';
import toast from 'react-hot-toast';
import AddressModal from '../AddressModal';

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  zipcode: string;
  city: string;
  state: string;
  isDefault: boolean;
}

interface ShippingAddressProps {
  onSave?: (addresses: Address[]) => void;
  onCancel?: () => void;
  settingsRoute?: string;
  showFullLayout?: boolean;
}

export default function ShippingAddress({
  onSave,
  onCancel,
  settingsRoute = '/settings',
  showFullLayout = false,
}: ShippingAddressProps) {
  const {
    addresses: backendAddresses,
    loading,
    error,
    success,
    fetchAddresses,
    deleteAddress,
    setDefaultAddress,
    resetState
  } = useDeliveryAddress();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSettingDefault, setIsSettingDefault] = useState<string | null>(null);

  // Load addresses on component mount
  useEffect(() => {
    loadAddresses();
  }, []);

  // Show toast messages
  useEffect(() => {
    if (success) {
      toast.success(success);
      resetState();
    }
    if (error) {
      toast.error(error);
      resetState();
    }
  }, [success, error, resetState]);

  // Map backend addresses to frontend format
  useEffect(() => {
    if (backendAddresses && backendAddresses.length > 0) {
      const mappedAddresses = backendAddresses.map(addr => ({
        id: addr._id || Math.random().toString(),
        name: addr.name || '',
        phone: addr.phoneNumber || '',
        address: addr.address || '',
        zipcode: addr.zipcode || '',
        city: addr.city || '',
        state: addr.state || '',
        isDefault: addr.isDefault || false
      }));
      setAddresses(mappedAddresses);
    } else {
      setAddresses([]);
    }
  }, [backendAddresses]);

  const loadAddresses = async () => {
    try {
      await fetchAddresses();
      console.log('Addresses loaded successfully');
    } catch (err) {
      console.error('Failed to load addresses:', err);
      console.log('Failed to load addresses:', err);
    }
  };

  const handleEdit = (addressId: string) => {
    const address = addresses.find(addr => addr.id === addressId);
    if (address) {
      setEditingAddress(address);
      setIsModalOpen(true);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleSetDefault = async (address: Address) => {
    try {
      setIsSettingDefault(address.id);
      
      // Extract just digits from phone for backend
      const phoneDigits = address.phone.replace(/\D/g, '');
      
      const result = await setDefaultAddress(address.address, phoneDigits);
      
      if (!result.success) {
        toast.error(result.message || 'Failed to set default address');
      }
    } catch (err) {
      console.error('Failed to set default address:', err);
      toast.error('Failed to set default address');
    } finally {
      setIsSettingDefault(null);
    }
  };

  const handleDeleteAddress = async (address: Address) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }
    
    try {
      setIsDeleting(address.id);
      
      // Extract just digits from phone for backend
      const phoneDigits = address.phone.replace(/\D/g, '');
      
      const result = await deleteAddress(address.address, phoneDigits);
      
      if (!result.success) {
        toast.error(result.message || 'Failed to delete address');
      }
    } catch (err) {
      console.error('Failed to delete address:', err);
      toast.error('Failed to delete address');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddressSaved = async () => {
    // Refresh addresses after saving
    await loadAddresses();
  };

  const handleSaveAll = () => {
    if (onSave) {
      onSave(addresses);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const isLoading = loading || isDeleting !== null || isSettingDefault !== null;

  return (
    <>
      <SettingsComponentFactory
        title="Delivery address"
        settingsRoute={settingsRoute}
        showFullLayout={showFullLayout}
        onSave={handleSaveAll}
        onCancel={handleCancel}
        showActionButtons={false}
      >
        <div className="flex flex-col min-h-screen">
          {/* Loading State */}
          {loading && addresses.length === 0 && (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && addresses.length === 0 && (
            <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 py-6">
            {/* Empty State */}
            {!loading && addresses.length === 0 && (
              <div className="text-center py-12 px-6">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No delivery addresses</h3>
                <p className="text-gray-600 mb-6">You haven't saved any delivery addresses yet.</p>
                <button
                  onClick={handleAddNew}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Add your first address
                </button>
              </div>
            )}

            {/* Address List */}
            <div className="space-y-4 px-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 relative"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteAddress(address)}
                    disabled={isLoading}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 disabled:opacity-50"
                  >
                    {isDeleting === address.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>

                  <div className="flex items-start gap-3">
                    {/* Radio Button */}
                    <div className="pt-1">
                      <button
                        onClick={() => handleSetDefault(address)}
                        disabled={isLoading || address.isDefault}
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center disabled:cursor-not-allowed"
                        style={{
                          borderColor: address.isDefault ? '#ff6b35' : '#d1d5db',
                          backgroundColor: 'white'
                        }}
                      >
                        {isSettingDefault === address.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-500"></div>
                        ) : address.isDefault ? (
                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        ) : null}
                      </button>
                    </div>

                    {/* Address Content */}
                    <div className="flex-1">
                      {address.isDefault && (
                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-600 text-xs font-medium rounded mb-2">
                          Default Address
                        </span>
                      )}
                      <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                        {address.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-0.5">
                        {address.phone}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {address.address}
                      </p>
                      <p className="text-xs text-gray-500">
                        {address.city}, {address.state}
                        {address.zipcode && ` • ${address.zipcode}`}
                      </p>
                    </div>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(address.id)}
                      disabled={isLoading}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50 mt-[50px]"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Button */}
            {addresses.length > 0 && (
              <div className="mt-6 flex justify-center px-6">
                <button
                  onClick={handleAddNew}
                  disabled={isLoading}
                  className="w-full md:w-[80%] inline-flex items-center justify-center gap-2 px-6 py-3 bg-pink-50 text-red-500 rounded-lg font-medium hover:bg-pink-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add new delivery address
                </button>
              </div>
            )}
          </div>
        </div>
      </SettingsComponentFactory>

      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
        }}
        editingAddress={editingAddress}
        onAddressSaved={handleAddressSaved}
      />
    </>
  );
}