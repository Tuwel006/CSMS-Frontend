import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type JSX } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconButton } from "../ui/lib/IconButton";
import { Stack } from "../ui/lib/Stack";

interface SidebarProps {
  links: { to: string; icon: JSX.Element; label: string }[];
  isMobileOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ links, isMobileOpen, onClose }: SidebarProps) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const pathnames = location.pathname?.split('/');
  const path = `/${pathnames[1]}`;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block sticky top-12 md:top-14 h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)] transition-all duration-300 z-30
          ${open ? "w-52" : "w-14"} bg-[var(--header-bg)] border-r border-[var(--card-border)] overflow-y-auto`}
      >
        <div className="border-b border-[var(--card-border)]">
          <IconButton
            icon={open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            onClick={() => setOpen(!open)}
            tooltip={open ? "Collapse" : "Expand"}
            className="w-full rounded-none"
            size="sm"
          />
        </div>
        <nav className="mt-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={path + link.to}
              className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-200 dark:hover:bg-white/10 text-[var(--header-text)] transition-colors
                ${location.pathname === path + link.to ? "bg-gray-300 dark:bg-white/20" : ""}`}
            >
              <span className="text-[16px]">{link.icon}</span>
              {open && <span className="text-xs font-medium">{link.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar Overlay - Hide when bottom nav exists */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 top-12"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar Drawer - Hide on mobile, only show on tablet */}
      <aside
        className={`hidden sm:block lg:hidden fixed top-12 left-0 h-[calc(100vh-3rem)] w-56 bg-[var(--header-bg)] border-r border-[var(--card-border)] z-50 transform transition-transform duration-300 overflow-y-auto
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav className="p-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={path + link.to}
              onClick={onClose}
              className={`flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-gray-200 dark:hover:bg-white/10 text-[var(--header-text)] transition-colors mb-1
                ${location.pathname === path + link.to ? "bg-gray-300 dark:bg-white/20" : ""}`}
            >
              <span className="text-[16px]">{link.icon}</span>
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--header-bg)] border-t border-[var(--card-border)] z-30">
        <Stack direction="row" justify="around" className="py-1.5">
          {links.slice(0, 5).map((link) => (
            <Link
              key={link.to}
              to={path + link.to}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-sm transition-colors min-w-0
                ${location.pathname === path + link.to 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text)]"}`}
            >
              <span className="text-[18px]">{link.icon}</span>
              <span className="text-[9px] font-medium truncate max-w-full">{link.label}</span>
            </Link>
          ))}
        </Stack>
      </nav>
    </>
  );
};

export default Sidebar;
