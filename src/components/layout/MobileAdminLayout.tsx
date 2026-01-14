import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { SearchProvider } from "../../context/SearchContext";
import { Outlet } from "react-router-dom";
import MobileHeader from './MobileHeader';
import MobileSidebar from './MobileSidebar';
import { Home, Users, UserPlus, TrendingUp, BarChart3, Settings, LayoutDashboard } from "lucide-react";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  const links = [
    { to: "", icon: <Home size={20} />, label: "Home" },
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/team-management", icon: <Users size={20} />, label: "Teams" },
    { to: "/player-management", icon: <UserPlus size={20} />, label: "Players" },
    { to: "/score-updates", icon: <TrendingUp size={20} />, label: "Score" },
    { to: "/statistics", icon: <BarChart3 size={20} />, label: "Stats" },
    { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <SearchProvider>
      <div className="min-h-screen flex flex-col">
        <MobileHeader 
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <div className="flex flex-1">
          <MobileSidebar 
            links={links} 
            isMobileOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
          <main
            key={theme}
            className="flex-1 lg:ml-0 transition-all duration-300 overflow-x-hidden pb-16 lg:pb-0"
            style={{
              backgroundColor: "var(--bg)",
              color: "var(--text)",
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </SearchProvider>
  );
};

export default AdminLayout;
