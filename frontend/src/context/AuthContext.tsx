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


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Check if user is already logged in (from localStorage in a real app)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
  
      if (token ) {
        setIsAuthenticated(true);
      }
    };
  
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3002/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error('Invalid email or password');
      }
  
      const data = await response.json();
      const { message,access_token, user } = data; // Assuming the backend returns a token and user data
  
      // Save the token and user data in localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
  
      // Update the auth state
      setIsAuthenticated(true);
      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3002/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (!response.ok) {
        // Log the error status and message from the backend
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        throw new Error(errorData?.message || 'Registration failed');
      }
  
      const data = await response.json();
      console.log('Registration response:', data); // Log the response for debugging

    } catch (error) {
      console.error('Registration error:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  };
  

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
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