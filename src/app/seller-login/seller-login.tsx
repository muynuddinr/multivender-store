'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SellerLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [registrationStep, setRegistrationStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Store fields
    storeName: '',
    storeDescription: '',
    storeCategory: '',
    gstNumber: '',
    panNumber: '',
    bankAccountName: '',
    bankAccountNumber: '',
    ifscCode: '',
    phone: '',
    // Address fields
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
  });
  const [storeLogoImage, setStoreLogoImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    // Validate first step before proceeding
    if (registrationStep === 1) {
      if (!formData.name.trim()) {
        setError("Name is required");
        return;
      }
      if (!formData.email.trim()) {
        setError("Email is required");
        return;
      }
      if (!formData.password) {
        setError("Password is required");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match");
        return;
      }
      
      setError('');
      setRegistrationStep(2);
    }
  };

  const prevStep = () => {
    setRegistrationStep(1);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // If on step 1 and in registration mode, just go to next step
    if (activeTab === 'register' && registrationStep === 1) {
      nextStep();
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      if (activeTab === 'login') {
        // Login API call
        const response = await fetch('/api/auth/seller/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        
        // Update auth context with user data
        login(data.user);
        
        // Redirect to seller dashboard after successful login
        router.push('/seller/dashboard');
      } else if (activeTab === 'register') {
        // For step 2, perform the registration
        // Validate store details before submitting
        if (!formData.storeName || !formData.storeCategory || !formData.phone || 
            !formData.addressLine1 || !formData.addressLine2 || !formData.city || 
            !formData.state || !formData.pinCode) {
          setError("Please fill all required fields");
          setIsLoading(false);
          return;
        }
        
        // Registration API call
        const response = await fetch('/api/auth/seller/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            storeLogoImage: storeLogoImage,
            address: {
              addressLine1: formData.addressLine1,
              addressLine2: formData.addressLine2,
              landmark: formData.landmark,
              city: formData.city,
              state: formData.state,
              pinCode: formData.pinCode,
              country: formData.country,
              phone: formData.phone
            },
            store: {
              name: formData.storeName,
              description: formData.storeDescription,
              category: formData.storeCategory,
              gstNumber: formData.gstNumber,
              panNumber: formData.panNumber,
              bankDetails: {
                accountName: formData.bankAccountName,
                accountNumber: formData.bankAccountNumber,
                ifscCode: formData.ifscCode
              }
            }
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }
        
        // Reset form and go back to login tab after successful registration
        setActiveTab('login');
        setRegistrationStep(1);
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          storeName: '',
          storeDescription: '',
          storeCategory: '',
          gstNumber: '',
          panNumber: '',
          bankAccountName: '',
          bankAccountNumber: '',
          ifscCode: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          landmark: '',
          city: '',
          state: '',
          pinCode: '',
          country: 'India',
        });
        setStoreLogoImage(null);
        alert('Registration successful! Please login to access your seller account.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Tab switching should reset the registration step
  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setRegistrationStep(1);
    setError('');
  };

  const renderRegistrationStep1 = () => (
    <>
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Store Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Store Logo
        </label>
        <div className="mt-1 flex items-center">
          <div className="flex-shrink-0">
            {storeLogoImage ? (
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden bg-gray-100">
                <img 
                  src={storeLogoImage} 
                  alt="Store logo preview" 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                <svg className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Change
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </>
  );

  const renderRegistrationStep2 = () => (
    <>
      <div className="text-sm text-gray-500 mb-4">
        Please provide your store information
      </div>

      {/* Store Name */}
      <div>
        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
          Store Name *
        </label>
        <div className="mt-1">
          <input
            id="storeName"
            name="storeName"
            type="text"
            required
            value={formData.storeName}
            onChange={handleInputChange}
            placeholder="e.g., Fashion World"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Store Description */}
      <div>
        <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700">
          Store Description
        </label>
        <div className="mt-1">
          <textarea
            id="storeDescription"
            name="storeDescription"
            rows={3}
            value={formData.storeDescription}
            onChange={handleInputChange}
            placeholder="Describe your store and products"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Store Category */}
      <div>
        <label htmlFor="storeCategory" className="block text-sm font-medium text-gray-700">
          Store Category *
        </label>
        <div className="mt-1">
          <select
            id="storeCategory"
            name="storeCategory"
            required
            value={formData.storeCategory}
            onChange={handleInputChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Category</option>
            <option value="Fashion">Fashion</option>
            <option value="Electronics">Electronics</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Beauty & Personal Care">Beauty & Personal Care</option>
            <option value="Books & Stationery">Books & Stationery</option>
            <option value="Sports & Fitness">Sports & Fitness</option>
            <option value="Toys & Games">Toys & Games</option>
            <option value="Food & Groceries">Food & Groceries</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Jewelry & Accessories">Jewelry & Accessories</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* GST Number */}
      <div>
        <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
          GST Number
        </label>
        <div className="mt-1">
          <input
            id="gstNumber"
            name="gstNumber"
            type="text"
            value={formData.gstNumber}
            onChange={handleInputChange}
            placeholder="e.g., 22AAAAA0000A1Z5"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* PAN Number */}
      <div>
        <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700">
          PAN Number
        </label>
        <div className="mt-1">
          <input
            id="panNumber"
            name="panNumber"
            type="text"
            value={formData.panNumber}
            onChange={handleInputChange}
            placeholder="e.g., AAAAA0000A"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Bank Details */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Bank Details</h3>
        
        <div className="space-y-3">
          <div>
            <label htmlFor="bankAccountName" className="block text-sm font-medium text-gray-700">
              Account Holder Name
            </label>
            <div className="mt-1">
              <input
                id="bankAccountName"
                name="bankAccountName"
                type="text"
                value={formData.bankAccountName}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700">
              Account Number
            </label>
            <div className="mt-1">
              <input
                id="bankAccountNumber"
                name="bankAccountNumber"
                type="text"
                value={formData.bankAccountNumber}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">
              IFSC Code
            </label>
            <div className="mt-1">
              <input
                id="ifscCode"
                name="ifscCode"
                type="text"
                value={formData.ifscCode}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number *
        </label>
        <div className="mt-1">
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="e.g., 9876543210"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Address Information */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Address Details</h3>
        
        {/* Address Line 1 */}
        <div className="space-y-3">
          <div>
            <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
              Flat/House No., Building Name *
            </label>
            <div className="mt-1">
              <input
                id="addressLine1"
                name="addressLine1"
                type="text"
                required
                value={formData.addressLine1}
                onChange={handleInputChange}
                placeholder="e.g., Flat 101, Sunshine Apartments"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          {/* Address Line 2 */}
          <div>
            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
              Area, Colony, Street *
            </label>
            <div className="mt-1">
              <input
                id="addressLine2"
                name="addressLine2"
                type="text"
                required
                value={formData.addressLine2}
                onChange={handleInputChange}
                placeholder="e.g., Gandhi Road, Jubilee Hills"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          {/* Landmark */}
          <div>
            <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">
              Landmark
            </label>
            <div className="mt-1">
              <input
                id="landmark"
                name="landmark"
                type="text"
                value={formData.landmark}
                onChange={handleInputChange}
                placeholder="e.g., Near City Mall"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City/Town/Village *
            </label>
            <div className="mt-1">
              <input
                id="city"
                name="city"
                type="text"
                required
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g., Mumbai"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          {/* State and PIN code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State *
              </label>
              <div className="mt-1">
                <select
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            
            <div>
              <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">
                PIN Code *
              </label>
              <div className="mt-1">
                <input
                  id="pinCode"
                  name="pinCode"
                  type="text"
                  required
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  placeholder="e.g., 400001"
                  maxLength={6}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
          Seller Portal
        </h2>
        
        {/* Tab Navigation */}
        <div className="mt-6 sm:mt-8 flex border-b">
          <button
            onClick={() => handleTabChange('login')}
            className={`flex-1 py-2 px-2 sm:px-4 text-center ${activeTab === 'login' 
              ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            Login
          </button>
          <button
            onClick={() => handleTabChange('register')}
            className={`flex-1 py-2 px-2 sm:px-4 text-center ${activeTab === 'register' 
              ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            Register
          </button>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8">
        <div className="bg-white py-6 sm:py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          {/* Form Progress Indicator (Only for Registration) */}
          {activeTab === 'register' && (
            <div className="mb-4">
              <div className="flex items-center">
                <div className={`flex-1 h-2 ${registrationStep === 1 ? 'bg-indigo-500' : 'bg-indigo-100'} rounded-l-full`}></div>
                <div className={`flex-1 h-2 ${registrationStep === 2 ? 'bg-indigo-500' : 'bg-indigo-100'} rounded-r-full`}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Account Information</span>
                <span>Store Details</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'login' ? (
              <>
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>
              </>
            ) : (
              // Registration Form - Show step based on current step
              <>{registrationStep === 1 ? renderRegistrationStep1() : renderRegistrationStep2()}</>
            )}

            {/* Navigation and Submit Buttons */}
            <div className={activeTab === 'register' && registrationStep === 2 ? "flex justify-between" : ""}>
              {/* Back Button (only show on step 2) */}
              {activeTab === 'register' && registrationStep === 2 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back
                </button>
              )}
              
              {/* Submit/Next Button */}
              <button
                type={activeTab === 'register' && registrationStep === 1 ? "button" : "submit"}
                onClick={activeTab === 'register' && registrationStep === 1 ? nextStep : undefined}
                disabled={isLoading}
                className={`${activeTab === 'register' && registrationStep === 2 ? "flex-1 ml-3" : "w-full"} flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {activeTab === 'login' ? 'Signing in...' : (registrationStep === 1 ? 'Processing...' : 'Creating account...')}
                  </span>
                ) : (
                  activeTab === 'login' ? 'Sign in' : (registrationStep === 1 ? 'Next' : 'Create Seller Account')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
