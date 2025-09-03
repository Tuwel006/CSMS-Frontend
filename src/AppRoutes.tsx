import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MatchSetup from "./pages/MatchSetup";
import Layout from "./components/layout/Layout";
import ScoreEditor from "./pages/ScoreEditor";

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/match-setup" element={<MatchSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scoreeditor" element= {<ScoreEditor />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
