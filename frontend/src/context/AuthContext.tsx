import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface DecodedToken {
  sub: string;
  exp: number;
  iat: number;
  // Add more fields if your token includes more
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');
        
        // If there's no token, we're definitely not authenticated
        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Check token expiration
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token is expired, log out
          console.log('Token expired, logging out');
          logout();
          return;
        }
        
        // Token is valid, check if we have a stored user
        if (storedUser) {
          // Use stored user data right away to avoid auth flickering
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }

        // Try to fetch fresh user data
        try {
          const userId = decoded.sub;
          const response = await fetch(`http://localhost:3002/user/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const fetchedUser = await response.json();
            setUser(fetchedUser);
            localStorage.setItem('user', JSON.stringify(fetchedUser)); // Update stored user
            setIsAuthenticated(true);
          } else if (response.status === 401) {
            // Unauthorized - token rejected by server
            logout();
          } else {
            // Other server errors - keep the user logged in with stored data
            console.warn('Could not refresh user data, using cached data');
            // We already set user from localStorage above
          }
        } catch (error) {
          // Network error or other issue - keep using stored user data
          console.warn('Network error while refreshing user data:', error);
          // Only log out if we couldn't set the user from localStorage
          if (!storedUser) {
            logout();
          }
        }
      } catch (error) {
        // JWT decode error or other critical error
        console.error('Auth check failed:', error);
        logout();
      } finally {
        setIsLoading(false);
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
      const { message, access_token, user } = data;
  
      // Save the token and user data in localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('message', message);
      
      // Update the auth state
      setUser(user);
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