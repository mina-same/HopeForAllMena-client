
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
