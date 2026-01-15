'use client'
import { useCheckAuth } from '../lib/hooks/useAuthApis/useCheckAuth';
import { ReactNode } from 'react';

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  // This will check authentication status on every page that uses this layout
  useCheckAuth();
  
  return <>{children}</>;
}