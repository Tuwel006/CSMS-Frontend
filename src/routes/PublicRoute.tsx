import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute: React.FC = (): React.JSX.Element => {
  const token = localStorage.getItem('access_token');
  if (token && token !== '') {
    return <Navigate to="/" replace />;
  }
  return <Outlet/>;
};

export default PublicRoute;