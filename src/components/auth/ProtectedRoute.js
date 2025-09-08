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
  const { isAuthenticated, user, loading, hasAnyPermission, isAdmin } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2194D1]"></div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    if (typeof window !== 'undefined') {
      navigate(fallbackPath);
    }
    return null;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin()) {
    if (typeof window !== 'undefined') {
      navigate('/unauthorized');
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Check specific permissions
  if (requiredPermissions.length > 0 && !hasAnyPermission(requiredPermissions)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Insufficient Permissions</h2>
          <p className="text-gray-600">You don't have the required permissions to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Required: {requiredPermissions.join(', ')}</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
