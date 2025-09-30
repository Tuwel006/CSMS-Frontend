import AppRoute from "./routes";
import { AuthProvider } from "./context/AuthContext";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <AppRoute />
    </AuthProvider>
  );
};

export default AppRoutes;
