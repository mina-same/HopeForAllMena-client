import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requiredPermissions = [],
  requireAdmin = false,
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, loading, hasAnyPermission, isAdmin } = useAuth();

  const allowed =
    !requireAuth ||
    (isAuthenticated &&
      (requiredPermissions.length === 0 || hasAnyPermission(requiredPermissions)) &&
      (!requireAdmin || isAdmin()));

  useEffect(() => {
    if (loading || allowed) return;
    navigate(isAuthenticated ? '/unauthorized' : fallbackPath, { replace: true });
  }, [loading, allowed, isAuthenticated, fallbackPath]);

  // Render nothing protected until the server has confirmed the login
  if (loading || !allowed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary" role="status" aria-label="Loading" />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
