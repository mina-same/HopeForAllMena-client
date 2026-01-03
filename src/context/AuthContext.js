import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { authStorage } from '../utils/storage';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Guest user for when auth is disabled
const GUEST_USER = {
  _id: '000000000000000000000000',
  username: 'guest',
  name: 'Guest User',
  email: 'guest@hopeforallmena.org',
  role: 'admin',
  status: 'active',
  permissions: [
    'books', 'authors', 'categories', 'reviews', 'courses',
    'enrollments', 'magazines', 'training', 'analytics', 'settings',
    'users', 'user-management', 'contact-messages', 'training-books',
    'training-requests', 'training-followup-requests', 'calendar',
    'generate-ids', 'blogs', 'admin_access', 'admin'
  ]
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(GUEST_USER);
  const [token, setToken] = useState('guest-token');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    // Keep it always authenticated for guest
    setIsAuthenticated(true);
    if (!user) {
      setUser(GUEST_USER);
      setToken('guest-token');
    }
    setLoading(false);
  }, [user]);

  const checkAuthStatus = async () => {
    setIsAuthenticated(true);
    setLoading(false);
  };

  const login = async (credentials) => {
    setUser(GUEST_USER);
    setToken('guest-token');
    setIsAuthenticated(true);
    return { success: true, user: GUEST_USER };
  };

  const logout = async () => {
    // Optionally allow "logout" but it will just reset to guest or we can just do nothing
    // For "disable login", let's make it do nothing or just keep guest
    return;
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const hasPermission = (permission) => {
    return true; // Always true when auth is disabled
  };

  const hasAnyPermission = (permissions) => {
    return true; // Always true when auth is disabled
  };

  const isAdmin = () => {
    return true; // Always true when auth is disabled
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasPermission,
    hasAnyPermission,
    isAdmin,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
