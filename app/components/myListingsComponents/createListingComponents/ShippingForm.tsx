// ShippingForm Component
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

interface ShippingFormProps {
  onSubmit?: (data: ShippingFormData) => void;
}

interface ShippingFormData {
  shippedFromAbroad: boolean;
  deliveryTimeline: {
    location?: string;
    scope?: string;
    deliveryType?: string;
    numberOfDays?: string;
  };
  shippingAddress: {
    country?: string;
    city?: string;
    state?: string;
  };
  shippingOptions: string[];
}

const countries = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United States', 'United Kingdom'];
const cities = ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan'];
const states = ['Lagos', 'Abuja FCT', 'Rivers', 'Kano', 'Oyo'];
const locations = ['Lagos', 'Abuja', 'Port Harcourt', 'Nationwide'];
const scopes = ['Nationwide', 'State-wide', 'City-only'];
const deliveryTypes = ['Same day', '1-2 days', '2-3 days', '4-6 days'];

export default function ShippingForm({ onSubmit }: ShippingFormProps) {
  const [shippedFromAbroad, setShippedFromAbroad] = useState(false);
  const [showShippingDetails, setShowShippingDetails] = useState(true);
  
  // Delivery timeline
  const [location, setLocation] = useState('');
  const [scope, setScope] = useState('');
  const [deliveryType, setDeliveryType] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showScopeDropdown, setShowScopeDropdown] = useState(false);
  const [showDeliveryTypeDropdown, setShowDeliveryTypeDropdown] = useState(false);
  const [showDaysDropdown, setShowDaysDropdown] = useState(false);
  
  // Shipping address
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  
  // Shipping options
  const [showShippingOptions, setShowShippingOptions] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<string[]>([]);

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

  return (
    <div className="p-4 w-[90%] mx-auto bg-white rounded-2xl mt-[20px] border border-gray-200">
      {/* Shipped from abroad toggle */}
      <div className="flex items-center justify-between">
        <span className="text-gray-900 font-medium">Shipped from abroad</span>
        <button
          type="button"
          onClick={toggleShippedFromAbroad}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            shippedFromAbroad ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              shippedFromAbroad ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Collapsible shipping details */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          shippedFromAbroad && showShippingDetails ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-6 pt-4">
          {/* Delivery timeline */}
          <div>
            <label className="block text-gray-900 font-medium mb-3">Delivery timeline</label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Location Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className={location ? 'text-gray-900' : 'text-gray-400'}>
                    {location || 'Lagos'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showLocationDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setLocation(loc);
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

              {/* Delivery Type Dropdown */}
              <div className="relative">
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
              {/* Scope Dropdown */}
              <div className="relative">
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

              {/* Number of Days Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDaysDropdown(!showDaysDropdown)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className={numberOfDays ? 'text-gray-900' : 'text-gray-400'}>
                    {numberOfDays || 'Number of days'}
                  </span>
                  <ChevronUp className="w-4 h-4 text-gray-400" />
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
              className="flex items-center gap-2 text-blue-600 font-medium text-sm mt-3 hover:text-blue-700"
            >
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
              Add another loction
            </button>
          </div>

          {/* Shipping address */}
          <div>
            <label className="block text-gray-900 font-medium mb-3">Shipping address</label>
            
            {/* Country Dropdown */}
            <div className="relative mb-3">
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className={country ? 'text-gray-900' : 'text-gray-400'}>
                  {country || 'Country'}
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
                        setCountry(c);
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
              {/* City Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className={city ? 'text-gray-900' : 'text-gray-400'}>
                    {city || 'City'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showCityDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {cities.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setCity(c);
                          setShowCityDropdown(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-b-0"
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
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className={state ? 'text-gray-900' : 'text-gray-400'}>
                    {state || 'State'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showStateDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {states.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setState(s);
                          setShowStateDropdown(false);
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

          {/* Shipping options */}
          <div>
            <button
              type="button"
              onClick={() => setShowShippingOptions(!showShippingOptions)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-gray-900 font-medium">Shipping option</span>
              <ChevronUp className={`w-5 h-5 text-gray-400 transition-transform ${showShippingOptions ? 'rotate-180' : ''}`} />
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
                      className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:bg-blue-600 checked:border-blue-600"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}