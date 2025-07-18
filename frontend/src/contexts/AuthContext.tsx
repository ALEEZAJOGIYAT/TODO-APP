import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/todo';
import { getCurrentUser, saveCurrentUser } from '@/utils/storage';
import Cookies from 'js-cookie';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get API host from environment variables
  const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:5000';

  useEffect(() => {
    // Check for token in cookies first
    const token = Cookies.get('authToken');
    if (token) {
      // If token exists, get user from localStorage or validate with API
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_HOST}/api/users/login`, {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login failed:', data.message || 'Unknown error');
        setIsLoading(false);
        return false;
      }

      // Save token in cookies
      if (data.token) {
        Cookies.set('authToken', data.token, { 
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }

      // Assuming the API returns user data
      const loggedInUser: User = {
        id: data.user?.id || data.id,
        email: data.user?.email || data.email,
        name: data.user?.name || data.name,
        token: data.user?.token || data.token || new Date().toISOString(),
      };

      setUser(loggedInUser);
      saveCurrentUser(loggedInUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_HOST}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Registration failed:', data.message || 'Unknown error');
        setIsLoading(false);
        return false;
      }

      // Save token in cookies
      if (data.token) {
        Cookies.set('authToken', data.token, { 
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }

      // Assuming the API returns user data
      const newUser: User = {
        id: data.user?.id || data.id,
        email: data.user?.email || data.email,
        name: data.user?.name || data.name,
        token: data.user?.token || data.token || new Date().toISOString(),
      };

      setUser(newUser);
      saveCurrentUser(newUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    saveCurrentUser(null);
    // Remove token from cookies
    Cookies.remove('authToken');
  };

  // Function to get the auth token
  const getAuthToken = (): string | undefined => {
    return Cookies.get('authToken');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    getAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};