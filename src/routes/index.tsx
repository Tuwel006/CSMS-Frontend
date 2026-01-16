// AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuthContexxt } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import PublicLayout from "@/components/layout/PublicLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ScoreEdit from "@/pages/ScoreEdit";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PageLoader } from "@/components/ui/loading";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const TestCricketGround = lazy(() => import("@/pages/TestCricketGround"));
const Auth = lazy(() => import("@/pages/Auth"));
const Home = lazy(() => import("@/pages/Home"));
const PublicHome = lazy(() => import("@/pages/PublicHome"));
const Dashboard = lazy(() => import("@/pages/ScoreEdit"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const MatchDetail = lazy(() => import("@/pages/MatchDetails"));
const TeamManagement = lazy(() => import("@/pages/TeamManagement"));
const TeamManagementRefactored = lazy(() => import("@/pages/TeamManagement/TeamManagementRefactored"));
const ScoreEditor = lazy(() => import("@/pages/ScoreEditor"));
const ScoreEditorNew = lazy(() => import("@/pages/ScoreEditorNew"));
const Game = lazy(() => import("@/pages/Game"));
const LiveScore = lazy(() => import("@/pages/LiveScore"));
const SearchableFormExample = lazy(() => import("@/components/ui/SearchableFormExample"));


export default function AppRoute() {
  const {isAuth, role} = useAuthContexxt();
  return (
    <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Public routes */}
      <Route path="search-form" element={<SearchableFormExample />} />
      <Route element={<PublicRoute isAuth={isAuth} role={role} />}>
        <Route path="login" element={<Auth />} />
      </Route>
      <Route element={<PublicLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/matches" element={<PublicHome />} />
        <Route path="/test" element={<TestCricketGround />} />
        <Route path="/game" element={<Game />} />
        <Route path="/matches/match/:id/score" element={<LiveScore />} />
        <Route index element={<LandingPage />} />
      </Route>
      {/* Protected ROutes */}
      <Route element={<Layout />}>
        <Route element={<ProtectedRoute allowedRoles={['admin']}/>}>
           <Route path="admin">
              <Route index element={<AdminDashboard />} />
              <Route path="score-edit" element={<Dashboard />} />

              <Route path="team-management" element={<TeamManagement/>} />
              <Route path="team-management-new" element={<TeamManagementRefactored/>} />
              <Route path="player-management" element={<div>Player Management Page</div>} />
              <Route path="score-updates" element={<ScoreEditor />} />
              <Route path="score-editor" element={<ScoreEditorNew />} />
              <Route path="score-edit" element={<ScoreEdit />} />
              <Route path="statistics" element={<div>Statistics Page</div>} />
              <Route path="settings" element={<div>Settings Page</div>} />
              {/* Add more admin routes here */}
           </Route>
        </Route>
      </Route>
      
      {/* 404 Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
    </ErrorBoundary>
  );
}
