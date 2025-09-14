import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthToken from '../hooks/useAuthToken';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuth } = useAuthToken();

  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
