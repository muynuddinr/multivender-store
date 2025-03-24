'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CustomerLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [registrationStep, setRegistrationStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Address fields
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
    phone: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        setProfileImage(reader.result as string);
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
      if (activeTab === 'register') {
        // Add this before the registration API call
        if (!formData.addressLine1 || !formData.addressLine2 || !formData.city || 
            !formData.state || !formData.pinCode || !formData.phone) {
          setError("Please fill all required address fields");
          setIsLoading(false);
          return;
        }
        
        // For step 2, perform the registration
        // Registration API call
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            profileImage: profileImage,
            address: {
              addressLine1: formData.addressLine1,
              addressLine2: formData.addressLine2,
              landmark: formData.landmark,
              city: formData.city,
              state: formData.state,
              pinCode: formData.pinCode,
              country: formData.country,
              phone: formData.phone
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
          addressLine1: '',
          addressLine2: '',
          landmark: '',
          city: '',
          state: '',
          pinCode: '',
          country: 'India',
          phone: '',
        });
        setProfileImage(null);
        alert('Registration successful! Please login.');
      } else {
        // Login API call
        const response = await fetch('/api/auth/login', {
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
        
        // Redirect to homepage or dashboard after successful login
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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

      {/* Profile Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Profile Picture
        </label>
        <div className="mt-2 flex flex-col sm:flex-row items-center gap-3 sm:space-x-5">
          <div className="flex-shrink-0">
            {profileImage ? (
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden bg-gray-100">
                <img 
                  src={profileImage} 
                  alt="Profile preview" 
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
            className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
        Please provide your address information
      </div>

      {/* Address Line 1 */}
      <div>
        <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
          Flat/House No., Building Name
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
          Area, Colony, Street
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
          City/Town/Village
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

      {/* Two column layout for State and PIN Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
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
            PIN Code
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

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
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
    </>
  );

  // Tab switching should reset the registration step
  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setRegistrationStep(1);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col justify-center pt-16 pb-6 sm:pt-24 sm:pb-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-400 opacity-5 rounded-bl-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-400 opacity-5 rounded-tr-full -z-10"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-400 opacity-5 rounded-full blur-3xl -z-10"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
        <div className="flex flex-col lg:flex-row bg-white overflow-hidden rounded-2xl shadow-2xl">
          {/* Left side - Image/Branding (only visible on lg screens) */}
          <div className="lg:w-1/2 relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700"></div>
            <div className="absolute inset-0 opacity-20 mix-blend-overlay"
                 style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&q=80")', 
                          backgroundSize: 'cover', backgroundPosition: 'center' }}>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
              <img 
                src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80" 
                alt="Store Logo" 
                className="h-24 w-24 rounded-2xl shadow-2xl border-2 border-white object-cover mb-8"
              />
              <h2 className="text-3xl font-bold mb-3 text-center">Welcome to Our Store</h2>
              <p className="text-white/80 text-center mb-8">Discover amazing products and enjoy a seamless shopping experience</p>
              <div className="flex space-x-3">
                <span className="h-2 w-2 rounded-full bg-white/30"></span>
                <span className="h-2 w-2 rounded-full bg-white/60"></span>
                <span className="h-2 w-2 rounded-full bg-white"></span>
                <span className="h-2 w-2 rounded-full bg-white/60"></span>
                <span className="h-2 w-2 rounded-full bg-white/30"></span>
              </div>
            </div>
          </div>
          
          {/* Right side - Form */}
          <div className="p-6 sm:p-10 lg:w-1/2">
            {/* Mobile logo - only visible on smaller screens */}
            <div className="flex justify-center lg:hidden mb-6">
              <img 
                src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80" 
                alt="Store Logo" 
                className="h-16 w-16 rounded-xl shadow-lg border-2 border-white object-cover"
              />
            </div>
            
            <h2 className="text-center text-2xl font-bold text-gray-900 lg:text-left mb-1">
              {activeTab === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </h2>
            <p className="text-center text-sm text-gray-600 lg:text-left mb-6">
              {activeTab === 'login' ? 
                'Enter your credentials to continue shopping' : 
                'Fill in your details to get started'}
            </p>
            
            {/* Tab Navigation */}
            <div className="flex mb-8 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => handleTabChange('login')}
                className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                  activeTab === 'login' 
                    ? 'bg-white shadow-md text-blue-600 font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </div>
              </button>
              <button
                onClick={() => handleTabChange('register')}
                className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                  activeTab === 'register' 
                    ? 'bg-white shadow-md text-blue-600 font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register
                </div>
              </button>
            </div>
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            
            {/* Form Progress Indicator (Only for Registration) */}
            {activeTab === 'register' && (
              <div className="mb-6">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    registrationStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  } z-10 text-sm font-medium`}>
                    1
                  </div>
                  <div className={`flex-1 h-0.5 ${
                    registrationStep > 1 ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    registrationStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  } z-10 text-sm font-medium`}>
                    2
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500 px-1">
                  <span>Personal Details</span>
                  <span>Address Information</span>
                </div>
              </div>
            )}
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              {activeTab === 'login' ? (
                <>
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="••••••••"
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
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
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
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                  </button>
                )}
                
                {/* Submit/Next Button */}
                <button
                  type={activeTab === 'register' && registrationStep === 1 ? "button" : "submit"}
                  onClick={activeTab === 'register' && registrationStep === 1 ? nextStep : undefined}
                  disabled={isLoading}
                  className={`${activeTab === 'register' && registrationStep === 2 ? "flex-1 ml-3" : "w-full"} flex justify-center py-2 px-6 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200`}
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
                    <span className="flex items-center">
                      {activeTab === 'login' ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Sign in
                        </>
                      ) : (
                        registrationStep === 1 ? (
                          <>
                            Next
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Create Account
                          </>
                        )
                      )}
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Social Login Options */}
            {activeTab === 'login' && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"/>
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 text-[#4285F4]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/>
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 text-[#333]" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Additional info section */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {activeTab === 'login' ? 
                  "Don't have an account? " : 
                  "Already have an account? "}
                <button
                  type="button"
                  onClick={() => handleTabChange(activeTab === 'login' ? 'register' : 'login')}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  {activeTab === 'login' ? 'Sign up now' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
