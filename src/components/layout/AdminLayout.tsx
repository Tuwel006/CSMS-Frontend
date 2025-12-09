import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";
import { SearchProvider } from "../../context/SearchContext";
import { Outlet } from "react-router-dom";
import Header from './Header'
import { LayoutDashboard, Home, Edit, Settings, Users, UserPlus, BarChart3, TrendingUp } from "lucide-react";


const AdminLayout = () => {
  const links = [
    { to: "", icon: <Home size={20} />, label: "Home" },
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/match-setup", icon: <Edit size={20} />, label: "Match Setup" },
    { to: "/team-management", icon: <Users size={20} />, label: "Team Management" },
    { to: "/player-management", icon: <UserPlus size={20} />, label: "Player Management" },
    { to: "/score-updates", icon: <TrendingUp size={20} />, label: "Score Updates" },
    { to: "/statistics", icon: <BarChart3 size={20} />, label: "Statistics" },
    { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];
  const { theme } = useTheme();
  return (
    <SearchProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar links={links} />
          <main
            key={theme}
            className="flex-1 ml-16 lg:ml-0 transition-all duration-300 overflow-x-hidden"
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
