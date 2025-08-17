import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useBackendAuth } from '@/hooks/useBackendAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/signin' 
}: ProtectedRouteProps) => {
  const { user, loading } = useBackendAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cre8-dark to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // If route is for non-authenticated users and user is authenticated
  if (!requireAuth && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
