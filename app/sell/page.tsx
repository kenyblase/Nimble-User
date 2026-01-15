'use client'
import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import Header from '../components/TopBar';
import Head from 'next/head';
import ProductsGridComponent from '../components/ProductCards';
import Footer from '../components/Footer';
import SellRate from '../components/SellRate';
import BottomNavigation from '../components/BottomNav';
import SellHeader from '../components/SellHeader';

const HorizontalUserProfile: React.FC = () => {
  return(
    <div className='w-full min-h-screen bg-white'>
      {/* Header - Visible only on desktop/tablet */}
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="md:hidden block">
      <SellHeader/>
      </div>
      {/* Main Content with bottom padding for mobile nav */}
      <main className="pb-20 md:pb-0">
        <SellRate/>
        <ProductsGridComponent/>
        <Footer/>
      </main>
      
      {/* Bottom Navigation - Visible only on mobile */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default HorizontalUserProfile;