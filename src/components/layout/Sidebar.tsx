import { useState } from "react";
import { LayoutDashboard, Home, Edit } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", icon: <Home size={20} />, label: "Home" },
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/scoreeditor", icon: <Edit size={20} />, label: "Editor" },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] transition-all duration-300
        ${open ? "w-52" : "w-16"} bg-[var(--card-bg)] border-r border-[var(--card-border)]`}
    >
      <button
        className="w-full text-left px-4 py-3 text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => setOpen(!open)}
      >
        {open ? "< Collapse" : "> Expand"}
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
