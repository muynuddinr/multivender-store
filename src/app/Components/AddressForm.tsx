'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

interface AddressFormProps {
  initialAddress?: {
    addressLine1: string;
    addressLine2: string;
    landmark?: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
    phone: string;
  };
  onSubmit: (address: any) => void;
  onCancel: () => void;
}

export default function AddressForm({ initialAddress, onSubmit, onCancel }: AddressFormProps) {
  const [address, setAddress] = useState({
    addressLine1: initialAddress?.addressLine1 || '',
    addressLine2: initialAddress?.addressLine2 || '',
    landmark: initialAddress?.landmark || '',
    city: initialAddress?.city || '',
    state: initialAddress?.state || '',
    pinCode: initialAddress?.pinCode || '',
    country: initialAddress?.country || 'India',
    phone: initialAddress?.phone || ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validation
    if (!address.addressLine1 || !address.addressLine2 || !address.city || 
        !address.state || !address.pinCode || !address.phone) {
      setError("Please fill all required fields");
      setIsLoading(false);
      return;
    }
    
    onSubmit(address);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-200 text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
          Flat/House No., Building Name
        </label>
        <input
          id="addressLine1"
          name="addressLine1"
          type="text"
          required
          value={address.addressLine1}
          onChange={handleChange}
          placeholder="e.g., Flat 101, Sunshine Apartments"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      
      <div>
        <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
          Area, Colony, Street
        </label>
        <input
          id="addressLine2"
          name="addressLine2"
          type="text"
          required
          value={address.addressLine2}
          onChange={handleChange}
          placeholder="e.g., Gandhi Road, Jubilee Hills"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      
      <div>
        <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">
          Landmark (Optional)
        </label>
        <input
          id="landmark"
          name="landmark"
          type="text"
          value={address.landmark}
          onChange={handleChange}
          placeholder="e.g., Near City Mall"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City/Town/Village
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            value={address.city}
            onChange={handleChange}
            placeholder="e.g., Mumbai"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <select
            id="state"
            name="state"
            required
            value={address.state}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select State</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">
            PIN Code
          </label>
          <input
            id="pinCode"
            name="pinCode"
            type="text"
            required
            value={address.pinCode}
            onChange={handleChange}
            placeholder="e.g., 400001"
            maxLength={6}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={address.phone}
            onChange={handleChange}
            placeholder="e.g., 9876543210"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </form>
  );
} 