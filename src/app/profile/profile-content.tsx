'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiUser, FiShoppingBag, FiHeart, FiClock, FiMapPin, FiSettings, FiLogOut } from 'react-icons/fi';
import { MdOutlineLocalShipping, MdOutlineRateReview } from 'react-icons/md';
import { BiSupport } from 'react-icons/bi';
import AddressForm from '@/app/Components/AddressForm';
import Footer from '@/app/Components/Footer';

export default function ProfileContent() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Address management state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressActionLoading, setAddressActionLoading] = useState(false);

  // Account settings state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/customer-login');
      return;
    }

    if (user) {
      fetchUserDetails();
    }
  }, [user, loading, router]);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      
      const data = await response.json();
      setUserDetails(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleAddAddress = async (address: any) => {
    setAddressActionLoading(true);
    try {
      const response = await fetch('/api/user/address', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update the user details with the new address
        setUserDetails({
          ...userDetails,
          address: data.address
        });
        setShowAddressForm(false);
        setIsEditingAddress(false);
      } else {
        const error = await response.json();
        alert(`Failed to add address: ${error.message}`);
      }
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to add address. Please try again.');
    } finally {
      setAddressActionLoading(false);
    }
  };
  
  const handleUpdateAddress = async (address: any) => {
    setAddressActionLoading(true);
    try {
      const response = await fetch('/api/user/address', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update the user details with the updated address
        setUserDetails({
          ...userDetails,
          address: data.address
        });
        setShowAddressForm(false);
        setIsEditingAddress(false);
      } else {
        const error = await response.json();
        alert(`Failed to update address: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Failed to update address. Please try again.');
    } finally {
      setAddressActionLoading(false);
    }
  };
  
  const handleDeleteAddress = async () => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddressActionLoading(true);
      try {
        const response = await fetch('/api/user/address', {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Remove the address from user details
          setUserDetails({
            ...userDetails,
            address: undefined
          });
        } else {
          const error = await response.json();
          alert(`Failed to delete address: ${error.message}`);
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Failed to delete address. Please try again.');
      } finally {
        setAddressActionLoading(false);
      }
    }
  };
  
  // Begin editing address
  const startEditAddress = () => {
    setIsEditingAddress(true);
    setShowAddressForm(true);
  };
  
  // Begin adding new address
  const startAddAddress = () => {
    setIsEditingAddress(false);
    setShowAddressForm(true);
  };
  
  // Cancel address form
  const cancelAddressForm = () => {
    setShowAddressForm(false);
    setIsEditingAddress(false);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSettings = async (type: 'password' | 'profile') => {
    setSettingsError('');
    setSettingsSuccess('');
    setIsUpdatingSettings(true);
    
    try {
      // Validate input
      if (type === 'password') {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
          throw new Error('All password fields are required');
        }
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        
        if (passwordData.newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters long');
        }
      }
      
      // Prepare request payload
      const payload: any = {};
      if (type === 'password') {
        payload.currentPassword = passwordData.currentPassword;
        payload.newPassword = passwordData.newPassword;
      } else if (type === 'profile') {
        payload.profileImage = newProfileImage;
      }
      
      // Call the API
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update settings');
      }
      
      const data = await response.json();
      
      // Update local state
      if (type === 'password') {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setSettingsSuccess('Password updated successfully');
      } else if (type === 'profile') {
        setUserDetails({
          ...userDetails,
          profileImage: data.user.profileImage
        });
        setNewProfileImage(null);
        setSettingsSuccess('Profile picture updated successfully');
      }
    } catch (error: any) {
      setSettingsError(error.message);
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow bg-gray-50 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-12 border border-gray-100">
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-8 sm:px-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-pattern opacity-10" style={{backgroundImage: "url('/pattern.svg')"}}></div>
              <div className="relative z-10 flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                    {userDetails?.profileImage ? (
                      <img src={userDetails.profileImage} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <FiUser className="h-12 w-12 text-indigo-500"/>
                    )}
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold leading-tight">{userDetails?.name || 'User'}</h3>
                  <p className="text-md opacity-90 mt-1">{userDetails?.email || ''}</p>
                  <p className="text-sm opacity-80 mt-2 flex items-center">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                    Customer since {new Date(userDetails?.createdAt || Date.now()).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-72 bg-gray-50 border-r border-gray-200">
                <nav className="p-4 space-y-1.5">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-4 py-3.5 text-sm rounded-lg transition-all duration-200 ${
                      activeTab === 'profile' 
                        ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiUser className={`mr-3 flex-shrink-0 h-5 w-5 ${activeTab === 'profile' ? 'text-indigo-500' : ''}`} />
                    <span>My Profile</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center px-4 py-3.5 text-sm rounded-lg transition-all duration-200 ${
                      activeTab === 'orders' 
                        ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiShoppingBag className={`mr-3 flex-shrink-0 h-5 w-5 ${activeTab === 'orders' ? 'text-indigo-500' : ''}`} />
                    <span>My Orders</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full flex items-center px-4 py-3.5 text-sm rounded-lg transition-all duration-200 ${
                      activeTab === 'wishlist' 
                        ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiHeart className={`mr-3 flex-shrink-0 h-5 w-5 ${activeTab === 'wishlist' ? 'text-indigo-500' : ''}`} />
                    <span>Wishlist</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`w-full flex items-center px-4 py-3.5 text-sm rounded-lg transition-all duration-200 ${
                      activeTab === 'history' 
                        ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiClock className={`mr-3 flex-shrink-0 h-5 w-5 ${activeTab === 'history' ? 'text-indigo-500' : ''}`} />
                    <span>Browsing History</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('address')}
                    className={`w-full flex items-center px-4 py-3.5 text-sm rounded-lg transition-all duration-200 ${
                      activeTab === 'address' 
                        ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiMapPin className={`mr-3 flex-shrink-0 h-5 w-5 ${activeTab === 'address' ? 'text-indigo-500' : ''}`} />
                    <span>My Addresses</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('returns')}
                    className={`w-full flex items-center px-4 py-3.5 text-sm rounded-lg transition-all duration-200 ${
                      activeTab === 'returns' 
                        ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MdOutlineLocalShipping className={`mr-3 flex-shrink-0 h-5 w-5 ${activeTab === 'returns' ? 'text-indigo-500' : ''}`} />
                    <span>Returns & Refunds</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`w-full flex items-center px-4 py-3.5 text-sm rounded-lg transition-all duration-200 ${
                      activeTab === 'reviews' 
                        ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MdOutlineRateReview className={`mr-3 flex-shrink-0 h-5 w-5 ${activeTab === 'reviews' ? 'text-indigo-500' : ''}`} />
                    <span>My Reviews</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center px-4 py-3.5 text-sm rounded-lg transition-all duration-200 ${
                      activeTab === 'settings' 
                        ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiSettings className={`mr-3 flex-shrink-0 h-5 w-5 ${activeTab === 'settings' ? 'text-indigo-500' : ''}`} />
                    <span>Account Settings</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('support')}
                    className={`w-full flex items-center px-4 py-3.5 text-sm rounded-lg transition-all duration-200 ${
                      activeTab === 'support' 
                        ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <BiSupport className={`mr-3 flex-shrink-0 h-5 w-5 ${activeTab === 'support' ? 'text-indigo-500' : ''}`} />
                    <span>Help & Support</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3.5 text-sm rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <FiLogOut className="mr-3 flex-shrink-0 h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>

              <div className="flex-grow p-6">
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">My Profile Information</h2>
                    
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </div>
                    )}
                    
                    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg mb-6">
                      <div className="px-5 py-4 sm:px-6 bg-gradient-to-r from-gray-50 to-white border-b">
                        <h3 className="text-base font-semibold leading-6 text-gray-900 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          Personal Information
                        </h3>
                      </div>
                      <div className="px-5 py-6 sm:p-6">
                        <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                          <div className="relative group">
                            <dt className="text-sm font-medium text-gray-500 mb-1">Full name</dt>
                            <dd className="text-base text-gray-900 p-2 rounded-md bg-gray-50 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all">
                              {userDetails?.name || 'Not provided'}
                            </dd>
                          </div>
                          <div className="relative group">
                            <dt className="text-sm font-medium text-gray-500 mb-1">Email address</dt>
                            <dd className="text-base text-gray-900 p-2 rounded-md bg-gray-50 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all">
                              {userDetails?.email || 'Not provided'}
                            </dd>
                          </div>
                          <div className="relative group">
                            <dt className="text-sm font-medium text-gray-500 mb-1">Phone number</dt>
                            <dd className="text-base text-gray-900 p-2 rounded-md bg-gray-50 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all">
                              {userDetails?.address?.phone || 'Not provided'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
                      <div className="px-5 py-4 sm:px-6 bg-gradient-to-r from-gray-50 to-white border-b">
                        <h3 className="text-base font-semibold leading-6 text-gray-900 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Address Information
                        </h3>
                      </div>
                      <div className="px-5 py-6 sm:p-6">
                        {userDetails?.address ? (
                          <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-2 relative group">
                              <dt className="text-sm font-medium text-gray-500 mb-1">Street address</dt>
                              <dd className="text-base text-gray-900 p-3 rounded-md bg-gray-50 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all">
                                {userDetails.address.addressLine1}<br />
                                {userDetails.address.addressLine2}
                                {userDetails.address.landmark && <><br />{userDetails.address.landmark}</>}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500 mb-1">City</dt>
                              <dd className="text-base text-gray-900 p-2 rounded-md bg-gray-50 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all">
                                {userDetails.address.city}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500 mb-1">State</dt>
                              <dd className="text-base text-gray-900 p-2 rounded-md bg-gray-50 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all">
                                {userDetails.address.state}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500 mb-1">PIN Code</dt>
                              <dd className="text-base text-gray-900 p-2 rounded-md bg-gray-50 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all">
                                {userDetails.address.pinCode}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500 mb-1">Country</dt>
                              <dd className="text-base text-gray-900 p-2 rounded-md bg-gray-50 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all">
                                {userDetails.address.country}
                              </dd>
                            </div>
                          </dl>
                        ) : (
                          <div className="text-center py-8 px-4">
                            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-200 inline-block">
                              <FiMapPin className="mx-auto h-8 w-8 text-gray-400" />
                              <p className="mt-2 text-sm font-medium text-gray-600">No address information provided.</p>
                              <button
                                onClick={startAddAddress}
                                className="mt-3 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all"
                              >
                                + Add Address
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">My Orders</h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                      <div className="text-center py-12">
                        <FiShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Your order history will appear here</p>
                        <div className="mt-6">
                          <button
                            onClick={() => router.push('/')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Start Shopping
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">My Wishlist</h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                      <div className="text-center py-12">
                        <FiHeart className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
                        <p className="mt-1 text-sm text-gray-500">Save items you like to your wishlist</p>
                        <div className="mt-6">
                          <button
                            onClick={() => router.push('/')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Explore Products
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'history' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Browsing History</h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                      <div className="text-center py-12">
                        <FiClock className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No browsing history</h3>
                        <p className="mt-1 text-sm text-gray-500">Products you view will appear here</p>
                        <div className="mt-6">
                          <button
                            onClick={() => router.push('/')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Browse Products
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'address' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-900">My Addresses</h2>
                      {!showAddressForm && (
                        <button 
                          onClick={startAddAddress}
                          disabled={addressActionLoading}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          + Add New Address
                        </button>
                      )}
                    </div>
                    
                    {showAddressForm ? (
                      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {isEditingAddress ? 'Edit Address' : 'Add New Address'}
                        </h3>
                        <AddressForm 
                          initialAddress={isEditingAddress ? userDetails?.address : undefined}
                          onSubmit={isEditingAddress ? handleUpdateAddress : handleAddAddress}
                          onCancel={cancelAddressForm}
                        />
                      </div>
                    ) : userDetails?.address ? (
                      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Default Address</h3>
                            <p className="text-sm text-gray-500 mt-2">
                              {userDetails.address.addressLine1}<br />
                              {userDetails.address.addressLine2}
                              {userDetails.address.landmark && <><br />{userDetails.address.landmark}</>}<br />
                              {userDetails.address.city}, {userDetails.address.state} {userDetails.address.pinCode}<br />
                              {userDetails.address.country}<br />
                              Phone: {userDetails.address.phone}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button 
                              onClick={startEditAddress}
                              disabled={addressActionLoading}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-700 hover:text-indigo-900 focus:outline-none"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={handleDeleteAddress}
                              disabled={addressActionLoading}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                        <div className="text-center py-12">
                          <FiMapPin className="mx-auto h-12 w-12 text-gray-300" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses saved</h3>
                          <p className="mt-1 text-sm text-gray-500">Add a new shipping address</p>
                          <div className="mt-6">
                            <button 
                              onClick={startAddAddress}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Add New Address
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h2>
                    
                    {settingsError && (
                      <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                        {settingsError}
                      </div>
                    )}
                    
                    {settingsSuccess && (
                      <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
                        {settingsSuccess}
                      </div>
                    )}
                    
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                      <div className="px-4 py-5 sm:px-6 bg-gray-50">
                        <h3 className="text-md font-medium leading-6 text-gray-900">Profile Picture</h3>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                            {newProfileImage ? (
                              <img src={newProfileImage} alt="New profile" className="h-full w-full object-cover" />
                            ) : userDetails?.profileImage ? (
                              <img src={userDetails.profileImage} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                              <FiUser className="h-10 w-10 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="ml-5">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                            />
                            
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Change Picture
                            </button>
                            
                            {newProfileImage && (
                              <div className="mt-3 flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateSettings('profile')}
                                  disabled={isUpdatingSettings}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                  {isUpdatingSettings ? 'Updating...' : 'Save Picture'}
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => setNewProfileImage(null)}
                                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6 bg-gray-50">
                        <h3 className="text-md font-medium leading-6 text-gray-900">Change Password</h3>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                              Current Password
                            </label>
                            <input
                              type="password"
                              id="currentPassword"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                              New Password
                            </label>
                            <input
                              type="password"
                              id="newPassword"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateSettings('password')}
                              disabled={isUpdatingSettings}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                              {isUpdatingSettings ? 'Updating...' : 'Update Password'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'returns' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Returns & Refunds</h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                      <div className="text-center py-12">
                        <MdOutlineLocalShipping className="mx-auto h-12 w-12 text-gray-300" />
                        
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Coming Soon</h3>
                        <p className="mt-1 text-sm text-gray-500">This feature is currently under development</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">My Reviews</h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                      <div className="text-center py-12">
                        <MdOutlineRateReview className="mx-auto h-12 w-12 text-gray-300" />
                        
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Coming Soon</h3>
                        <p className="mt-1 text-sm text-gray-500">This feature is currently under development</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'support' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Help & Support</h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                      <div className="text-center py-12">
                        <BiSupport className="mx-auto h-12 w-12 text-gray-300" />
                        
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Coming Soon</h3>
                        <p className="mt-1 text-sm text-gray-500">This feature is currently under development</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 