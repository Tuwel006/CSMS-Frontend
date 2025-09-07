import { useAuth } from '../context/AuthContext';
import PublicLayout from './layout/PublicLayout';
import Home from '../pages/Home';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <PublicLayout>
        <Home />
      </PublicLayout>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;