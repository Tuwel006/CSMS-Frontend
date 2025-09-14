import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import Login from '../pages/Login';
import AuthCallback from '../pages/AuthCallback';
import Dashboard from '../pages/Dashboard';
import MatchSetup from '../pages/MatchSetup';
import TeamManagement from '../pages/TeamManagement';
import ScoreEditor from '../pages/ScoreEditor';
import Home from '../pages/Home';
import PublicLayout from '../components/layout/PublicLayout';
import Layout from '../components/layout/Layout';
import LandingPage from '@/pages/LandingPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <PublicLayout>
              <LandingPage />
            </PublicLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/match-setup"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <MatchSetup />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/team-management"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <TeamManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/scoreeditor"
        element={
          <ProtectedRoute allowedRoles={['admin', 'subscriber']}>
            <Layout>
              <ScoreEditor />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
