// WarrantyInput Component

'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface WarrantyProps {
  value?: string;
  period?: 'Month' | 'Year';
  onChange?: (value: string, period: 'Month' | 'Year') => void;
}

export default function WarrantyInput({ 
  value = '', 
  period = 'Month', 
  onChange 
}: WarrantyProps) {
  const [warrantyValue, setWarrantyValue] = useState(value);
  const [warrantyPeriod, setWarrantyPeriod] = useState<'Month' | 'Year'>(period);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleValueChange = (newValue: string) => {
    // Only allow numbers
    const numericValue = newValue.replace(/\D/g, '');
    setWarrantyValue(numericValue);
    if (onChange) {
      onChange(numericValue, warrantyPeriod);
    }
  };

  const handlePeriodChange = (newPeriod: 'Month' | 'Year') => {
    setWarrantyPeriod(newPeriod);
    setShowDropdown(false);
    if (onChange) {
      onChange(warrantyValue, newPeriod);
    }
  };

  return (
    <div className='p-4 w-[90%] mx-auto bg-white rounded-2xl mt-[20px] border border-gray-200'>
      <label className="block text-gray-900 text-sm font-medium mb-2">
        Warranty <span className="text-gray-500 font-normal">(Optional)</span>
      </label>
      <div className="grid grid-cols-[1fr_auto] gap-3">
        {/* Number Input */}
        <input
          type="text"
          value={warrantyValue}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder="No. of months/years"
          className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {/* Period Dropdown */}
        <div className="relative w-32">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <span className="text-gray-900">{warrantyPeriod}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden">
              <button
                type="button"
                onClick={() => handlePeriodChange('Month')}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100"
              >
                Month
              </button>
              <button
                type="button"
                onClick={() => handlePeriodChange('Year')}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900"
              >
                Year
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}