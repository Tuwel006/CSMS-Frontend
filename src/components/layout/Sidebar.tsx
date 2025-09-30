import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type JSX } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ links }: { links: { to: string; icon: JSX.Element; label: string }[] }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const pathnames = location.pathname?.split('/');
  const path = `/${pathnames[1]}`;



  return (
    <aside
      className={`fixed lg:relative top-16 lg:top-0 left-0 h-[calc(100vh-4rem)] transition-all duration-300 z-50
        ${open ? "w-52" : "w-16"} bg-[var(--card-bg)] border-r border-[var(--card-border)]`}
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
            to={path+link.to}
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
