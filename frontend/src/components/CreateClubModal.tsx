import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';

interface CreateClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clubData: {
    name: string;
    description: string;
    category: string;
    coverImage: string;
    logo: string;
  }) => void;
}

export function CreateClubModal({ isOpen, onClose, onSubmit }: CreateClubModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Academic',
    coverImage: '',
    logo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create New Club</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              logo
              </label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={formData.logo}
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
                    Enter the URL of your profile picture
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Club Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

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
            <div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Cover Image
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
</div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
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
              Create Club
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}