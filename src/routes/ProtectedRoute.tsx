import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthToken from '../hooks/useAuthToken';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children
}) => {
  const { role, isAuth } = useAuthToken();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole = allowedRoles.includes(role);

  if (allowedRoles.length > 0 && !hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
