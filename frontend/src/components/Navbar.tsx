import { Home, Compass, User, Award, Settings, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import clubentiLogo from './logo.png';

export function Navbar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
<div className="absolute left-0 right-0 flex items-center justify-center md:hidden">
<Link to="/">
            <img 
              src={clubentiLogo} 
              alt="ClubInti Logo" 
              className=" w-28 "
            />
          </Link>
          </div>
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3 px-6 sm:top-0 sm:bottom-auto sm:border-t-0 sm:border-b shadow-sm"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="hidden sm:flex items-center gap-2">
            <img 
              src={clubentiLogo}
              alt="ClubInti Logo" 
              className=" w-28 absolute" 
            />
          </Link>
          
          <div className="flex w-full sm:w-auto justify-around sm:justify-start gap-6 sm:gap-8">
            {[
              { to: '/', icon: <Home size={20} />, label: 'Home' },
              { to: '/explore', icon: <Compass size={20} />, label: 'Explore' },
              { to: '/top-clubs', icon: <Award size={20} />, label: 'Rankings' },
              {
                to: isAuthenticated ? '/profile' : '/login',
                icon: isAuthenticated ? <User size={20} /> : <LogIn size={20} />,
                label: isAuthenticated ? 'Profile' : 'Sign In',
              },
              { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
            ].map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center transition-colors duration-200 ${
                  isActive(to) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-300'
                }`}
              >
                {icon}
                <span className="text-xs mt-1">{label}</span>
              </Link>
            ))}
          </div>
          
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}