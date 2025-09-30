import { MatchProvider } from "./context/MatchContext";
import { CurrentMatchProvider } from "./context/CurrentMatchContext";
import AppRoutes from "./AppRoutes";

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
