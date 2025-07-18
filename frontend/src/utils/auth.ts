import Cookies from 'js-cookie';

const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:5000';

// Utility function for making authenticated API requests
export const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = Cookies.get('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(`${API_HOST}${endpoint}`, {
    ...options,
    headers,
  });
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!Cookies.get('authToken');
};

// Utility function to get auth token
export const getAuthToken = (): string | undefined => {
  return Cookies.get('authToken');
};

// Utility function to remove auth token (for logout)
export const removeAuthToken = (): void => {
  Cookies.remove('authToken');
};

// Utility function to set auth token
export const setAuthToken = (token: string): void => {
  Cookies.set('authToken', token, { 
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};