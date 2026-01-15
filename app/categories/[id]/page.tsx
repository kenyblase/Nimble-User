// pages/categories/electronics.tsx
'use client'
import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SubCategory {
  id: string;
  name: string;
  icon: string;
}

const electronicsSubcategories: SubCategory[] = [
  { id: 'e1', name: 'Mobile phones', icon: '📱' },
  { id: 'e2', name: 'Tablets', icon: '⌂' },
  { id: 'e3', name: 'Laptops', icon: '💻' },
  { id: 'e4', name: 'Desktop Computers', icon: '🖥️' },
  { id: 'e5', name: 'TVs', icon: '📺' },
  { id: 'e6', name: 'Headphones', icon: '🎧' },
  { id: 'e7', name: 'Gaming consoles', icon: '🎮' },
  { id: 'e8', name: 'Cameras', icon: '📷' },
];

const ElectronicsSubcategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredSubcategories = electronicsSubcategories.filter(subcategory =>
    subcategory.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubcategoryClick = (subcategoryId: string, subcategoryName: string) => {
    console.log(`Navigating to subcategory: ${subcategoryName} (ID: ${subcategoryId})`);
    // In a real app, you would navigate to the products page
    // router.push(`/categories/electronics/${subcategoryId}`);
  };

  const handleBack = () => {
    router.push('/categories');
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
            Electronics
          </h1>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search electronics"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Subcategories List */}
      <div className="flex-1">
        {filteredSubcategories.length > 0 ? (
          filteredSubcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => handleSubcategoryClick(subcategory.id, subcategory.name)}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{subcategory.icon}</span>
                <span className="text-sm text-gray-900">{subcategory.name}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-sm">No subcategories found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectronicsSubcategoriesPage;