import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
                <div className="flex items-center justify-between py-3 border-gray-100 dark:border-gray-700">

                  <button 
                    onClick={toggleTheme}
                    className="flex items-center px-4 text-gray-800 dark:text-gray-200"
                  >
                   {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" /> : <Sun className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />}

                  </button>
                </div>
  );
}