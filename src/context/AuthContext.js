import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

const isAdminUser = (user) => {
  if (!user) return false;
  const role = (user.role || '').toLowerCase();
  const permissions = user.permissions || [];
  return role.includes('admin') || permissions.includes('user-management') || permissions.includes('users');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const clearSession = useCallback(() => {
    authStorage.clearAuth();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  // Confirm the stored token with the server; never trust local data alone
  const checkAuthStatus = useCallback(async () => {
    const storedToken = authStorage.getToken();
    if (!storedToken) {
      clearSession();
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getProfile();
      const profile = response?.data?.user;
      if (response?.status === 'success' && profile) {
        setUser(profile);
        setToken(storedToken);
        setIsAuthenticated(true);
        authStorage.setUser(profile);
      } else {
        clearSession();
      }
    } catch (error) {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const loggedInUser = response?.data?.user;
      const newToken = response?.data?.token;

      if (response?.status !== 'success' || !loggedInUser || !newToken) {
        return { success: false, error: response?.message };
      }

      authStorage.setToken(newToken);
      authStorage.setUser(loggedInUser);
      setToken(newToken);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return { success: true, user: loggedInUser };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // The local session is cleared below even if the server call fails
    }
    clearSession();
  };

  const updateUser = (userData) => {
    setUser(userData);
    authStorage.setUser(userData);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return isAdminUser(user) || (user.permissions || []).includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    if (!user) return false;
    return isAdminUser(user) || permissions.some((permission) => (user.permissions || []).includes(permission));
  };

  const isAdmin = () => isAdminUser(user);

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
