import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = ({ isAuth, role }: { isAuth: boolean; role: string }) => {
  // If authenticated, redirect to appropriate dashboard immediately
  
  if (isAuth) {
    if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  // If not authenticated, allow access to public routes (like /login)
  return <Outlet />;
};

export default PublicRoute;
