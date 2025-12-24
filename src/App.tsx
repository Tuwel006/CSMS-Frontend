import { MatchProvider } from "./context/MatchContext";
import { CurrentMatchProvider } from "./context/CurrentMatchContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./AppRoutes";
import TestCricketGround from './pages/TestCricketGround';
import { Route, Routes } from "react-router-dom";
import Game from "./pages/Game";
import GlobalLoader from "./components/GlobalLoader";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider>
      <MatchProvider>
        <CurrentMatchProvider>
          <GlobalLoader />
          <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" style={{ top: "80px" }} />
          <Routes>
            <Route path="/test" element={<TestCricketGround />} />
            <Route path="/game" element={<Game />} />
          </Routes>
          <AppRoutes />
        </CurrentMatchProvider>
      </MatchProvider>
    </ThemeProvider>
  );
}

export default App;
