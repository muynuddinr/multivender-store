'use client';

import { useEffect, useState, FormEvent, ChangeEvent, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfileContent() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/customer-login');
    }
  }, [loading, user, router]);

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setProfileImage(user.profileImage || null);
    }
  }, [user]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    // Validate passwords if attempting to change them
    if (profileData.newPassword) {
      if (profileData.newPassword !== profileData.confirmPassword) {
        setError("New passwords don't match");
        setIsSaving(false);
        return;
      }

      if (!profileData.currentPassword) {
        setError("Please enter your current password");
        setIsSaving(false);
        return;
      }
    }

    try {
      const updateData: any = {
        name: profileData.name,
        profileImage: profileImage
      };

      // Only include password fields if attempting to change password
      if (profileData.newPassword) {
        updateData.currentPassword = profileData.currentPassword;
        updateData.newPassword = profileData.newPassword;
      }

      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update user in auth context with the new data
      login({
        ...user!,
        name: profileData.name,
        profileImage: profileImage || undefined
      });

      setSuccess('Profile updated successfully');
      setIsEditing(false);
      
      // Clear password fields
      setProfileData({
        ...profileData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow overflow-hidden mt-8">
        <div className="md:flex">
          <div className="md:w-1/3 bg-indigo-50 p-6 flex flex-col items-center">
            <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-4">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt={user.name} 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <div className="h-full w-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-700 font-bold text-4xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Change Photo
              </button>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
            
            <h2 className="mt-4 text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </div>
          
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
              
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 text-white py-1.5 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form data to current user data
                    if (user) {
                      setProfileData({
                        name: user.name,
                        email: user.email,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                      setProfileImage(user.profileImage || null);
                    }
                    setError('');
                    setSuccess('');
                  }}
                  className="text-gray-600 py-1.5 px-4 rounded-md text-sm font-medium hover:text-gray-900 focus:outline-none"
                >
                  Cancel
                </button>
              )}
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`mt-1 block w-full px-3 py-2 border ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'} rounded-md shadow-sm text-gray-900 sm:text-sm focus:outline-none ${isEditing ? 'focus:ring-indigo-500 focus:border-indigo-500' : ''}`}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    disabled={true} // Email can't be changed
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm text-gray-900 sm:text-sm bg-gray-50"
                  />
                </div>
                
                {isEditing && (
                  <>
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Change Password (Optional)</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                            Current Password
                          </label>
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={profileData.currentPassword}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 sm:text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New Password
                          </label>
                          <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={profileData.newPassword}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 sm:text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                          </label>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={profileData.confirmPassword}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 sm:text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {isEditing && (
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 