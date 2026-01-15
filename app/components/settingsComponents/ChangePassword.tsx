'use client';

import { useState, useEffect } from 'react';
import SettingsComponentFactory from './SettingsComponentFactory';
import { usePassword } from '@/app/lib/hooks/useSettingsApis/usePassword';
import toast from 'react-hot-toast';

interface ChangePasswordProps {
  onSubmit?: (data: PasswordFormData) => void;
  onCancel?: () => void;
  settingsRoute?: string;
  showFullLayout?: boolean;
}

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ChangePassword({ 
  onSubmit, 
  onCancel, 
  settingsRoute = '/settings',
  showFullLayout = false 
}: ChangePasswordProps) {
  const { loading, error, success, changePassword, resetState } = usePassword();
  
  const [formData, setFormData] = useState<PasswordFormData>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState<Partial<PasswordFormData>>({});
  const [localLoading, setLocalLoading] = useState(false);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        resetState();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, resetState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof PasswordFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // const validateForm = (): boolean => {
  //   const newErrors: Partial<PasswordFormData> = {};

  //   if (!formData.oldPassword) {
  //     newErrors.oldPassword = 'Old password is required';
  //   } else if (formData.oldPassword.length < 8) {
  //     newErrors.oldPassword = 'Password must be at least 8 characters';
  //   }

  //   if (!formData.newPassword) {
  //     newErrors.newPassword = 'New password is required';
  //   } else if (formData.newPassword.length < 8) {
  //     newErrors.newPassword = 'Password must be at least 8 characters';
  //   } else if (!/(?=.*[a-z])/.test(formData.newPassword)) {
  //     newErrors.newPassword = 'Password must contain at least one lowercase letter';
  //   } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
  //     newErrors.newPassword = 'Password must contain at least one uppercase letter';
  //   } else if (!/(?=.*\d)/.test(formData.newPassword)) {
  //     newErrors.newPassword = 'Password must contain at least one number';
  //   } else if (!/(?=.*[@$!%*?&])/.test(formData.newPassword)) {
  //     newErrors.newPassword = 'Password must contain at least one special character (@$!%*?&)';
  //   }

  //   if (!formData.confirmNewPassword) {
  //     newErrors.confirmNewPassword = 'Please confirm your new password';
  //   } else if (formData.newPassword !== formData.confirmNewPassword) {
  //     newErrors.confirmNewPassword = 'Passwords do not match';
  //   }

  //   // Check if new password is same as old password
  //   if (formData.oldPassword && formData.newPassword && formData.oldPassword === formData.newPassword) {
  //     newErrors.newPassword = 'New password cannot be the same as old password';
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleSave = async () => {
    // if (!validateForm()) {
    //   return;
    // }

    try {
      setLocalLoading(true);
      
      // Prepare data for API (match backend field names)
      const passwordData = {
        currentPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmNewPassword
      };

      const result = await changePassword(passwordData);
      
      if (result.success) {
        // Clear form on successful password change
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        
        setShowPasswords({
          old: false,
          new: false,
          confirm: false
        });
        
        // Call parent onSubmit if provided
        if (onSubmit) {
          onSubmit(formData);
        }
      }
    } catch (err) {
      console.error('Failed to change password:', err);
      // Error is already handled in the hook and toast will show
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    
    setErrors({});
    
    if (onCancel) {
      onCancel();
    }
  };

  const isLoading = loading || localLoading;

  return (
    <SettingsComponentFactory
      title="Change Password"
      settingsRoute={settingsRoute}
      showFullLayout={showFullLayout}
      onSave={handleSave}
      onCancel={handleCancel}
      showActionButtons={false}
    >
      <div className="flex flex-col bg-white border border-gray-200 rounded-lg">
        {/* Status Messages */}
        {(success || error) && (
          <div className="px-6 pt-6">
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                ✓ {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                ⚠ {error}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 px-6 py-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
            {/* Old Password */}
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-900 mb-2">
                Old password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.old ? 'text' : 'password'}
                  id="oldPassword"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  placeholder="..........."
                  disabled={isLoading}
                  className="w-full placeholder-gray-400 px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('old')}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  {showPasswords.old ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.oldPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900 mb-2">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder=".........."
                  disabled={isLoading}
                  className="w-full px-4 placeholder-gray-400 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  {showPasswords.new ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
              )}
              {/* <div className="mt-2 text-xs text-gray-500">
                <p>Password requirements:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li className={formData.newPassword.length >= 8 ? 'text-green-500' : ''}>
                    At least 8 characters
                  </li>
                  <li className={/(?=.*[a-z])/.test(formData.newPassword) ? 'text-green-500' : ''}>
                    One lowercase letter
                  </li>
                  <li className={/(?=.*[A-Z])/.test(formData.newPassword) ? 'text-green-500' : ''}>
                    One uppercase letter
                  </li>
                  <li className={/(?=.*\d)/.test(formData.newPassword) ? 'text-green-500' : ''}>
                    One number
                  </li>
                  <li className={/(?=.*[@$!%*?&])/.test(formData.newPassword) ? 'text-green-500' : ''}>
                    One special character (@$!%*?&)
                  </li>
                </ul>
              </div> */}
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-900 mb-2">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  placeholder=".........."
                  disabled={isLoading}
                  className="w-full px-4 py-3 placeholder-gray-400 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  {showPasswords.confirm ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmNewPassword}</p>
              )}
              <div className="mt-2">
                {formData.newPassword && formData.confirmNewPassword && (
                  <p className={`text-sm ${formData.newPassword === formData.confirmNewPassword ? 'text-green-500' : 'text-red-500'}`}>
                    {formData.newPassword === formData.confirmNewPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-[#3652AD] text-white rounded-full font-medium transition-colors text-base hover:bg-[#2a418a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg 
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Changing Password...
                  </>
                ) : (
                  'Change password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SettingsComponentFactory>
  );
}