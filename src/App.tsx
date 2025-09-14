import { MatchProvider } from "./context/MatchContext";
import AppRoutes from "./AppRoutes";
import { CurrentMatchProvider } from "./context/CurrentMatchContext";

function App() {
  return (
    <MatchProvider>
      <CurrentMatchProvider>
        <AppRoutes />
      </CurrentMatchProvider>
    </MatchProvider>
  );
}

export default App;
