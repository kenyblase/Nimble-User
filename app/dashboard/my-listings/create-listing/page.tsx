'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import Footer from '@/app/components/Footer';
import { useCheckAuth } from '@/app/lib/hooks/useAuthApis/useCheckAuth';
import { useCreateProduct } from '@/app/lib/hooks/useProductApis/useCreateProduct';
import { useFetchCategories } from '@/app/lib/hooks/useCategoryApis/useFetchCategories';

interface BulkPrice {
  minQuantity: number;
  price: number;
}

const cities = ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Benin City', 'Kaduna'];
const states = ['Lagos', 'Abuja FCT', 'Rivers', 'Kano', 'Oyo', 'Edo', 'Kaduna'];
const conditions = ['Condition','New', 'Like New', 'Good', 'Fair', 'For Parts'];
const countries = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United States', 'United Kingdom'];
const deliveryLocations = ['Lagos', 'Abuja', 'Port Harcourt', 'Nationwide'];
const scopes = ['Nationwide', 'State-wide', 'City-only'];
const deliveryTypes = ['Same day', '1-2 days', '2-3 days', '4-6 days'];

export default function PostItemPage() {
  // Basic Product Information
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState(''); // Store category ID separately
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [condition, setCondition] = useState('New');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoLink, setVideoLink] = useState('');
  
  // Use hooks
  const { user, token, isAuthenticated, isLoading: authLoading } = useCheckAuth();
  const { createProduct, loading: createLoading, error, success, product } = useCreateProduct();
  const { categories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useFetchCategories();

  const [bulkPrices, setBulkPrices] = useState<BulkPrice[]>([
    { minQuantity: 2, price: 10000 },
    { minQuantity: 4, price: 9800 }
  ]);
  const [editingBulkIndex, setEditingBulkIndex] = useState<number | null>(null);
  const [editBulkQuantity, setEditBulkQuantity] = useState('');
  const [editBulkPrice, setEditBulkPrice] = useState('');

  // Warranty
  const [warrantyValue, setWarrantyValue] = useState('');
  const [warrantyPeriod, setWarrantyPeriod] = useState<'Month' | 'Year'>('Month');

  // Shipping
  const [shippedFromAbroad, setShippedFromAbroad] = useState(false);
  const [showShippingDetails, setShowShippingDetails] = useState(true);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [scope, setScope] = useState('');
  const [deliveryType, setDeliveryType] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingOptions, setShippingOptions] = useState<string[]>([]);
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [showNegotiableDetails, setShowNegotiableDetails] = useState(false);

  // Dropdown states
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [showWarrantyDropdown, setShowWarrantyDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showScopeDropdown, setShowScopeDropdown] = useState(false);
  const [showDeliveryTypeDropdown, setShowDeliveryTypeDropdown] = useState(false);
  const [showDaysDropdown, setShowDaysDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showShippingCityDropdown, setShowShippingCityDropdown] = useState(false);
  const [showShippingStateDropdown, setShowShippingStateDropdown] = useState(false);
  const [showShippingOptions, setShowShippingOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for click outside detection
  const categoryRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const conditionRef = useRef<HTMLDivElement>(null);
  const warrantyRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);
  const deliveryTypeRef = useRef<HTMLDivElement>(null);
  const daysRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const shippingCityRef = useRef<HTMLDivElement>(null);
  const shippingStateRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setShowStateDropdown(false);
      }
      if (conditionRef.current && !conditionRef.current.contains(event.target as Node)) {
        setShowConditionDropdown(false);
      }
      if (warrantyRef.current && !warrantyRef.current.contains(event.target as Node)) {
        setShowWarrantyDropdown(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (scopeRef.current && !scopeRef.current.contains(event.target as Node)) {
        setShowScopeDropdown(false);
      }
      if (deliveryTypeRef.current && !deliveryTypeRef.current.contains(event.target as Node)) {
        setShowDeliveryTypeDropdown(false);
      }
      if (daysRef.current && !daysRef.current.contains(event.target as Node)) {
        setShowDaysDropdown(false);
      }
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
      if (shippingCityRef.current && !shippingCityRef.current.contains(event.target as Node)) {
        setShowShippingCityDropdown(false);
      }
      if (shippingStateRef.current && !shippingStateRef.current.contains(event.target as Node)) {
        setShowShippingStateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loading = authLoading || createLoading || isSubmitting || categoriesLoading;

  // Handle authentication and categories loading
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting...');
      alert('Please login to create a product');
    }
  }, [authLoading, isAuthenticated]);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      console.log('Product created successfully:', product);
      alert('Product created successfully!');
      
      // Reset form after successful submission
      resetForm();
    }
    
    if (error) {
      console.error('Product creation error:', error);
      alert(`Error: ${error}`);
    }
  }, [success, error, product]);

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

  const toggleNegotiable = () => {
    const newValue = !isNegotiable;
    setIsNegotiable(newValue);
    setShowNegotiableDetails(newValue);
  };

  const addBulkPrice = () => {
    if (bulkPrices.length === 0) {
      const basePrice = Number(price) || 10000;
      setBulkPrices([{ minQuantity: 2, price: basePrice - 200 }]);
    } else {
      const lastPrice = bulkPrices[bulkPrices.length - 1];
      setBulkPrices([...bulkPrices, { minQuantity: lastPrice.minQuantity + 2, price: lastPrice.price - 200 }]);
    }
  };

  const removeBulkPrice = (index: number) => {
    setBulkPrices(bulkPrices.filter((_, i) => i !== index));
  };

  const startEditingBulk = (index: number) => {
    setEditingBulkIndex(index);
    setEditBulkQuantity(bulkPrices[index].minQuantity.toString());
    setEditBulkPrice(bulkPrices[index].price.toString());
  };

  const saveEditingBulk = () => {
    if (editingBulkIndex !== null) {
      const updated = [...bulkPrices];
      updated[editingBulkIndex] = {
        minQuantity: Number(editBulkQuantity),
        price: Number(editBulkPrice)
      };
      setBulkPrices(updated);
      setEditingBulkIndex(null);
      setEditBulkQuantity('');
      setEditBulkPrice('');
    }
  };

  const cancelEditingBulk = () => {
    setEditingBulkIndex(null);
    setEditBulkQuantity('');
    setEditBulkPrice('');
  };

  const handleWarrantyChange = (value: string, period: 'Month' | 'Year') => {
    setWarrantyValue(value);
    setWarrantyPeriod(period);
    setShowWarrantyDropdown(false);
  };

  const handleShippingOptionToggle = (option: string) => {
    if (shippingOptions.includes(option)) {
      setShippingOptions(shippingOptions.filter(o => o !== option));
    } else {
      setShippingOptions([...shippingOptions, option]);
    }
  };

  const toggleShippedFromAbroad = () => {
    setShippedFromAbroad(!shippedFromAbroad);
    if (!shippedFromAbroad) {
      setShowShippingDetails(true);
    }
  };

  const handleCategorySelect = (categoryName: string, categoryId: string) => {
    setCategory(categoryName);
    setCategoryId(categoryId);
    setShowCategoryDropdown(false);
  };

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setCategoryId('');
    setCity('');
    setState('');
    setCondition('New');
    setDescription('');
    setPrice('');
    setImages([]);
    setImagePreviews([]);
    setVideoLink('');
    setIsNegotiable(false);
    setShippedFromAbroad(false);
    setBulkPrices([{ minQuantity: 2, price: 10000 }, { minQuantity: 4, price: 9800 }]);
    setWarrantyValue('');
    setWarrantyPeriod('Month');
    setDeliveryLocation('');
    setScope('');
    setDeliveryType('');
    setNumberOfDays('');
    setShippingCountry('');
    setShippingCity('');
    setShippingState('');
    setShippingOptions([]);
  };

  const handleSubmit = async () => {
    if (loading || !isAuthenticated || !user || !token) {
      console.error('Cannot submit: Auth incomplete');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      const validationErrors = [];
      
      if (!title.trim()) validationErrors.push('Title');
      if (!categoryId.trim()) validationErrors.push('Category');
      if (!price.trim()) validationErrors.push('Price');
      if (!city.trim()) validationErrors.push('City');
      if (!state.trim()) validationErrors.push('State');
      if (!description.trim()) validationErrors.push('Description');
      
      if (validationErrors.length > 0) {
        alert(`Please fill in all required fields: ${validationErrors.join(', ')}`);
        return;
      }

      if (images.length === 0) {
        alert('Please upload at least one image');
        return;
      }

      // Prepare the data for API
      const productData: any = {
        name: title,
        description: description,
        price: Number(price.replace(/,/g, '')),
        condition: condition,
        location: JSON.stringify({
          city: city,
          state: state
        }),
        category: categoryId, // Send category ID
        isNegotiable: isNegotiable,
        isShippedFromAbroad: shippedFromAbroad,
        vendor: user._id || user.id
      };

      // Only include optional fields if they have values
      if (videoLink) {
        productData.videoLink = videoLink;
      }

      if (bulkPrices.length > 0) {
        productData.bulkPrices = JSON.stringify(bulkPrices.map(bp => ({
          quantity: bp.minQuantity,
          price: bp.price
        })));
      }

      if (shippingCountry && shippedFromAbroad) {
        productData.shippingAddress = JSON.stringify({
          country: shippingCountry,
          city: shippingCity || city,
          state: shippingState || state
        });
      }

      if (shippingOptions.length > 0) {
        productData.shippingOptions = JSON.stringify(shippingOptions);
      }

      if (deliveryLocation && shippedFromAbroad) {
        productData.deliveryTimelines = JSON.stringify([{
          location: deliveryLocation,
          scope: scope || 'Nationwide',
          deliveryType: deliveryType || 'Same day',
          numberOfDays: numberOfDays || '1-2 days'
        }]);
      }

      // Add warranty if exists
      if (warrantyValue) {
        productData.warranty = JSON.stringify({
          value: warrantyValue,
          period: warrantyPeriod
        });
      }

      console.log('Submitting product data:', productData);
      console.log('Image files:', images.length);
      console.log('Authenticated user:', user);
      
      // Call the createProduct hook with images
      await createProduct(productData, images);
      
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      alert('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading states
  // if (authLoading || categoriesLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-900 font-medium">
  //           {authLoading ? 'Checking authentication...' : 'Loading categories...'}
  //         </p>
  //         <p className="text-gray-600 text-sm mt-2">Please wait while we load the necessary data</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-6a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please login to create a product listing.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (categoriesError && !categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Categories</h2>
          <p className="text-gray-600 mb-4">{categoriesError}</p>
          <button
            onClick={() => refetchCategories()}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-900 font-medium">Creating your product...</p>
          <p className="text-gray-600 text-sm mt-2">Please wait while we upload your product</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 shadow sticky top-0 z-10">
        <button 
          className="text-gray-700 hover:text-gray-900"
          onClick={() => window.history.back()}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Post item</h1>
      </div>

      {success && (
        <div className="mx-4 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Product created successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                Error: {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Form Container */}
      <div className="space-y-4 mt-4">
        {/* Choose Categories Section */}
        <div className="p-4 w-[90%] mx-auto bg-white rounded-2xl border border-gray-200">
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-900 font-medium mb-3">
              Add product images *
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
                  disabled={images.length >= 5}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">Upload up to 5 images. Maximum size: 5MB each.</p>
          </div>

          {/* Video Link */}
          <div className="mb-6">
            <input
              type="text"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="Youtube or tiktok video link (optional)"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Category Dropdown */}
          <div className="mb-6" ref={categoryRef}>
            <label className="block text-gray-900 font-medium mb-3">
              Category *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => !categoriesLoading && setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={categoriesLoading}
              >
                <span className={category ? 'text-gray-900' : 'text-gray-500'}>
                  {category || 'Select a category'}
                </span>
                {categoriesLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                ) : (
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                )}
              </button>

              {showCategoryDropdown && categories.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.name, cat._id)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                    >
                      {cat.name}
                      {cat.description && (
                        <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {showCategoryDropdown && categories.length === 0 && !categoriesLoading && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                  <p className="text-gray-500 text-center">No categories available</p>
                </div>
              )}
            </div>
            {categoriesError && (
              <p className="text-red-500 text-sm mt-2">{categoriesError}</p>
            )}
          </div>
        </div>

        {/* Basic Product Information */}
        <div className="p-4 w-[90%] mx-auto bg-white rounded-2xl border border-gray-200 space-y-4">
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product title *"
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Location Section */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Location *</label>
            <div className="grid grid-cols-2 gap-2">
              {/* City Dropdown */}
              <div className="relative" ref={cityRef}>
                <button
                  type="button"
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <span className={city ? 'text-gray-900' : 'text-gray-400'}>
                    {city || 'City *'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCityDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {cities.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setCity(c);
                          setShowCityDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* State Dropdown */}
              <div className="relative" ref={stateRef}>
                <button
                  type="button"
                  onClick={() => setShowStateDropdown(!showStateDropdown)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <span className={state ? 'text-gray-900' : 'text-gray-400'}>
                    {state || 'State *'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showStateDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showStateDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {states.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setState(s);
                          setShowStateDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
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
          <div className="relative" ref={conditionRef}>
            <button
              type="button"
              onClick={() => setShowConditionDropdown(!showConditionDropdown)}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <span className="text-gray-900">{condition}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showConditionDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showConditionDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {conditions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCondition(c);
                      setShowConditionDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product in detail..."
              rows={4}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Negotiable Section */}
        <div className="p-4 w-[100%] mx-auto bg-white rounded-2xl border border-gray-200">
          {/* Negotiable Toggle */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-900 font-medium">Negotiable</span>
            <button
              type="button"
              onClick={toggleNegotiable}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isNegotiable ? 'bg-[#0973A8]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  isNegotiable ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Negotiable Details Dropdown */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isNegotiable && showNegotiableDetails ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-6 pt-4">
              {/* Price */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Price *</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 font-medium text-sm">₦</div>
                  <input
                    type="text"
                    value={price ? Number(price).toLocaleString() : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setPrice(value);
                    }}
                    placeholder="Enter price"
                    className="w-full bg-white border border-gray-300 rounded-md pl-8 pr-3 py-2 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* You will receive */}
              <div>
                <label className="block text-gray-700 text-sm mb-2">You will receive</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 font-medium text-sm">₦</div>
                  <input
                    type="text"
                    value={price ? calculateYouReceive(Number(price)) : '0'}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-300 rounded-md pl-8 pr-3 py-2 text-gray-900 text-sm"
                  />
                </div>
              </div>

              {/* Commission & VAT */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">Commission 10%</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 font-medium text-sm">₦</div>
                    <input
                      type="text"
                      value={price ? calculateCommission(Number(price)) : '0'}
                      readOnly
                      className="w-full bg-gray-50 border border-gray-300 rounded-md pl-8 pr-3 py-2 text-gray-900 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-2">VAT</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 font-medium text-sm">₦</div>
                    <input
                      type="text"
                      value="0"
                      readOnly
                      className="w-full bg-gray-50 border border-gray-300 rounded-md pl-8 pr-3 py-2 text-gray-900 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Bulk Pricing Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="text-sm text-gray-700 mb-3">From 2 pieces</div>
                {bulkPrices.map((bulk, index) => (
                  <div key={index} className="flex items-center justify-between mb-3 bg-gray-50 rounded-md p-3">
                    {editingBulkIndex === index ? (
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editBulkQuantity}
                            onChange={(e) => setEditBulkQuantity(e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm text-gray-900"
                            placeholder="Qty"
                          />
                          <input
                            type="number"
                            value={editBulkPrice}
                            onChange={(e) => setEditBulkPrice(e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm text-gray-900"
                            placeholder="Price"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={saveEditingBulk}
                            className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditingBulk}
                            className="flex-1 bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-700">From {bulk.minQuantity} pieces</span>
                          <span className="text-sm font-semibold text-gray-900">₦{bulk.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => startEditingBulk(index)}
                            className="text-[#3652AD] text-xs font-medium hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBulkPrice(index)}
                            className="text-[#E52B50] text-xs font-medium hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addBulkPrice}
                  className="flex items-center gap-2 text-[#3652AD] text-sm font-medium hover:text-blue-700 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add bulk price
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Warranty Section */}
        <div className='p-4 w-[100%] mx-auto bg-white rounded-2xl border border-gray-200'>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Warranty Information (Optional)</h2>
          <label className="block text-gray-900 text-sm font-medium mb-2">
            Warranty
          </label>
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <input
              type="text"
              value={warrantyValue}
              onChange={(e) => handleWarrantyChange(e.target.value.replace(/\D/g, ''), warrantyPeriod)}
              placeholder="No. of months/years"
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <div className="relative w-32" ref={warrantyRef}>
              <button
                type="button"
                onClick={() => setShowWarrantyDropdown(!showWarrantyDropdown)}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <span className="text-gray-900">{warrantyPeriod}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showWarrantyDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showWarrantyDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleWarrantyChange(warrantyValue, 'Month')}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100"
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWarrantyChange(warrantyValue, 'Year')}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900"
                  >
                    Year
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shipping Section */}
        <div className="p-4 w-[100%] mx-auto bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-900 font-medium">Shipped from abroad</span>
            <button
              type="button"
              onClick={toggleShippedFromAbroad}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                shippedFromAbroad ? 'bg-[#0973A8]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  shippedFromAbroad ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              shippedFromAbroad && showShippingDetails ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-6 pt-4">
              <div>
                <label className="block text-gray-900 font-medium mb-3">Delivery timeline</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="relative" ref={locationRef}>
                    <button
                      type="button"
                      onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className={deliveryLocation ? 'text-gray-900' : 'text-gray-400'}>
                        {deliveryLocation || 'Lagos'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {showLocationDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {deliveryLocations.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => {
                              setDeliveryLocation(loc);
                              setShowLocationDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={deliveryTypeRef}>
                    <button
                      type="button"
                      onClick={() => setShowDeliveryTypeDropdown(!showDeliveryTypeDropdown)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className={deliveryType ? 'text-gray-900' : 'text-gray-400'}>
                        {deliveryType || 'Same day'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {showDeliveryTypeDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {deliveryTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setDeliveryType(type);
                              setShowDeliveryTypeDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative" ref={scopeRef}>
                    <button
                      type="button"
                      onClick={() => setShowScopeDropdown(!showScopeDropdown)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className={scope ? 'text-gray-900' : 'text-gray-400'}>
                        {scope || 'Nationwide'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {showScopeDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {scopes.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setScope(s);
                              setShowScopeDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={daysRef}>
                    <button
                      type="button"
                      onClick={() => setShowDaysDropdown(!showDaysDropdown)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className={numberOfDays ? 'text-gray-900' : 'text-gray-400 text-[13px]'}>
                        {numberOfDays || 'Number of days'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {showDaysDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {['1-2 days', '2-3 days', '4-6 days'].map((days) => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => {
                              setNumberOfDays(days);
                              setShowDaysDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            {days}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-2 text-[#3652AD] font-medium text-sm mt-3 hover:text-[#3652AD]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#3652AD] flex items-center justify-center">
                    <Plus className="w-3 h-3 text-white" />
                  </div>
                  Add another location
                </button>
              </div>

              <div>
                <label className="block text-gray-900 font-medium mb-3">Shipping address</label>
                
                <div className="relative mb-3" ref={countryRef}>
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className={shippingCountry ? 'text-gray-900' : 'text-gray-400'}>
                      {shippingCountry || 'Country'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {showCountryDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {countries.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setShippingCountry(c);
                            setShowCountryDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative" ref={shippingCityRef}>
                    <button
                      type="button"
                      onClick={() => setShowShippingCityDropdown(!showShippingCityDropdown)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className={shippingCity ? 'text-gray-900' : 'text-gray-400'}>
                        {shippingCity || 'City'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {showShippingCityDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {cities.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setShippingCity(c);
                              setShowShippingCityDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={shippingStateRef}>
                    <button
                      type="button"
                      onClick={() => setShowShippingStateDropdown(!showShippingStateDropdown)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span className={shippingState ? 'text-gray-900' : 'text-gray-400'}>
                        {shippingState || 'State'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {showShippingStateDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {states.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setShippingState(s);
                              setShowShippingStateDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowShippingOptions(!showShippingOptions)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="text-gray-900 font-medium">Shipping option</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showShippingOptions ? 'rotate-180' : ''}`} />
                </button>

                {showShippingOptions && (
                  <div className="mt-3 space-y-3 pl-1">
                    {['Waybill', 'Courier service', 'Dispatch service'].map((option) => (
                      <label key={option} className="flex items-center justify-between cursor-pointer">
                        <span className="text-gray-900">{option}</span>
                        <input
                          type="checkbox"
                          checked={shippingOptions.includes(option)}
                          onChange={() => handleShippingOptionToggle(option)}
                          className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:bg-[#3652AD] checked:border-[#3652AD]"
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-4 w-[100%] mx-auto">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !isAuthenticated}
            className={`w-full font-semibold py-3 rounded-[100px] transition-colors ${
              loading || !isAuthenticated
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-[#3652AD] text-white hover:bg-[#3652AD]'
            }`}
          >
            {loading ? 'Creating Product...' : 'Post Item'}
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}