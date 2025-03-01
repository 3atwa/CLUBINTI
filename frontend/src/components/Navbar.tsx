import React from 'react';
import { Home, Compass, User, Award, Settings, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3 px-6 sm:top-0 sm:bottom-auto shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-around items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 hidden sm:block">ClubInti</h1>
          </Link>
          
          <div className="flex gap-6 sm:gap-8">
            <Link
              to="/"
              className={`flex flex-col items-center ${
                isActive('/') 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Home size={24} />
              <span className="text-xs sm:text-sm">Home</span>
            </Link>
            
            <Link
              to="/explore"
              className={`flex flex-col items-center ${
                isActive('/explore') 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Compass size={24} />
              <span className="text-xs sm:text-sm">Explore</span>
            </Link>
            
            <Link
              to="/top-clubs"
              className={`flex flex-col items-center ${
                isActive('/top-clubs') 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Award size={24} />
              <span className="text-xs sm:text-sm">Rankings</span>
            </Link>
            
            <Link
              to="/profile"
              className={`flex flex-col items-center ${
                isActive('/profile') 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {isAuthenticated ? (
                <User size={24} />
              ) : (
                <LogIn size={24} />
              )}
              <span className="text-xs sm:text-sm">{isAuthenticated ? 'Profile' : 'Sign In'}</span>
            </Link>

            <Link
              to="/settings"
              className={`flex flex-col items-center ${
                isActive('/settings') 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Settings size={24} />
              <span className="text-xs sm:text-sm">Settings</span>
            </Link>
          </div>
          
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}