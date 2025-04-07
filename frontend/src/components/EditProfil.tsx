import React, { useState, useEffect } from 'react';
import { X, Upload, Camera } from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void; // Expect the full updated profile
}

export function EditProfileModal({ isOpen, onClose, profile, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    bio: profile.bio || '',
    location: profile.location || '',
    occupation: profile.occupation || '',
    avatar: profile.avatar,
  });

  // Update formData when the profile prop changes (in case of external updates)
  useEffect(() => {
    setFormData({
      name: profile.name,
      bio: profile.bio || '',
      location: profile.location || '',
      occupation: profile.occupation || '',
      avatar: profile.avatar,
    });
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a payload with only the fields that have been changed or are not empty
    const payload: Partial<UserProfile> = {};
    if (formData.name !== profile.name) {
      payload.name = formData.name;
    }
    if (formData.bio !== profile.bio) {
      payload.bio = formData.bio;
    }
    if (formData.location !== profile.location) {
      payload.location = formData.location;
    }
    if (formData.occupation !== profile.occupation) {
      payload.occupation = formData.occupation;
    }
    if (formData.avatar !== profile.avatar) {
      payload.avatar = formData.avatar;
    }

    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Unauthorized: Please log in again.');
      return;
    }
    console.log('Profile ID:', profile._id);
    console.log('Form Data:', formData);
    console.log('Payload to send:', payload);

    // Only make the API call if there are changes to send
    if (Object.keys(payload).length > 0) {
      try {
        // Make API request to update the profile
        const response = await fetch(`http://localhost:3002/user/update/${profile._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Add token to the headers
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to update profile:', errorData);
          throw new Error(`Failed to update profile: ${response.statusText}`);
        }

        const updatedProfileFromServer = await response.json();
        onSave(updatedProfileFromServer); // Update UI with the new profile data
        localStorage.setItem('user', JSON.stringify(updatedProfileFromServer)); // Update the profile in localStorage

        onClose();
      } catch (error: any) {
        console.error('Update failed:', error);
        alert('Failed to update profile. Please try again.');
      }
    } else {
      console.log('No changes to save.');
      onClose(); // Optionally close the modal if no changes were made
    }
  };


  const handleLogoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Clubinti'); // from Cloudinary settings
  
    const res = await fetch('https://api.cloudinary.com/v1_1/dfsgxwuam/image/upload', {
      method: 'POST',
      body: formData,
    });
  
    const data = await res.json();
    setFormData(prev => ({ ...prev, logo: data.secure_url })); // store the image URL
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={formData.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload(file);
                }}
                className="hidden"
                id="logo-upload"
              />
              <button
                type="button"
                onClick={() => document.getElementById('logo-upload')?.click()} // 👈 trigger click on input
                className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-700"
              >
                    <Camera size={16} />
                  </button>
                </div>
                <div className="flex-1">
                <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoUpload(file);
                        }}
                      />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Upload your logo
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Occupation
                </label>
                <input
                  type="text"
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}