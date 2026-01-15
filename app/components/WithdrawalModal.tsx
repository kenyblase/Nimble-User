'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface WithdrawalData {
  provider: string; // This is bankName in backend
  accountNumber: string;
  isDefault?: boolean;
}

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: WithdrawalData) => Promise<void>;
  initialData?: {
    provider?: string;
    accountNumber?: string;
  } | null;
  isLoading?: boolean;
  isEditing?: boolean;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = null,
  isLoading = false,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<WithdrawalData>({
    provider: initialData?.provider || '',
    accountNumber: initialData?.accountNumber || '',
    isDefault: false
  });

  const banks: string[] = [
    'Access Bank',
    'GTBank',
    'First Bank',
    'UBA',
    'Zenith Bank',
    'Stanbic IBTC',
    'Fidelity Bank',
    'Union Bank',
    'Ecobank',
    'Sterling Bank',
    'Wema Bank',
    'Polaris Bank',
    'Keystone Bank',
    'Opay',
    'Kuda',
    'Palmpay',
    'Moniepoint'
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          provider: initialData.provider || '',
          accountNumber: initialData.accountNumber || '',
          isDefault: false
        });
      } else {
        setFormData({
          provider: '',
          accountNumber: '',
          isDefault: false
        });
      }
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    // Validate form
    if (!formData.provider.trim()) {
      toast.error('Please select a bank');
      return;
    }

    if (!formData.accountNumber.trim()) {
      toast.error('Account number is required');
      return;
    }

    // Validate account number (Nigerian account numbers are typically 10 digits)
    const accountDigits = formData.accountNumber.replace(/\D/g, '');
    if (accountDigits.length !== 10) {
      toast.error('Account number must be 10 digits');
      return;
    }

    try {
      await onSave(formData);
      // Modal will be closed by parent component on successful save
    } catch (error) {
      // Error is handled by parent component
      console.error('Failed to save withdrawal option:', error);
    }
  };

  const handleCancel = () => {
    if (isLoading) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-end z-50 pb-0">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 w-8 h-8 bg-red-400 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {isEditing ? 'Edit withdrawal option' : 'Add withdrawal option'}
        </h2>

        <div className="space-y-6 mb-8">
          {/* Bank Name */}
          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-gray-800 mb-2">
              Bank name *
            </label>
            <select
              id="provider"
              name="provider"
              value={formData.provider}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer disabled:bg-gray-100"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5rem',
                color: formData.provider ? '#1f2937' : '#9ca3af'
              }}
            >
              <option value="">Select bank</option>
              {banks.map((bank) => (
                <option key={bank} value={bank} className="text-gray-900">
                  {bank}
                </option>
              ))}
            </select>
          </div>

          {/* Account Number */}
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-800 mb-2">
              Account number *
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Enter 10-digit account number"
              maxLength={10}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your 10-digit account number
            </p>
          </div>

          {/* Set as Default Checkbox (only for new options) */}
          {!isEditing && (
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="text-sm text-gray-700">Set as default withdrawal option</span>
              </label>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            disabled={isLoading || !formData.provider || !formData.accountNumber || formData.accountNumber.length !== 10}
            className="w-64 px-8 py-4 bg-blue-400 text-white rounded-full font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              isEditing ? 'Update' : 'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;