import React, { useState } from 'react';
import { BackButton } from '../components/BackButton';
import { Bell, Moon, Sun, Globe, Lock, UserPlus, Eye, EyeOff, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    newPosts: true,
    clubInvites: true,
    comments: true,
    mentions: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showJoinedClubs: true,
    showActivity: true
  });
  const [language, setLanguage] = useState('english');

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  const handlePrivacyChange = (key: keyof typeof privacy, value: any) => {
    setPrivacy({
      ...privacy,
      [key]: value
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                <span className="text-gray-800 dark:text-gray-200">Language</span>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 border-none"
              >
                <option value="english">English</option>
                <option value="french">French</option>
                <option value="spanish">Spanish</option>
                <option value="german">German</option>
              </select>
            </div>
          </section>

          {isAuthenticated && (
            <>
              {/* Notifications Section */}
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Notifications</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                      <span className="text-gray-800 dark:text-gray-200">New posts from clubs</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications.newPosts}
                        onChange={() => handleNotificationToggle('newPosts')}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                      <span className="text-gray-800 dark:text-gray-200">Club invites</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications.clubInvites}
                        onChange={() => handleNotificationToggle('clubInvites')}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                      <span className="text-gray-800 dark:text-gray-200">Comments on your posts</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications.comments}
                        onChange={() => handleNotificationToggle('comments')}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                      <span className="text-gray-800 dark:text-gray-200">Mentions</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications.mentions}
                        onChange={() => handleNotificationToggle('mentions')}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Privacy Section */}
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Privacy</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                      <span className="text-gray-800 dark:text-gray-200">Profile visibility</span>
                    </div>
                    <select 
                      value={privacy.profileVisibility}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 border-none"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {privacy.showJoinedClubs ? <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" /> : <EyeOff className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />}
                      <span className="text-gray-800 dark:text-gray-200">Show joined clubs</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={privacy.showJoinedClubs}
                        onChange={() => handlePrivacyChange('showJoinedClubs', !privacy.showJoinedClubs)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {privacy.showActivity ? <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" /> : <EyeOff className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />}
                      <span className="text-gray-800 dark:text-gray-200">Show activity status</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={privacy.showActivity}
                        onChange={() => handlePrivacyChange('showActivity', !privacy.showActivity)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Account Section */}
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
                  
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Edit Profile
                  </button>
                  
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Delete Account
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}