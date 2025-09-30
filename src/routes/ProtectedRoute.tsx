import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContexxt } from '@/context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const { role, isAuth } = useAuthContexxt();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  const hasRequiredRole = allowedRoles.includes(role);

  if(isAuth && (allowedRoles.length === 0 && !hasRequiredRole)){
    return <Navigate to="/home" replace />;
  }  

  if (allowedRoles.length > 0 && !hasRequiredRole) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet/>;
};

export default ProtectedRoute;
