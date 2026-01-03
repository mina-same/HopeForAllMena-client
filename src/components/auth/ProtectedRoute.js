import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { navigate } from 'gatsby';

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requiredPermissions = [],
  requireAdmin = false,
  fallbackPath = '/login'
}) => {
  // Always allow access when auth is disabled
  return children;
};

export default ProtectedRoute;
