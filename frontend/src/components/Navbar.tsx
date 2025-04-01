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
    <nav
      key={location.pathname} // Forces re-render when path changes
      className="fixed bottom-0 left-0 right-0 z-[999] bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3 px-6 sm:top-0 sm:bottom-auto shadow-sm"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-around items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-2">
          <img src={clubentiLogo} alt="ClubInti Logo" className="h-20 w-28 absolute" />
          </Link>
          
          <div className="flex gap-6 sm:gap-8">
            {[
              { to: '/', icon: <Home size={24} />, label: 'Home' },
              { to: '/explore', icon: <Compass size={24} />, label: 'Explore' },
              { to: '/top-clubs', icon: <Award size={24} />, label: 'Rankings' },
              {
                to: '/profile',
                icon: isAuthenticated ? <User size={24} /> : <LogIn size={24} />,
                label: isAuthenticated ? 'Profile' : 'Sign In',
              },
              { to: '/settings', icon: <Settings size={24} />, label: 'Settings' },
            ].map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center transition-colors duration-200 ${
                  isActive(to) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {icon}
                <span className="text-xs sm:text-sm">{label}</span>
              </Link>
            ))}
          </div>
          
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
