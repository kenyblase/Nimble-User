'use client';

import { useState, useEffect, useCallback } from 'react';
import WithdrawalModal from '../WithdrawalModal';
import { useWithdrawalOptions } from '@/app/lib/hooks/useSettingsApis/useWithdrawalOptions';
import SettingsComponentFactory from './SettingsComponentFactory';
import toast from 'react-hot-toast';

// Types
interface WithdrawalOption {
  id: string;
  name?: string;
  accountNumber: string;
  provider: string; // This is bankName in backend
  isDefault: boolean;
}

interface WithdrawalDetailsProps {
  settingsRoute?: string;
  showFullLayout?: boolean;
}

// Withdrawal Details Component
export default function WithdrawalDetails({
  settingsRoute = '/settings',
  showFullLayout = false
}: WithdrawalDetailsProps) {
  const {
    options: backendOptions,
    loading,
    error,
    success,
    fetchOptions,
    addOption,
    setDefaultOption,
    deleteOption,
    resetState
  } = useWithdrawalOptions();

  const [options, setOptions] = useState<WithdrawalOption[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<WithdrawalOption | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  // Load options on component mount
  useEffect(() => {
    fetchWithdrawalOptions();
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

  // Map backend options to frontend format
  useEffect(() => {
    if (backendOptions && backendOptions.length > 0) {
      const mappedOptions = backendOptions.map(option => ({
        id: option._id || Math.random().toString(),
        name: option.name || 'Account Holder', // Default name if not provided
        accountNumber: option.accountNumber || '',
        provider: option.bankName || '', // Map bankName to provider
        isDefault: option.isDefault || false
      }));
      setOptions(mappedOptions);
    } else {
      setOptions([]);
    }
  }, [backendOptions]);

  const fetchWithdrawalOptions = async () => {
    try {
      await fetchOptions();
    } catch (err) {
      console.error('Failed to fetch withdrawal options:', err);
    }
  };

  const handleAddNew = () => {
    setEditingOption(null);
    setIsModalOpen(true);
  };

  const handleEdit = (option: WithdrawalOption) => {
    setEditingOption(option);
    setIsModalOpen(true);
  };

  const handleSetDefault = async (option: WithdrawalOption) => {
    try {
      setSettingDefaultId(option.id);
      
      const result = await setDefaultOption(option.accountNumber, option.provider);
      
      if (!result.success) {
        toast.error(result.message || 'Failed to set default option');
      }
    } catch (err) {
      console.error('Failed to set default option:', err);
      toast.error('Failed to set default option');
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleDelete = async (option: WithdrawalOption) => {
    if (!confirm('Are you sure you want to delete this withdrawal option?')) {
      return;
    }

    try {
      setDeletingId(option.id);
      
      const result = await deleteOption(option.accountNumber, option.provider);
      
      if (!result.success) {
        toast.error(result.message || 'Failed to delete withdrawal option');
      }
    } catch (err) {
      console.error('Failed to delete withdrawal option:', err);
      toast.error('Failed to delete withdrawal option');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveOption = async (data: { provider: string; accountNumber: string; isDefault?: boolean }) => {
    try {
      setLocalLoading(true);
      
      const optionData = {
        bankName: data.provider, // Map provider to bankName for backend
        accountNumber: data.accountNumber,
        isDefault: data.isDefault || false
      };

      const result = await addOption(optionData);
      
      if (result.success) {
        setIsModalOpen(false);
        setEditingOption(null);
      } else {
        // Error is already shown via toast in the hook
      }
    } catch (err) {
      console.error('Failed to save withdrawal option:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingOption(null);
  };

  const isLoading = loading || localLoading || deletingId !== null || settingDefaultId !== null;

  return (
    <>
      <SettingsComponentFactory
        title="Withdrawal details"
        settingsRoute={settingsRoute}
        showFullLayout={showFullLayout}
        showActionButtons={false}
      >
        <div className="w-full mx-auto p-6">
          {/* Loading State */}
          {loading && options.length === 0 && (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && options.length === 0 && !loading && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && options.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No withdrawal options</h3>
              <p className="text-gray-600 mb-6">Add a bank account to receive your earnings</p>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Add your first withdrawal option
              </button>
            </div>
          )}

          {/* Options List */}
          {options.length > 0 && (
            <div className="space-y-4 mb-6">
              {options.map((option) => (
                <div
                  key={option.id}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 relative"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(option)}
                    disabled={isLoading}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 disabled:opacity-50"
                  >
                    {deletingId === option.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>

                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-800 mb-1">
                        {option.name || 'Account Holder'}
                      </h3>
                      <p className="text-base text-gray-700">
                        {option.accountNumber} · {option.provider}
                      </p>
                    </div>
                    {option.isDefault && (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded mt-[20px]">
                        Default
                      </span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-4">
                    {!option.isDefault && (
                      <button
                        onClick={() => handleSetDefault(option)}
                        disabled={isLoading}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 flex items-center gap-1"
                      >
                        {settingDefaultId === option.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                            Setting...
                          </>
                        ) : (
                          'Set as default'
                        )}
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleEdit(option)}
                      disabled={isLoading}
                      className="text-sm text-gray-600 hover:text-gray-700 font-medium disabled:opacity-50"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Button */}
          {options.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={handleAddNew}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-pink-50 text-red-500 rounded-lg font-medium hover:bg-pink-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                Add new option
              </button>
            </div>
          )}
        </div>
      </SettingsComponentFactory>

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        onSave={handleSaveOption}
        initialData={editingOption ? {
          provider: editingOption.provider,
          accountNumber: editingOption.accountNumber
        } : null}
        isLoading={localLoading}
        isEditing={!!editingOption}
      />
    </>
  );
}