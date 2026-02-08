import { MatchProvider } from "./context/MatchContext";
import { CurrentMatchProvider } from "./context/CurrentMatchContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import AppRoutes from "./AppRoutes";
import TestCricketGround from './pages/TestCricketGround';
import { Route, Routes } from "react-router-dom";
import Game from "./pages/Game";
import GlobalLoader from "./components/GlobalLoader";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastStyles.css';

function AppContent() {
  const { theme } = useTheme();

  return (
    <>
      <MatchProvider>
        <CurrentMatchProvider>
          <GlobalLoader />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={true}
            closeButton={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
            theme={theme === 'dark' ? 'dark' : 'light'}
            limit={3}
            style={{
              position: 'fixed',
              bottom: '16px',
              right: '16px',
              top: 'auto',
              left: 'auto',
              width: '280px',
              zIndex: 9999
            }}
          />
          <Routes>
            <Route path="/test" element={<TestCricketGround />} />
            <Route path="/game" element={<Game />} />
          </Routes>
          <AppRoutes />
        </CurrentMatchProvider>
      </MatchProvider>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
