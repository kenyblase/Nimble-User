'use client'
import React, { useState, ChangeEvent, useEffect } from 'react';
import { Plus, X, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCreateRequest } from '@/app/lib/hooks/useRequestApi/useCreateRequest';
import Footer from '@/app/components/Footer';
import BottomNavigation from '@/app/components/BottomNav';

const PostListingForm = () => {
  // Form state
  const [category, setCategory] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoLink, setVideoLink] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [city, setCity] = useState<string>(''); // Added city state
  const [state, setState] = useState<string>(''); // Added state state
  const [condition, setCondition] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [negotiable, setNegotiable] = useState<boolean>(false);
  
  const router = useRouter();
  const { createRequest, loading, error, success, request } = useCreateRequest();

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Vehicles',
    'Books',
    'Toys',
    'Other'
  ];

  const cities = ['Lagos', 'Abuja', 'Ibadan', 'Kano', 'Port Harcourt']; // Added cities array
  const states = ['Lagos', 'FCT', 'Oyo', 'Kano', 'Rivers']; // Added states array
  const conditions = ['New', 'Like new', 'Used'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    
    setImages(prev => [...prev, ...files].slice(0, 5));
    
    const newImagePreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newImagePreviews].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (success && request) {
      console.log('Request created successfully:', request);
      setTimeout(() => {
        router.push('/requests');
      }, 2000);
    }
  }, [success, request, router]);

  const handleSubmit = async () => {
    console.log('📍 Current form values:', {
      category,
      title,
      city,
      state,
      condition,
      description,
      price,
      imagesCount: images.length
    });

    // Enhanced validation
    if (!category || !title || !city || !state || !condition || !description || !price) {
      alert('Please fill in all required fields');
      return;
    }

    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    // Validate location data
    if (!city.trim() || !state.trim()) {
      alert('Please select both city and state');
      return;
    }

    // Validate price is a valid number
    const priceNumber = Number(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      alert('Please enter a valid price');
      return;
    }

    // Prepare data for API with enhanced logging
    const requestData = {
      category,
      productImages: images,
      videoLink: videoLink || undefined,
      title,
      location: {
        city: city.trim(),
        state: state.trim()
      },
      condition,
      description,
      price: priceNumber,
      isNegotiable: negotiable
    };

    console.log('📝 Final request data before submission:', requestData);
    
    try {
      await createRequest(requestData);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
    }
  };

  return (
    <div className='w-full min-h-screen bg-white'>
      {/* Custom Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => router.back()}
            className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="ml-4 text-lg font-semibold text-gray-900">Create request</h1>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="pb-8">
        <div className="w-full max-w-md mx-auto px-4 pt-6">      
          <div className="space-y-5">
            {/* Success Message */} 
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-green-800 font-medium">Request Created Successfully!</h3>
                    <p className="text-green-600 text-sm">Redirecting to requests page...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-red-800 font-medium">Error Creating Request</h3>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Category Dropdown */}
            <div>
              <select
                value={category}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-[15px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center'
                }}
                disabled={loading}
              >
                <option value="" className="text-gray-500">Choose category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Add Product Images */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Add product images
              </label>
              <div className="flex flex-wrap gap-3">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative w-16 h-16">
                    <img
                      src={img}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={loading}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 disabled:bg-gray-400 shadow-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {imagePreviews.length < 5 && (
                  <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={loading}
                    />
                    <Plus className="w-7 h-7 text-gray-400" />
                  </label>
                )}
              </div>
            </div>

            {/* Video Link */}
            <div>
              <input
                type="url"
                value={videoLink}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setVideoLink(e.target.value)}
                placeholder="Youtube or tiktok video link"
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                disabled={loading}
              />
            </div>

            {/* Title */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="Title*"
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                disabled={loading}
              />
            </div>

            {/* Location - Added this section */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Location
              </label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={city}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setCity(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-[15px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center'
                  }}
                  disabled={loading}
                >
                  <option value="" className="text-gray-500">City</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={state}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setState(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-[15px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center'
                  }}
                  disabled={loading}
                >
                  <option value="" className="text-gray-500">State</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Condition */}
            <div>
              <select
                value={condition}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setCondition(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-[15px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center'
                }}
                disabled={loading}
              >
                <option value="" className="text-gray-500">Condition</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
              
              {/* Condition options display (when selected) */}
              {condition && (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="space-y-1.5">
                    {conditions.map((cond) => (
                      <div 
                        key={cond}
                        className={`text-sm ${condition === cond ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                      >
                        {cond}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Size */}
            <div>
              <select
                value={size}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSize(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-[15px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center'
                }}
                disabled={loading}
              >
                <option value="" className="text-gray-500">Size</option>
                {sizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <textarea
                value={description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Description"
                rows={4}
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
                disabled={loading}
              />
            </div>

            {/* Price */}
            <div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-gray-900 font-medium">
                  ₦
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                  placeholder="Price*"
                  className="w-full pl-9 pr-4 py-3.5 bg-white border border-gray-300 rounded-lg text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Negotiable Toggle */}
            <div className="flex items-center justify-between py-1">
              <label className="text-[15px] font-medium text-gray-900">
                Negotiable
              </label>
              <button
                type="button"
                onClick={() => setNegotiable(!negotiable)}
                disabled={loading}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  negotiable ? 'bg-blue-500' : 'bg-gray-300'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                    negotiable ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-600 text-center leading-relaxed px-2">
              By posting, you confirm you have read and agree to the{' '}
              <a href="#" className="text-orange-500 hover:underline font-medium">
                terms and conditions
              </a>{' '}
              and the{' '}
              <a href="#" className="text-orange-500 hover:underline font-medium">
                privacy policy
              </a>
            </p>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3.5 px-6 text-[15px] font-semibold rounded-full transition-colors ${
                loading 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-[#3652AD] text-white hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {loading ? 'Creating Request...' : 'Post Request'}
            </button>
          </div>
        </div>
      </main>
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation/>
      </div>
      <Footer/>
    </div>
  );
};

export default PostListingForm;