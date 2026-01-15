'use client'
import React from 'react'
import Header from './components/TopBar'
import HeroCategoriesSection from './components/MidSection'
import MostPurchasedSection from './components/MostPurchased'
import Footer from './components/Footer'
import MostViewedSection from './components/MostViewed'
import TrendingFeedSection from './components/Trending'
import BottomNavigation from './components/BottomNav'

const Home = () => {
  return (
    <div className="bg-white w-full min-h-screen">
      {/* Header - Visible only on desktop/tablet */}
      <div className="block">
        <Header />  
      </div>
      
      {/* Main Content with bottom padding for mobile nav */}
      <main className="pb-20 md:pb-0">
        <HeroCategoriesSection/>
        <MostPurchasedSection/>
        <MostViewedSection/>
        <TrendingFeedSection/>
        <Footer/>
      </main>
      
      {/* Bottom Navigation - Visible only on mobile */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation />
      </div>
    </div>
  )
}

export default Home