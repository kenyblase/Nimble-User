// pages/categories/index.tsx
'use client'
import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BottomNavigation from '../components/BottomNav';
import Footer from '../components/Footer';

interface Category {
  id: string;
  name: string;
  icon: string;
}

const categories: Category[] = [
  { id: '1', name: 'Electronics', icon: '💻' },
  { id: '2', name: 'Home and kitchen', icon: '🏠' },
  { id: '3', name: 'Fashion and apparel', icon: '👗' },
  { id: '4', name: 'Food and beverages', icon: '🍔' },
  { id: '5', name: 'Property', icon: '🏢' },
  { id: '6', name: 'Jobs', icon: '🔧' },
  { id: '7', name: 'CVs', icon: '📄' },
  { id: '8', name: 'Health and beauty', icon: '💄' },
  { id: '9', name: 'Babies and kids', icon: '🧸' },
  { id: '10', name: 'Sports and outdoors', icon: '⚽' },
  { id: '11', name: 'Musical instruments', icon: '🎸' },
  { id: '12', name: 'Pets', icon: '🐕' },
  { id: '13', name: 'Digital products', icon: '💾' },
  { id: '14', name: 'Services', icon: '🔨' },
];

const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    // Navigate to subcategories page
    if (categoryId === '1') { // Electronics
      router.push('/categories/electronics');
    } else {
      // For other categories, you can create individual pages or use a dynamic route
      console.log(`Navigating to category: ${categoryName} (ID: ${categoryId})`);
      // router.push(`/categories/${categoryId}`);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
        {/* Top Bar with Back Button */}
        <div className="flex items-center px-4 py-4">
          <button 
            className="p-1 -ml-1"
            onClick={handleBack}
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-gray-900 -ml-6">
            Categories
          </h1>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="flex-1">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id, category.name)}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <span className="text-sm text-gray-900">{category.name}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-sm">No categories found</p>
          </div>
        )}
      </div>
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation/>
      </div>
      <Footer/>
    </div>
  );
};

export default CategoriesPage;