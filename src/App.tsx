import { MatchProvider } from "./context/MatchContext";
import { CurrentMatchProvider } from "./context/CurrentMatchContext";
import AppRoutes from "./AppRoutes";
// dev-only test page
import TestCricketGround from './pages/TestCricketGround';
import { Route, Routes } from "react-router-dom";
import Game from "./pages/Game";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <MatchProvider>
      <CurrentMatchProvider>
        <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" style={{ top: "80px" }} />
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
