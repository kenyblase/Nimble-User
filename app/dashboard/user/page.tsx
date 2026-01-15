'use client'
import Footer from '@/app/components/Footer'
import VerticalNavMenu from '@/app/components/SidebarNavigation'
import Header from '@/app/components/TopBar'
import WalletDashboardComponent from '@/app/components/WalletDashboard'
import BottomNavigation from '@/app/components/BottomNav'
import React from 'react'
import MobileTopBar from '@/app/components/MobileTopBar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const User = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='w-full min-h-screen bg-white '>
      {/* Header - Visible only on desktop/tablet */}
      <div className="hidden md:block">
        <Header/>
      </div>

      <div className="block md:hidden fixed top-0 left-0 right-0 z-50">
        <MobileTopBar/>
      </div>
      
      {/* Main Content with bottom padding for mobile nav */}
      <main className="pb-20 md:pb-0 ">
        <div className='flex w-full sm:w-[90%] m-auto justify-between'>
          <VerticalNavMenu/>
          <WalletDashboardComponent/>
        </div>
        <Footer/>
      </main>
      
      {/* Bottom Navigation - Visible only on mobile */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation />
      </div>
    </div>
  )
}

export default User