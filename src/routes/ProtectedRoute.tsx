import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
interface ProtectedRouteProps {
  allowedRoles: string[];
}

interface UserPayload {
  sub: string,
  email: string,
  role: string
}



const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = localStorage.getItem('access_token');
  if (!token || token === '') {
    return <Navigate to="/login" replace />;
  }
  const role = jwtDecode<UserPayload>(token).role;
  if(allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet/>;
};

export default ProtectedRoute;
