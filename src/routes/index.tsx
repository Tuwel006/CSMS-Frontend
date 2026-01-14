// AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuthContexxt } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import PublicLayout from "@/components/layout/PublicLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ScoreEdit from "@/pages/ScoreEdit";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const TestCricketGround = lazy(() => import("@/pages/TestCricketGround"));
const Auth = lazy(() => import("@/pages/Auth"));
const Home = lazy(() => import("@/pages/Home"));
const Dashboard = lazy(() => import("@/pages/ScoreEdit"));
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
    <Routes>
      {/* Public routes */}
      <Route path="search-form" element={<SearchableFormExample />} />
      <Route element={<PublicRoute isAuth={isAuth} role={role} />}>
        <Route path="login" element={<Auth />} />
      </Route>
      <Route element={<PublicLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/test" element={<TestCricketGround />} />
        <Route path="/game" element={<Game />} />
        <Route path="/matches/match/:id/score" element={<LiveScore />} />
        <Route index element={<LandingPage />} />
      </Route>
      {/* Protected ROutes */}
      <Route element={<Layout />}>
        <Route element={<ProtectedRoute allowedRoles={['admin']}/>}>
           <Route path="admin">
              <Route index element={<MatchDetail />} />
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
  );
}
