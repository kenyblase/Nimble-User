'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import SettingsComponentFactory from './SettingsComponentFactory';
import { useProfileApi } from '@/app/lib/hooks/useSettingsApis/useProfileApi';
import toast from 'react-hot-toast';

interface PersonalDetailsProps {
  settingsRoute?: string;
  showFullLayout?: boolean;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePic?: string;
  gender?: string;
}

// Helper function to format phone number
const formatPhoneNumber = (phoneNumber: string | null | undefined): string => {
  if (!phoneNumber) return '+234';
  
  // Remove all non-digits
  const digits = phoneNumber.replace(/\D/g, '');
  
  // If empty, return default
  if (digits.length === 0) return '+234';
  
  // Handle different formats
  if (digits.length === 10) {
    return `+234${digits}`;
  }
  
  if (digits.length === 11 && digits.startsWith('0')) {
    return `+234${digits.substring(1)}`;
  }
  
  if (digits.length === 13 && digits.startsWith('234')) {
    return `+${digits}`;
  }
  
  if (phoneNumber.startsWith('+') && phoneNumber.length === 14) {
    return phoneNumber;
  }
  
  // Return as is if it doesn't match expected formats
  return phoneNumber;
};

// Helper function to extract local phone number (without country code)
const extractLocalPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-digits
  const digits = phoneNumber.replace(/\D/g, '');
  
  if (digits.length === 10) {
    return digits;
  }
  
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.substring(1);
  }
  
  if (digits.length === 13 && digits.startsWith('234')) {
    return digits.substring(3);
  }
  
  if (phoneNumber.startsWith('+234') && phoneNumber.length === 14) {
    return phoneNumber.substring(4);
  }
  
  // If it's already a local number, return it
  if (digits.length === 10) {
    return digits;
  }
  
  return digits.slice(-10); // Take last 10 digits
};

