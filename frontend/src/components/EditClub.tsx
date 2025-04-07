import React, { useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';

interface Club {
  _id: string;
  name: string;
  description: string;
  category: string;
  coverImage: string;
  logo: string;
}

interface EditClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: Club;
  onSave: (updatedClub: Club) => void; // Expect the full updated club
}

export function EditClubModal({ isOpen, onClose, club, onSave }: EditClubModalProps) {
  const [formData, setFormData] = useState({
    name: club.name,
    description: club.description || '',
    category: club.category || 'Academic',
    coverImage: club.coverImage || '',
    logo: club.logo || '',
  });

  // Update formData when the club prop changes (in case of external updates)
  useEffect(() => {
    setFormData({
      name: club.name,
      description: club.description || '',
      category: club.category || 'Academic',
      coverImage: club.coverImage || '',
      logo: club.logo || '',
    });
  }, [club]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Create a payload with only the fields that have been changed or are not empty
    const payload: Partial<Club> = {};
    if (formData.name !== club.name) {
      payload.name = formData.name;
    }
    if (formData.description !== club.description) {
      payload.description = formData.description;
    }
    if (formData.category !== club.category) {
      payload.category = formData.category;
    }
    if (formData.coverImage !== club.coverImage) {
      payload.coverImage = formData.coverImage;
    }
    if (formData.logo !== club.logo) {
      payload.logo = formData.logo;
    }

    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Unauthorized: Please log in again.');
      return;
    }

    // Only make the API call if there are changes to send
    if (Object.keys(payload).length > 0) {
      try {
        // Make API request to update the club
        const response = await fetch(`http://localhost:3002/clubs/${club._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Add token to the headers
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to update club:', errorData);
          throw new Error(`Failed to update club: ${response.statusText}`);
        }

        const updatedClubFromServer = await response.json();
        onSave(updatedClubFromServer); // Update UI with the new club data
        onClose();
      } catch (error: any) {
        console.error('Update failed:', error);
        alert('Failed to update club. Please try again.');
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
  
  const handleCoverUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Clubinti'); // same preset as logo
  
    const res = await fetch('https://api.cloudinary.com/v1_1/dfsgxwuam/image/upload', {
      method: 'POST',
      body: formData,
    });
  
    const data = await res.json();
    setFormData(prev => ({ ...prev, coverImage: data.secure_url })); // store the image URL
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Club</h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Club Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Club Logo
              </label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={formData.logo}
                    alt="Logo"
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

            {/* Club Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Club Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Club Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Club Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="Academic">Academic</option>
                <option value="Arts">Arts</option>
                <option value="Sports">Sports</option>
                <option value="Technology">Technology</option>
                <option value="Social">Social</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Club Cover Image */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cover Image URL
              </label>
              <div className="flex items-center space-x-6">
    <div className="relative">
      {formData.coverImage && (
        <img
          src={formData.coverImage}
          alt="Cover"
          className="w-48 h-24 object-cover rounded"
        />
      )}
    </div>
    <div className="flex-1">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleCoverUpload(file);
        }}
      />
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Upload a wide banner-style image
      </p>
    </div>
  </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Upload a wide banner-style image
              </p>
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
