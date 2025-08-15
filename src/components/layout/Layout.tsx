import Header from "./Header";
import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const {theme} = useTheme();
  return (
    <>
      <Header />
      <Sidebar />
      <main
        key={theme} // ✅ force re-render when theme changes
        className="ml-16 mt-16 p-6 transition-all duration-300"
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--text)",
          minHeight: "calc(100vh - 4rem)",
        }}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;
