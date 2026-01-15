import { createContext, useContext, useState, useEffect } from 'react';

interface VendorContextType {
  vendorId: string | null;
  vendorName: string | null;
}

const VendorContext = createContext<VendorContextType | null>(null);

export const useVendor = () => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
};
