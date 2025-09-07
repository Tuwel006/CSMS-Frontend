import ProtectedHeader from "./ProtectedHeader";
import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";
import { SearchProvider } from "../../context/SearchContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const {theme} = useTheme();
  return (
    <SearchProvider>
      <div className="min-h-screen flex flex-col">
        <ProtectedHeader />
        <div className="flex flex-1">
          <Sidebar />
          <main
            key={theme}
            className="flex-1 ml-16 lg:ml-0 transition-all duration-300"
            style={{
              backgroundColor: "var(--bg)",
              color: "var(--text)",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </SearchProvider>
  );
};

export default Layout;
