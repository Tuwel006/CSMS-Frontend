import { useState } from "react";
import { SearchProvider } from "../../context/SearchContext";
import { Outlet } from "react-router-dom";
import MobileHeader from './MobileHeader';
import MobileSidebar from './MobileSidebar';
import { Home, Users, UserPlus, TrendingUp, BarChart3, Settings, LayoutDashboard } from "lucide-react";
import ErrorBoundary from "../ErrorBoundary";
import PageHeader from "./PageHeader";
import { BreadcrumbProvider } from "../../context/BreadcrumbContext";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <BreadcrumbProvider>
      <SearchProvider>
        <div className="h-screen flex flex-col overflow-hidden bg-[var(--bg)]">
          <MobileHeader
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMobileMenuOpen={isMobileMenuOpen}
          />
          <div className="flex flex-1 overflow-hidden relative">
            <MobileSidebar
              links={links}
              isMobileOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <main
                className="flex-1 transition-all duration-300 overflow-x-hidden overflow-y-auto pb-20 lg:pb-0"
                style={{
                  backgroundColor: "var(--bg)",
                  color: "var(--text)",
                }}
              >
                <PageHeader />
                <div className="max-w-full">
                  <ErrorBoundary>
                    <Outlet />
                  </ErrorBoundary>
                </div>
              </main>
            </div>
          </div>
        </div>
      </SearchProvider>
    </BreadcrumbProvider>
  );
};

export default AdminLayout;
