import Header from "./Header";
import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const {theme} = useTheme();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 relative">
        <Sidebar />
        <main
          key={theme}
          className="flex-1 transition-all duration-300"
          style={{
            backgroundColor: "var(--bg)",
            color: "var(--text)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
