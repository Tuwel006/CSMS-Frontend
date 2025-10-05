import { MatchProvider } from "./context/MatchContext";
import { CurrentMatchProvider } from "./context/CurrentMatchContext";
import AppRoutes from "./AppRoutes";
// dev-only test page
import TestCricketGround from './pages/TestCricketGround';
import { Route, Routes } from "react-router-dom";
import Game from "./pages/Game";

function App() {
  return (
    <MatchProvider>
      <CurrentMatchProvider>
          <Routes>
            <Route path="/test" element={<TestCricketGround />} />
            <Route path="/game" element={<Game />} />
          </Routes>
          <AppRoutes />
      </CurrentMatchProvider>
    </MatchProvider>
  );
}

export default App;
