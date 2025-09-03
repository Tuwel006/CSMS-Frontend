import { useState } from "react";
import { LayoutDashboard, Home, Edit, Settings, Users, UserPlus, BarChart3, TrendingUp, ChevronRight, ChevronLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/match-setup", icon: <Edit size={20} />, label: "Match Setup" },
    { to: "/team-management", icon: <Users size={20} />, label: "Team Management" },
    { to: "/player-management", icon: <UserPlus size={20} />, label: "Player Management" },
    { to: "/score-updates", icon: <TrendingUp size={20} />, label: "Score Updates" },
    { to: "/statistics", icon: <BarChart3 size={20} />, label: "Statistics" },
    { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <aside
      className={`lg:relative top-16 lg:top-0 left-0 h-[calc(100vh-4rem)] transition-all duration-300 z-50
        ${open ? "w-52 fixed" : "w-16"} bg-[var(--card-bg)] border-r border-[var(--card-border)]`}
    >
      <button
        className="w-full flex items-center justify-center px-4 py-4 text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-[var(--card-border)]"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronLeft size={24} strokeWidth={2.5} /> : <ChevronRight size={24} strokeWidth={2.5} />}
      </button>
      <nav className="mt-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-[var(--text)]
              ${location.pathname === link.to ? "bg-gray-100 dark:bg-gray-700" : ""}`}
          >
            {link.icon}
            {open && <span>{link.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
