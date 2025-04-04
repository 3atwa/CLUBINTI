import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean; // Add loading state
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Initialize loading state

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true); // Start loading
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Set the user from localStorage
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          
          // Optionally validate token with backend
          try {
            await validateToken(token);
          } catch (error) {
            // If token validation fails, log out the user
            console.error('Token validation failed:', error);
            logout();
          }
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        logout();
      } finally {
        setIsLoading(false); // End loading regardless of outcome
      }
    };
    
    checkAuth();
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3002/auth/validateToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        throw new Error('Invalid token');
      }
      const data = await response.json();
      setUser(data.user);
      return data;
    }
    catch (error) {
      console.error('Token validation error:', error);
      throw error;
    }
  }

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
      const { message, access_token, user } = data;
  
      // Save the token and user data in localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('message', message);
      
  
      // Update the auth state
      setUser(user);  // Make sure to set the user state
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
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
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        throw new Error(errorData?.message || 'Registration failed');
      }
  
      const data = await response.json();
      console.log('Registration response:', data);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, register, logout }}>
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