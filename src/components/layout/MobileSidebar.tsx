import React, { useState } from "react";
import { ChevronLeft, PanelLeftClose, PanelLeftOpen, LogOut, AlertCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Stack } from "../ui/lib/Stack";
import useAuth from "../../hooks/useAuth";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface SidebarProps {
  links: { to: string; icon: React.ReactNode; label: string }[];
  isMobileOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ links, isMobileOpen, onClose }: SidebarProps) => {
  const [open, setOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const currentPath = location.pathname;

  // Get the base path (e.g., /admin) to handle relative links correctly
  const pathSegments = currentPath.split('/');
  const basePath = pathSegments[1] ? `/${pathSegments[1]}` : '';

  const handleLogout = () => {
    setLogoutModalOpen(false);
    logout();
  };

  return (
    <>
      {/* Desktop Sidebar - ERP/Portal Style */}
      <aside
        className={`hidden lg:flex flex-col sticky top-14 h-[calc(100vh-3.5rem)] transition-all duration-500 z-30
          ${open ? "w-60" : "w-16"} bg-[var(--header-bg)] border-r border-[var(--card-border)] shadow-sm`}
      >
        <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {links.map((link) => {
            const absolutePath = link.to.startsWith('/') ? `${basePath}${link.to}` : `${basePath}/${link.to}`;
            const isActive = currentPath === absolutePath || (link.to === "" && currentPath === basePath);

            return (
              <Link
                key={link.to}
                to={absolutePath}
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
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900/95 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[60] shadow-xl border border-white/10">
                    {link.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Bottom Section - Compact One-Line ERP Style */}
        <div className="p-2 border-t border-[var(--card-border)] bg-[var(--bg)]/50">
          <div className="flex items-center gap-1">
            {/* Logout Button */}
            <button
              onClick={() => setLogoutModalOpen(true)}
              className={`flex items-center justify-center h-9 rounded-sm transition-all duration-300 group relative
                ${open ? "flex-1 px-3 bg-red-500/5 text-red-500/70 hover:text-red-500 hover:bg-red-500/10" : "w-11 text-red-500/70 hover:text-red-500 hover:bg-red-500/5"}`}
              title="Logout"
            >
              <LogOut size={16} strokeWidth={2.5} />
              {open && (
                <span className="ml-2 text-[9px] font-bold uppercase tracking-[0.15em] flex-1 text-left truncate">Logout</span>
              )}
              {!open && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[60] shadow-xl">
                  Logout
                </div>
              )}
            </button>

            {/* Premium Collapse Button */}
            <button
              onClick={() => setOpen(!open)}
              className={`flex items-center justify-center h-9 rounded-sm transition-all duration-300 group relative
                ${open ? "px-3 text-[var(--text-secondary)] hover:text-cyan-600 hover:bg-cyan-500/5" : "w-11 text-[var(--text-secondary)] hover:text-cyan-600 hover:bg-cyan-500/5"}`}
              title={open ? "Collapse Menu" : "Expand Menu"}
            >
              <div className="transition-transform duration-500" style={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                {open ? <PanelLeftClose size={18} strokeWidth={2.2} /> : <PanelLeftOpen size={18} strokeWidth={2.2} />}
              </div>

              {!open && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[60] shadow-xl border border-white/10">
                  Expand
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] top-0"
          onClick={onClose}
        />
      )}

      {/* Mobile/Tablet Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[var(--header-bg)] border-r border-[var(--card-border)] z-[70] transform transition-transform duration-500 ease-in-out flex flex-col
          ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between bg-cyan-500/5">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">Navigation</h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--hover-bg)] rounded-full text-[var(--text-secondary)]">
            <ChevronLeft size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const absolutePath = link.to.startsWith('/') ? `${basePath}${link.to}` : `${basePath}/${link.to}`;
            const isActive = currentPath === absolutePath || (link.to === "" && currentPath === basePath);
            return (
              <Link
                key={link.to}
                to={absolutePath}
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-sm transition-all border
                  ${isActive
                    ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold"
                    : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"}`}
              >
                <div className={isActive ? 'text-cyan-600' : ''}>
                  {React.isValidElement(link.icon) && React.cloneElement(link.icon as React.ReactElement<any>, { size: 22 })}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest">{link.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setLogoutModalOpen(true)}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-sm transition-all border border-transparent text-red-500 hover:bg-red-500/5 mt-4"
          >
            <LogOut size={22} />
            <span className="text-[11px] font-bold uppercase tracking-widest">Logout Session</span>
          </button>
        </nav>
      </aside>

      {/* Premium Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--header-bg)]/80 backdrop-blur-xl border-t border-[var(--card-border)] z-50 pb-safe">
        <Stack direction="row" justify="around" className="py-2.5">
          {links.slice(0, 5).map((link) => {
            const absolutePath = link.to.startsWith('/') ? `${basePath}${link.to}` : `${basePath}/${link.to}`;
            const isActive = currentPath === absolutePath || (link.to === "" && currentPath === basePath);
            return (
              <Link
                key={link.to}
                to={absolutePath}
                className={`flex flex-col items-center gap-1.5 px-3 py-1 rounded-sm transition-all duration-300 relative
                  ${isActive
                    ? "text-cyan-600 dark:text-cyan-400"
                    : "text-[var(--text-secondary)]"}`}
              >
                {isActive && (
                  <div className="absolute top-[-10px] w-8 h-[2px] bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}>
                  {React.isValidElement(link.icon) && React.cloneElement(link.icon as React.ReactElement<any>, { size: 20 })}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap leading-none transition-all">{link.label}</span>
              </Link>
            );
          })}
        </Stack>
      </nav>

      {/* Beautiful Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Confirm Logout"
        maxWidth="sm"
        footer={
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 font-bold uppercase tracking-widest text-[10px]"
              onClick={() => setLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1 font-bold uppercase tracking-widest text-[10px]"
              onClick={handleLogout}
              leftIcon={<LogOut size={14} />}
            >
              Logout Now
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center py-4 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h3 className="text-base font-bold text-[var(--text)] uppercase tracking-wider">Are you sure?</h3>
          <p className="text-[var(--text-secondary)] text-xs mt-2 leading-relaxed">
            You are about to end your current session. You will need to login again to access the admin portal.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
