'use client'
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface FilterState {
  location: string;
  minPrice: string;
  maxPrice: string;
  priceRange: string;
  condition: string;
  deliveryType: string;
  deliveryDuration: string;
  seller: string;
}

const FiltersSidebarComponent: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    location: true,
    price: true,
    condition: true,
    deliveryType: true,
    deliveryDuration: true,
    seller: true
  });

  const [filters, setFilters] = useState<FilterState>({
    location: 'Enugu',
    minPrice: '',
    maxPrice: '',
    priceRange: 'under10k',
    condition: 'new',
    deliveryType: 'waybill',
    deliveryDuration: '1-5days',
    seller: 'verified'
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: string; 
    children: React.ReactNode 
  }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full py-3 text-left"
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {expandedSections[section] ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="mt-2">{children}</div>
      )}
    </div>
  );

  const RadioOption = ({ 
    name, 
    value, 
    label, 
    checked, 
    onChange 
  }: { 
    name: string; 
    value: string; 
    label: string; 
    checked: boolean; 
    onChange: () => void;
  }) => (
    <label className="flex items-center gap-2 py-2 cursor-pointer group">
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
          checked 
            ? 'border-orange-500 bg-white' 
            : 'border-gray-300 group-hover:border-gray-400'
        }`}>
          {checked && (
            <div className="absolute inset-0 m-1 rounded-full bg-orange-500" />
          )}
        </div>
      </div>
      <span className={`text-sm ${checked ? 'text-gray-900' : 'text-gray-600'}`}>
        {label}
      </span>
    </label>
  );

  return (
    <div className="w-[20%] bg-white rounded-lg border border-gray-200 p-4">
      {/* Location Section */}
      <FilterSection title="Location" section="location">
        <button 
          className="flex items-center justify-between w-full py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => console.log('Open location selector')}
        >
          <span className="text-sm text-gray-700">{filters.location}</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </FilterSection>

      {/* Price Section */}
      <FilterSection title="Price" section="price">
        <div className="space-y-3">
          {/* Price Range Inputs */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="w-[40%] px-3 placeholder-gray-500 text-black py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
            />
            <span className="text-gray-400">-</span>
            <input
              type="text"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-[40%] px-3 placeholder-gray-500 text-black py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
            />
            <button className="px-4 py-2 bg-[#3652AD] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Ok
            </button>
          </div>

          {/* Price Range Options */}
          <div className="space-y-1">
            <RadioOption
              name="priceRange"
              value="under10k"
              label="Under 10k"
              checked={filters.priceRange === 'under10k'}
              onChange={() => handleFilterChange('priceRange', 'under10k')}
            />
            <RadioOption
              name="priceRange"
              value="10k-20k"
              label="10k - 20k"
              checked={filters.priceRange === '10k-20k'}
              onChange={() => handleFilterChange('priceRange', '10k-20k')}
            />
            <RadioOption
              name="priceRange"
              value="20k-30k"
              label="20k - 30k"
              checked={filters.priceRange === '20k-30k'}
              onChange={() => handleFilterChange('priceRange', '20k-30k')}
            />
            <RadioOption
              name="priceRange"
              value="30k-50k"
              label="30k - 50k"
              checked={filters.priceRange === '30k-50k'}
              onChange={() => handleFilterChange('priceRange', '30k-50k')}
            />
            <RadioOption
              name="priceRange"
              value="50k-above"
              label="50k and above"
              checked={filters.priceRange === '50k-above'}
              onChange={() => handleFilterChange('priceRange', '50k-above')}
            />
          </div>
        </div>
      </FilterSection>

      {/* Condition Section */}
      <FilterSection title="Condition" section="condition">
        <div className="space-y-1">
          <RadioOption
            name="condition"
            value="all"
            label="All"
            checked={filters.condition === 'all'}
            onChange={() => handleFilterChange('condition', 'all')}
          />
          <RadioOption
            name="condition"
            value="new"
            label="New"
            checked={filters.condition === 'new'}
            onChange={() => handleFilterChange('condition', 'new')}
          />
          <RadioOption
            name="condition"
            value="used"
            label="Used"
            checked={filters.condition === 'used'}
            onChange={() => handleFilterChange('condition', 'used')}
          />
        </div>
      </FilterSection>

      {/* Delivery Type Section */}
      <FilterSection title="Delivery type" section="deliveryType">
        <div className="space-y-1">
          <RadioOption
            name="deliveryType"
            value="dispatch"
            label="Dispatch"
            checked={filters.deliveryType === 'dispatch'}
            onChange={() => handleFilterChange('deliveryType', 'dispatch')}
          />
          <RadioOption
            name="deliveryType"
            value="waybill"
            label="Waybill"
            checked={filters.deliveryType === 'waybill'}
            onChange={() => handleFilterChange('deliveryType', 'waybill')}
          />
          <RadioOption
            name="deliveryType"
            value="store-pickup"
            label="Store pickup"
            checked={filters.deliveryType === 'store-pickup'}
            onChange={() => handleFilterChange('deliveryType', 'store-pickup')}
          />
          <RadioOption
            name="deliveryType"
            value="courier"
            label="Courier"
            checked={filters.deliveryType === 'courier'}
            onChange={() => handleFilterChange('deliveryType', 'courier')}
          />
        </div>
      </FilterSection>

      {/* Delivery Duration Section */}
      <FilterSection title="Delivery duration" section="deliveryDuration">
        <div className="space-y-1">
          <RadioOption
            name="deliveryDuration"
            value="same-day"
            label="Same day"
            checked={filters.deliveryDuration === 'same-day'}
            onChange={() => handleFilterChange('deliveryDuration', 'same-day')}
          />
          <RadioOption
            name="deliveryDuration"
            value="1-5days"
            label="1-5days"
            checked={filters.deliveryDuration === '1-5days'}
            onChange={() => handleFilterChange('deliveryDuration', '1-5days')}
          />
          <RadioOption
            name="deliveryDuration"
            value="4-10days"
            label="4-10days"
            checked={filters.deliveryDuration === '4-10days'}
            onChange={() => handleFilterChange('deliveryDuration', '4-10days')}
          />
        </div>
      </FilterSection>

      {/* Seller Section */}
      <FilterSection title="Seller" section="seller">
        <div className="space-y-1">
          <RadioOption
            name="seller"
            value="all"
            label="All"
            checked={filters.seller === 'all'}
            onChange={() => handleFilterChange('seller', 'all')}
          />
          <RadioOption
            name="seller"
            value="verified"
            label="Verified"
            checked={filters.seller === 'verified'}
            onChange={() => handleFilterChange('seller', 'verified')}
          />
          <RadioOption
            name="seller"
            value="unverified"
            label="Unverified"
            checked={filters.seller === 'unverified'}
            onChange={() => handleFilterChange('seller', 'unverified')}
          />
        </div>
      </FilterSection>

      {/* Current Filters Display */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2 text-sm">Active Filters:</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <p><span className="font-medium">Location:</span> {filters.location}</p>
          <p><span className="font-medium">Price:</span> {filters.priceRange}</p>
          <p><span className="font-medium">Condition:</span> {filters.condition}</p>
          <p><span className="font-medium">Delivery:</span> {filters.deliveryType}</p>
          <p><span className="font-medium">Duration:</span> {filters.deliveryDuration}</p>
          <p><span className="font-medium">Seller:</span> {filters.seller}</p>
        </div>
      </div>
    </div>
  );
};

export default FiltersSidebarComponent;