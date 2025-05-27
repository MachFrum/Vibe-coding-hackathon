import React, { createContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: false,
  error: null,
  currentPage: 'dashboard',
  setCurrentPage: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Mock authentication - in a real app, this would connect to a backend
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        // Mock successful login
        setUser({
          id: '1',
          email,
          name: 'Sample User',
        });
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password && name) {
        // Mock successful registration
        setUser({
          id: '1',
          email,
          name,
        });
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
      } else {
        throw new Error('Please fill all required fields');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    loading,
    error,
    currentPage,
    setCurrentPage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};