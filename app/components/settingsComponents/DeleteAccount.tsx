// app/components/settingsComponents/DeleteAccount.tsx
'use client';

import { useState } from 'react';
import SettingsComponentFactory from './SettingsComponentFactory';

interface DeleteAccountProps {
  onDelete?: () => void;
  onCancel?: () => void;
  settingsRoute?: string;
  showFullLayout?: boolean;
}

export default function DeleteAccount({ 
  onDelete, 
  onCancel,
  settingsRoute = '/settings',
  showFullLayout = false 
}: DeleteAccountProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (confirmText === 'DELETE' && isConfirmed) {
      setIsDeleting(true);
      console.log('Account deletion confirmed');
      
      if (onDelete) {
        onDelete();
      }
      
      setTimeout(() => {
        setIsDeleting(false);
      }, 2000);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <SettingsComponentFactory
      title="Delete Account"
      settingsRoute={settingsRoute}
      showFullLayout={showFullLayout}
      onSave={handleDelete}
      onCancel={handleCancel}
      showActionButtons={true}
    >
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Warning</h3>
          <p className="text-red-700">
            Deleting your account is permanent and cannot be undone. All your data will be
            permanently removed from our systems.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To confirm, please type <span className="font-mono font-bold">DELETE</span> below:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full placeholder-gray-500 text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Type DELETE to confirm"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="confirm-delete"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="confirm-delete" className="ml-2 block text-sm text-gray-900">
              I understand that this action cannot be undone
            </label>
          </div>
        </form>
      </div>
    </SettingsComponentFactory>
  );
}