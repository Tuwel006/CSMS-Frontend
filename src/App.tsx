import { MatchProvider } from "./context/MatchContext";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <MatchProvider>
      <AppRoutes />
    </MatchProvider>
  );
}

export default App;