// Helper function to convert file to base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function PersonalDetails({
  settingsRoute = '/settings',
  showFullLayout = false
}: PersonalDetailsProps) {
  const { 
    loading, 
    error, 
    userProfile, 
    getProfile, 
    updateProfile,
    normalizePhoneNumber
  } = useProfileApi();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: 'Female',
    photoUrl: null as string | null,
  });
  
  const [phoneDisplay, setPhoneDisplay] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [initialData, setInitialData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: 'Female',
    photoUrl: null as string | null,
  });

  // Memoize the formatted phone number
  const formattedPhone = useMemo(() => {
    return userProfile ? formatPhoneNumber(userProfile.phoneNumber) : '+234';
  }, [userProfile]);

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Update form when profile data is loaded
  useEffect(() => {
    if (userProfile) {
      const localPhone = extractLocalPhoneNumber(userProfile.phoneNumber || '');
      
      const newInitialData = {
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        phoneNumber: localPhone,
        gender: userProfile.gender || 'Female',
        photoUrl: userProfile.profilePic || null,
      };
      
      setInitialData(newInitialData);
      
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        phoneNumber: `+234${localPhone}`,
        gender: userProfile.gender || 'Female',
        photoUrl: userProfile.profilePic || null,
      });
      
      setPhoneDisplay(localPhone);
    }
  }, [userProfile]);

  const fetchProfile = useCallback(async () => {
    try {
      await getProfile();
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      toast.error(err.message || 'Failed to load profile');
    }
  }, [getProfile]);

  const checkIfChanged = useCallback(() => {
    if (!userProfile) return false;
    
    const currentPhone = formData.phoneNumber.replace('+234', '');
    const initialPhone = initialData.phoneNumber;
    
    return (
      formData.firstName !== initialData.firstName ||
      formData.lastName !== initialData.lastName ||
      currentPhone !== initialPhone ||
      formData.gender !== initialData.gender
    );
  }, [formData, initialData, userProfile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    
    // Check if form has changed from initial data
    const hasChanged = checkIfChanged();
    setIsEditing(hasChanged);
  }, [checkIfChanged]);

  const handlePhoneDisplayChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow digits and limit to 10 digits
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    setPhoneDisplay(digitsOnly);
    
    // Update formData with full phone number
    setFormData(prev => ({ 
      ...prev, 
      phoneNumber: `+234${digitsOnly}` 
    }));
    
    setIsEditing(true);
  }, []);

  const handlePhotoUpdate = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;
    
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please select an image file');
          return;
        }
        
        // Create a local URL for preview
        const photoUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, photoUrl }));
        
        try {
          setUploadingImage(true);
          
          // Convert file to base64
          const base64Image = await convertFileToBase64(file);
          
          // Update profile with new photo
          const response = await updateProfile({ profilePic: base64Image });
          
          if (response.success) {
            toast.success('Profile picture updated successfully');
            await fetchProfile(); // Refresh profile data
          } else {
            toast.error(response.message || 'Failed to update profile picture');
            // Revert to original photo
            setFormData(prev => ({ 
              ...prev, 
              photoUrl: userProfile?.profilePic || null 
            }));
          }
        } catch (err: any) {
          console.error('Failed to upload image:', err);
          
          const errorMessage = err.response?.data?.message || 
                             err.response?.data?.error || 
                             'Failed to upload profile picture';
          
          toast.error(errorMessage);
          
          // Revert to original photo
          setFormData(prev => ({ 
            ...prev, 
            photoUrl: userProfile?.profilePic || null 
          }));
        } finally {
          setUploadingImage(false);
          // Clean up the object URL
          URL.revokeObjectURL(photoUrl);
        }
      }
    };
    
    input.click();
  }, [updateProfile, fetchProfile, userProfile]);

  const handleSave = useCallback(async () => {
    try {
      setSaveLoading(true);
      
      const updateData: any = {};
      
      // Only include changed fields
      if (formData.firstName !== initialData.firstName) {
        updateData.firstName = formData.firstName.trim();
      }
      
      if (formData.lastName !== initialData.lastName) {
        updateData.lastName = formData.lastName.trim();
      }
      
      const currentPhone = formData.phoneNumber.replace('+234', '');
      if (currentPhone !== initialData.phoneNumber) {
        updateData.phoneNumber = normalizePhoneNumber(formData.phoneNumber);
      }
      
      if (formData.gender !== initialData.gender) {
        updateData.gender = formData.gender;
      }

      // If no changes, return
      if (Object.keys(updateData).length === 0) {
        toast('No changes to save');
        setIsEditing(false);
        return;
      }

      const response = await updateProfile(updateData);
      
      if (response.success) {
        // Update initial data to new values
        setInitialData({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: currentPhone,
          gender: formData.gender,
          photoUrl: formData.photoUrl,
        });
        
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
      
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      
      // Log detailed error
      if (err.response) {
        console.error('Update error response:', err.response.data);
      }
      
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  }, [formData, initialData, updateProfile, normalizePhoneNumber]);

  const handleCancel = useCallback(() => {
    if (userProfile) {
      const localPhone = extractLocalPhoneNumber(userProfile.phoneNumber || '');
      
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        phoneNumber: `+234${localPhone}`,
        gender: userProfile.gender || 'Female',
        photoUrl: userProfile.profilePic || null,
      });
      
      setPhoneDisplay(localPhone);
      
      // Reset initial data
      setInitialData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        phoneNumber: localPhone,
        gender: userProfile.gender || 'Female',
        photoUrl: userProfile.profilePic || null,
      });
    }
    setIsEditing(false);
  }, [userProfile]);

  const handleRemovePhoto = useCallback(async () => {
    try {
      setUploadingImage(true);
      
      // Send empty string to remove profile picture
      const response = await updateProfile({ profilePic: '' });
      
      if (response.success) {
        setFormData(prev => ({ ...prev, photoUrl: null }));
        toast.success('Profile picture removed');
        await fetchProfile();
      } else {
        toast.error(response.message || 'Failed to remove profile picture');
      }
    } catch (err) {
      console.error('Failed to remove photo:', err);
      toast.error('Failed to remove profile picture');
    } finally {
      setUploadingImage(false);
    }
  }, [updateProfile, fetchProfile]);

  const displayImageUrl = formData.photoUrl || '/default-profile.jpg';
  const isLoading = loading || saveLoading || uploadingImage;

  // Loading state
  if (loading && !userProfile) {
    return (
      <SettingsComponentFactory
        title="Personal Details"
        settingsRoute={settingsRoute}
        showFullLayout={showFullLayout}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </SettingsComponentFactory>
    );
  }

  // Error state
  if (error && !userProfile) {
    return (
      <SettingsComponentFactory
        title="Personal Details"
        settingsRoute={settingsRoute}
        showFullLayout={showFullLayout}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium mb-2">
              Error loading profile
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchProfile}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </SettingsComponentFactory>
    );
  }

  return (
    <SettingsComponentFactory
      title="Personal Details"
      settingsRoute={settingsRoute}
      showFullLayout={showFullLayout}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaveDisabled={!isEditing || isLoading}
    >
      <div className="flex flex-col">
        {/* Status Messages */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="px-6 py-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3 bg-gray-200">
              <Image
                src={displayImageUrl}
                alt="Profile"
                width={96}
                height={96}
                className="object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = '/default-profile.jpg';
                }}
              />
              {uploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <button
              onClick={handlePhotoUpdate}
              disabled={isLoading}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploadingImage ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  Uploading...
                </>
              ) : (
                <>
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
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  {formData.photoUrl ? 'Update photo' : 'Upload photo'}
                </>
              )}
            </button>
            {formData.photoUrl && !uploadingImage && (
              <button
                onClick={handleRemovePhoto}
                disabled={isLoading}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Remove photo
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-6 text-black">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
                First name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full text-black placeholder-gray-500 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                placeholder="Enter your last name"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900 mb-2">
                Phone number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">+234</span>
                </div>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={phoneDisplay}
                  onChange={handlePhoneDisplayChange}
                  placeholder="8012345678"
                  disabled={isLoading}
                  className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter your 10-digit phone number without the country code
              </p>
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-900 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base appearance-none bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.25rem'
                }}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                {userProfile?.email || 'Loading...'}
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Only show if editing */}
        {isEditing && (
          <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-gray-100 mt-8">
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-[#FE7A3633] text-[#FE7A36] rounded-full font-medium text-base transition-colors hover:bg-[#FE7A3644] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-[#3652AD] text-white rounded-full font-medium text-base transition-colors hover:bg-[#2a418a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {saveLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </SettingsComponentFactory>
  );
}