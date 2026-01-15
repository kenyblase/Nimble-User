// ChooseCategories Component

'use client';

import { useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';

interface PostItemProps {
  onSubmit?: (data: PostItemData) => void;
}

interface PostItemData {
  category: string;
  images: File[];
  videoLink: string;
}

const categories = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Toys & Games',
  'Automotive',
  'Health & Beauty',
  'Food & Beverages',
  'Other'
];

export default function PostItem({ onSubmit }: PostItemProps) {
  const [category, setCategory] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoLink, setVideoLink] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ category, images, videoLink });
    }
  };

  return (
    <div className="h-[100%] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 shadow">
        <button className="text-gray-700 hover:text-gray-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Post item</h1>
      </div>

      <div className="p-4 w-[90%] mx-auto bg-white rounded-2xl mt-[20px] border border-gray-200">
        {/* Category Dropdown */}
        <div className="mb-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className={category ? 'text-gray-900' : 'text-gray-500'}>
                {category || 'Choose category'}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-900 font-medium mb-3">
            Add product images
          </label>
          <div className="flex flex-wrap gap-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-gray-900 bg-opacity-60 rounded-full p-1 hover:bg-opacity-80"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            
            <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 bg-gray-50">
              <Plus className="w-8 h-8 text-gray-400" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Video Link */}
        <div className="mb-6">
          <input
            type="text"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            placeholder="Youtube or tiktok video link"
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        {/* <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Post Item
        </button> */}
      </div>
    </div>
  );
}