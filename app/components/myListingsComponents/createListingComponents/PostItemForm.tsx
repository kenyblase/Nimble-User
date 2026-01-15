// PostItemForm Component
'use client';

import { useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';

interface PostItemProps {
  onSubmit?: (data: PostItemFormData) => void;
}

interface PostItemFormData {
  title: string;
  category: string;
  city: string;
  state: string;
  condition: string;
  description: string;
  price: string;
  images: File[];
  videoLink: string;
  bulkPrices: BulkPrice[];
}

interface BulkPrice {
  minQuantity: number;
  price: number;
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

const cities = ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Benin City', 'Kaduna'];
const states = ['Lagos', 'Abuja FCT', 'Rivers', 'Kano', 'Oyo', 'Edo', 'Kaduna'];
const conditions = ['New', 'Like New', 'Good', 'Fair', 'For Parts'];

export default function PostItemForm({ onSubmit }: PostItemProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [condition, setCondition] = useState('New');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoLink, setVideoLink] = useState('');
  const [bulkPrices, setBulkPrices] = useState<BulkPrice[]>([
    { minQuantity: 2, price: 10000 },
    { minQuantity: 4, price: 9800 }
  ]);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);

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

  const calculateCommission = (amount: number) => {
    return (amount * 0.1).toFixed(0);
  };

  const calculateYouReceive = (amount: number) => {
    return (amount * 0.9).toFixed(0);
  };

  const addBulkPrice = () => {
    const lastPrice = bulkPrices[bulkPrices.length - 1];
    setBulkPrices([...bulkPrices, { minQuantity: lastPrice.minQuantity + 2, price: lastPrice.price - 200 }]);
  };

  const removeBulkPrice = (index: number) => {
    setBulkPrices(bulkPrices.filter((_, i) => i !== index));
  };

  const updateBulkPrice = (index: number, field: 'minQuantity' | 'price', value: number) => {
    const updated = [...bulkPrices];
    updated[index][field] = value;
    setBulkPrices(updated);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        title,
        category,
        city,
        state,
        condition,
        description,
        price,
        images,
        videoLink,
        bulkPrices
      });
    }
  };

  return (
    <div className="h-[100%] bg-gray-50">
      {/* Header */}
      
      <div className="p-4 w-[90%] mx-auto bg-white rounded-2xl mt-[20px] border border-gray-200 space-y-2">
        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title*"
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className={category ? 'text-gray-900' : 'text-gray-500'}>
              {category || 'Choose category'}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showCategoryDropdown && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Location Section */}
        <div>
          <label className="block text-gray-900 font-medium mb-3">Location</label>
          <div className="grid grid-cols-2 gap-3">
            {/* City Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className={city ? 'text-gray-900' : 'text-gray-500'}>
                  {city || 'City'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCityDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {cities.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCity(c);
                        setShowCityDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* State Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStateDropdown(!showStateDropdown)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className={state ? 'text-gray-900' : 'text-gray-500'}>
                  {state || 'State'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showStateDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showStateDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {states.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setState(s);
                        setShowStateDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Condition Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowConditionDropdown(!showConditionDropdown)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="text-gray-900">{condition}</span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showConditionDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showConditionDropdown && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
              {conditions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCondition(c);
                    setShowConditionDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Image Upload */}
        <div>
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
        <div>
          <input
            type="text"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            placeholder="Youtube or tiktok video link"
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={5}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-medium">₦</div>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
              placeholder="Price*"
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Commission Calculation */}
        {price && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Commission: 10%</div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">₦</span>
                <span className="text-gray-700 text-lg">{calculateCommission(Number(price))}</span>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">You will receive</div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">₦</span>
                <span className="text-gray-700 text-lg">{calculateYouReceive(Number(price))}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Pricing */}
        <div className="space-y-3">
          {bulkPrices.map((bulk, index) => (
            <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600">
                From {bulk.minQuantity} pieces
              </div>
              <div className="flex items-center gap-3">
                <div className="font-semibold text-gray-900">₦{bulk.price.toLocaleString()}</div>
                <button
                  type="button"
                  onClick={() => removeBulkPrice(index)}
                  className="text-red-500 text-sm font-medium hover:text-red-600"
                >
                  Remove
                </button>
                <button
                  type="button"
                  className="text-blue-600 text-sm font-medium hover:text-blue-700"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addBulkPrice}
            className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
          >
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
              <Plus className="w-3 h-3 text-white" />
            </div>
            Add Bulk price
          </button>
        </div>

        {/* Submit Button */}
        
      </div>
    </div>
  );
}