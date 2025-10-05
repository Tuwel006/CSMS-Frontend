// AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import LandingPage from "@/pages/LandingPage";
import TestCricketGround from "@/pages/TestCricketGround";
import Login from "@/pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import PublicRoute from "./PublicRoute";
import NotFound from "@/pages/NotFound";
import PublicLayout from "@/components/layout/PublicLayout";
import { useAuthContexxt } from "@/context/AuthContext";
import MatchDetail from "@/pages/MatchDetails";
import MatchSetup from "@/pages/MatchSetup";
import TeamManagement from "@/pages/TeamManagement";
import ScoreEditor from "@/pages/ScoreEditor";
import Game from "@/pages/Game";


export default function AppRoute() {
  const {isAuth, role} = useAuthContexxt();
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute isAuth={isAuth} role={role} />}>
        <Route path="login" element={<Login />} />
      </Route>
      <Route element={<PublicLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/test" element={<TestCricketGround />} />
        <Route path="/game" element={<Game />} />
        <Route index element={<LandingPage />} />
      </Route>
      {/* Protected ROutes */}
      <Route element={<Layout />}>
        <Route element={<ProtectedRoute allowedRoles={['admin']}/>}>
           <Route path="admin">
              <Route index element={<MatchDetail />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="match-setup" element={<MatchSetup/>} />
              <Route path="team-management" element={<TeamManagement/>} />
              <Route path="player-management" element={<div>Player Management Page</div>} />
              <Route path="score-updates" element={<ScoreEditor />} />
              <Route path="statistics" element={<div>Statistics Page</div>} />
              <Route path="settings" element={<div>Settings Page</div>} />
              {/* Add more admin routes here */}
           </Route>
        </Route>
      </Route>
      
      {/* 404 Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
