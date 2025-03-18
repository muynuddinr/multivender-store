'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiUser, FiShoppingBag, FiHeart, FiClock, FiMapPin, FiSettings, FiLogOut } from 'react-icons/fi';
import { MdOutlineLocalShipping, MdOutlineRateReview } from 'react-icons/md';
import { BiSupport } from 'react-icons/bi';

export default function ProfileContent() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Header with user basic info */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-5 sm:px-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white">
                  {userDetails?.profileImage ? (
                    <img src={userDetails.profileImage} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <FiUser className="h-8 w-8 text-indigo-500" />
                  )}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium leading-6">{userDetails?.name || 'User'}</h3>
                <p className="text-sm opacity-80">{userDetails?.email || ''}</p>
                <p className="text-sm opacity-80 mt-1">Customer since {new Date(userDetails?.createdAt || Date.now()).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar navigation */}
            <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200">
              <nav className="space-y-1 p-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-3 py-3 text-sm rounded-md ${
                    activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiUser className="mr-3 flex-shrink-0 h-5 w-5" />
                  <span>My Profile</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center px-3 py-3 text-sm rounded-md ${
                    activeTab === 'orders' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiShoppingBag className="mr-3 flex-shrink-0 h-5 w-5" />
                  <span>My Orders</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center px-3 py-3 text-sm rounded-md ${
                    activeTab === 'wishlist' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiHeart className="mr-3 flex-shrink-0 h-5 w-5" />
                  <span>Wishlist</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('history')}
                  className={`w-full flex items-center px-3 py-3 text-sm rounded-md ${
                    activeTab === 'history' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiClock className="mr-3 flex-shrink-0 h-5 w-5" />
                  <span>Browsing History</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('address')}
                  className={`w-full flex items-center px-3 py-3 text-sm rounded-md ${
                    activeTab === 'address' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiMapPin className="mr-3 flex-shrink-0 h-5 w-5" />
                  <span>My Addresses</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('returns')}
                  className={`w-full flex items-center px-3 py-3 text-sm rounded-md ${
                    activeTab === 'returns' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MdOutlineLocalShipping className="mr-3 flex-shrink-0 h-5 w-5" />
                  <span>Returns & Refunds</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full flex items-center px-3 py-3 text-sm rounded-md ${
                    activeTab === 'reviews' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MdOutlineRateReview className="mr-3 flex-shrink-0 h-5 w-5" />
                  <span>My Reviews</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-3 py-3 text-sm rounded-md ${
                    activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiSettings className="mr-3 flex-shrink-0 h-5 w-5" />
                  <span>Account Settings</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('support')}
                  className={`w-full flex items-center px-3 py-3 text-sm rounded-md ${
                    activeTab === 'support' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BiSupport className="mr-3 flex-shrink-0 h-5 w-5" />
                  <span>Help & Support</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-3 text-sm rounded-md text-red-600 hover:bg-red-50"
                >
                  <FiLogOut className="mr-3 flex-shrink-0 h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>

            {/* Main content area */}
            <div className="flex-1 p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">My Profile Information</h2>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                      {error}
                    </div>
                  )}
                  
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 bg-gray-50">
                      <h3 className="text-md font-medium leading-6 text-gray-900">Personal Information</h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Full name</dt>
                          <dd className="mt-1 text-sm text-gray-900">{userDetails?.name || 'Not provided'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email address</dt>
                          <dd className="mt-1 text-sm text-gray-900">{userDetails?.email || 'Not provided'}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                          <dd className="mt-1 text-sm text-gray-900">{userDetails?.address?.phone || 'Not provided'}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 bg-gray-50">
                      <h3 className="text-md font-medium leading-6 text-gray-900">Address Information</h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                      {userDetails?.address ? (
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Street address</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {userDetails.address.addressLine1}<br />
                              {userDetails.address.addressLine2}
                              {userDetails.address.landmark && <><br />{userDetails.address.landmark}</>}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">City</dt>
                            <dd className="mt-1 text-sm text-gray-900">{userDetails.address.city}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">State</dt>
                            <dd className="mt-1 text-sm text-gray-900">{userDetails.address.state}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">PIN Code</dt>
                            <dd className="mt-1 text-sm text-gray-900">{userDetails.address.pinCode}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Country</dt>
                            <dd className="mt-1 text-sm text-gray-900">{userDetails.address.country}</dd>
                          </div>
                        </dl>
                      ) : (
                        <p className="text-sm text-gray-500">No address information provided.</p>
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
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      + Add New Address
                    </button>
                  </div>
                  
                  {userDetails?.address ? (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between">
                        <div className="flex items-start">
                          <div className="mt-1">
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
                        </div>
                        <div className="flex space-x-2">
                          <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-700 hover:text-indigo-900">
                            Edit
                          </button>
                          <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800">
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
                          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Add New Address
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Other tabs would be implemented similarly */}
              {(activeTab === 'returns' || activeTab === 'reviews' || activeTab === 'settings' || activeTab === 'support') && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    {activeTab === 'returns' && 'Returns & Refunds'}
                    {activeTab === 'reviews' && 'My Reviews'}
                    {activeTab === 'settings' && 'Account Settings'}
                    {activeTab === 'support' && 'Help & Support'}
                  </h2>
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                    <div className="text-center py-12">
                      {activeTab === 'returns' && <MdOutlineLocalShipping className="mx-auto h-12 w-12 text-gray-300" />}
                      {activeTab === 'reviews' && <MdOutlineRateReview className="mx-auto h-12 w-12 text-gray-300" />}
                      {activeTab === 'settings' && <FiSettings className="mx-auto h-12 w-12 text-gray-300" />}
                      {activeTab === 'support' && <BiSupport className="mx-auto h-12 w-12 text-gray-300" />}
                      
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
  );
} 