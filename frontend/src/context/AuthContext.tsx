import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: UserProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
  bio: 'Software developer and photography enthusiast. Love to participate in tech and creative clubs.',
  location: 'San Francisco, CA',
  occupation: 'Software Engineer',
  joinDate: '2023-01-15',
  joinedClubs: [],
  ownedClubs: [],
  points: {}
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Check if user is already logged in (from localStorage in a real app)
  useEffect(() => {
    const checkAuth = () => {
      const savedAuth = localStorage.getItem('isAuthenticated');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
        setUser(mockUser);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to authenticate
    // For demo purposes, we'll just set the user as authenticated
    setIsAuthenticated(true);
    setUser(mockUser);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const register = async (name: string, email: string, password: string) => {
    // In a real app, this would make an API call to register a new user
    // For demo purposes, we'll just set the user as authenticated
    const newUser = {
      ...mockUser,
      name,
      email
    };
    
    setIsAuthenticated(true);
    setUser(newUser);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}