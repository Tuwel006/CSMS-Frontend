import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthToken from '../hooks/useAuthToken';
import PublicLayout from '../components/layout/PublicLayout';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import AuthCallback from '../pages/AuthCallback';
import Dashboard from '../pages/Dashboard';
import MatchSetup from '../pages/MatchSetup';
import TeamManagement from '../pages/TeamManagement';
import ScoreEditor from '../pages/ScoreEditor';

const AppRoutes = () => {
  const { isAuth, roles } = useAuthToken();

  const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
    if (!isAuth) {
      return (
        <PublicLayout>
          <Home />
        </PublicLayout>
      );
    }

    if (requiredRole && !roles.includes(requiredRole)) {
      return <Navigate to="/dashboard" replace />;
    }

    return <Layout>{children}</Layout>;
  };

  return (
    <Routes>
      <Route path="/login" element={isAuth ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/match-setup" element={
        <ProtectedRoute requiredRole="admin">
          <MatchSetup />
        </ProtectedRoute>
      } />
      
      <Route path="/team-management" element={
        <ProtectedRoute requiredRole="admin">
          <TeamManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/scoreeditor" element={
        <ProtectedRoute>
          <ScoreEditor />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;