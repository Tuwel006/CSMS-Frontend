import React, { useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Sidebar = ({ links }: { links: { to: string; icon: React.ReactNode; label: string }[] }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const currentPath = location.pathname;

  return (
    <aside
      className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto transition-all duration-500 z-50 flex flex-col
        ${open ? "w-60" : "w-16"} bg-[var(--header-bg)] border-r border-[var(--card-border)] shadow-xl lg:shadow-none`}
    >
      <nav className="flex-1 mt-4 px-3 space-y-1">
        {links.map((link) => {
          const isActive = currentPath === link.to || (link.to === "" && currentPath === "/admin");
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`group flex items-center gap-3 px-2.5 py-2.5 rounded-sm transition-all duration-200 relative
                ${isActive
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                  : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"}`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-[-12px] top-1 bottom-1 w-[4px] bg-cyan-500 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              )}

              <div className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {React.isValidElement(link.icon) && React.cloneElement(link.icon as React.ReactElement<any>, {
                  size: 20,
                  strokeWidth: isActive ? 2.5 : 2
                })}
              </div>

              <span className={`text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300
                ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}`}>
                {link.label}
              </span>

              {/* Tooltip for collapsed state */}
              {!open && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[60] shadow-lg border border-white/10">
                  {link.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-1.5 border-t border-[var(--card-border)] space-y-1">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center p-2 rounded-sm text-red-500/70 hover:bg-red-500/5 hover:text-red-500 transition-all duration-300 group relative"
        >
          <LogOut size={18} />
          {open && (
            <span className="ml-3 text-[10px] font-bold uppercase tracking-widest flex-1 text-left">Logout</span>
          )}
          {!open && (
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[60] shadow-xl">
              Logout
            </div>
          )}
        </button>

        <button
          className="w-full flex items-center justify-center p-2 rounded-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-cyan-600 transition-all duration-300"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <div className="flex items-center gap-3 w-full px-1">
              <ChevronLeft size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Collapse</span>
            </div>
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
