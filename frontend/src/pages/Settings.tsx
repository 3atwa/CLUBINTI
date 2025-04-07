import React from 'react';
import { BackButton } from '../components/BackButton';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/profile'); // Navigate to profile page
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pb-20">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="mb-6 flex items-center justify-between">
            <BackButton />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>

          {/* Appearance Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Appearance</h2>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" /> : <Sun className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />}
                <span className="text-gray-800 dark:text-gray-200">Theme Mode</span>
              </div>
              <button 
                onClick={toggleTheme}
                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200"
              >
                {theme === 'light' ? 'Light' : 'Dark'}
              </button>
            </div>
          </section>

          {isAuthenticated && (
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Account</h2>
              
              <div className="space-y-4">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  <span>Log Out</span>
                </button>
                
                <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Change Password
                </button>
                
                <button 
                  onClick={handleEditProfile}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Edit Profile
                </button>
                
                <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Delete Account
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}