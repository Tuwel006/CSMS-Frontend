import React, { useState } from "react";
import { ChevronLeft, PanelLeftClose, PanelLeftOpen, LogOut, AlertCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Stack } from "../ui/lib/Stack";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface SidebarProps {
  links: { to: string; icon: React.ReactNode; label: string }[];
  isMobileOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ links, isMobileOpen, onClose }: SidebarProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [open, setOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isBottomBarCollapsed, setIsBottomBarCollapsed] = useState(false);
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
        className={cn(
          "hidden lg:flex flex-col sticky top-12 h-[calc(100vh-3rem)] transition-all duration-500 z-30",
          open ? "w-50" : "w-12",
          "bg-[var(--header-bg)] border-r border-[var(--card-border)] shadow-sm"
        )}
      >
        <nav className={cn(
          "flex-1 mt-4 space-y-0.5 overflow-y-auto no-scrollbar transition-all duration-500",
          open ? "px-3" : "px-2"
        )}>
          {links.map((link) => {
            const absolutePath = link.to.startsWith('/') ? `${basePath}${link.to}` : `${basePath}/${link.to}`;
            const isActive = currentPath === absolutePath || (link.to === "" && currentPath === basePath);

            return (
              <Link
                key={link.to}
                to={absolutePath}
                className={cn(
                  "group flex items-center gap-3 py-1.5 rounded-sm transition-all duration-300 relative",
                  open ? "px-2.5" : "justify-center",
                  isActive
                    ? (isDark ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50/70 text-indigo-600")
                    : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"
                )}
              >
                {/* Active Indicator Bar - Compact Thin Line */}
                {isActive && (
                  <div className={cn(
                    "absolute top-1.5 bottom-1.5 w-[2.5px] rounded-r-full z-20 transition-all duration-300",
                    isDark ? "bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]" : "bg-indigo-500",
                    open ? "left-0" : "left-[-8px]"
                  )} />
                )}

                <div className={cn(
                  "flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-xs border transition-all duration-500 relative overflow-hidden group-hover:scale-105",
                  isActive
                    ? (isDark
                      ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                      : "bg-indigo-100/70 border-indigo-300 text-indigo-600 shadow-sm")
                    : (isDark
                      ? "bg-slate-800/10 border-white/5 text-slate-500 shadow-none"
                      : "bg-slate-50 border-slate-200 text-slate-400 group-hover:border-indigo-300 group-hover:text-indigo-500")
                )}>
                  {/* Specular Edge Highlight */}
                  {isDark && <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none opacity-50" />}

                  {React.isValidElement(link.icon) && React.cloneElement(link.icon as React.ReactElement<any>, {
                    size: 16,
                    strokeWidth: isActive ? 2.5 : 2
                  })}
                </div>

                <span className={cn(
                  "text-[9px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-500",
                  open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none absolute"
                )}>
                  {link.label}
                </span>

                {/* Tooltip for collapsed state */}
                {!open && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[60] shadow-xl border border-white/5">
                    {link.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Bottom Section - Compact ERP Style */}
        <div className={cn(
          "p-2 border-t border-[var(--card-border)] bg-[var(--header-bg)]/50",
          !open && "flex flex-col items-center gap-1"
        )}>
          <div className={cn(
            "flex gap-1",
            open ? "items-center w-full" : "flex-col items-center"
          )}>
            {/* Logout Button */}
            <button
              onClick={() => setLogoutModalOpen(true)}
              className={cn(
                "flex items-center justify-center h-8 rounded-sm transition-all duration-300 group relative",
                open
                  ? "flex-1 px-3 bg-red-500/5 text-red-500/60 hover:text-red-500 hover:bg-red-500/10"
                  : "w-9 text-red-500/60 hover:text-red-500 hover:bg-red-500/5"
              )}
              title="Logout"
            >
              <LogOut size={14} strokeWidth={2.5} />
              {open && (
                <span className="ml-2 text-[9px] font-bold uppercase tracking-[0.1em] flex-1 text-left truncate">Logout</span>
              )}
              {!open && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[60] shadow-xl">
                  Logout
                </div>
              )}
            </button>

            {/* Premium Collapse Button */}
            <button
              onClick={() => setOpen(!open)}
              className={cn(
                "flex items-center justify-center h-8 rounded-sm transition-all duration-300 group relative",
                open
                  ? "px-3 text-[var(--text-secondary)] hover:text-cyan-600 hover:bg-cyan-500/5"
                  : "w-9 text-[var(--text-secondary)] hover:text-cyan-600 hover:bg-cyan-500/5"
              )}
              title={open ? "Collapse Menu" : "Expand Menu"}
            >
              <div className="transition-transform duration-500" style={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                {open ? <PanelLeftClose size={16} strokeWidth={2.2} /> : <PanelLeftOpen size={16} strokeWidth={2.2} />}
              </div>

              {!open && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[60] shadow-xl border border-white/5">
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
        className={cn(
          "fixed top-0 left-0 h-full w-72 border-r z-[70] transform transition-transform duration-500 ease-in-out flex flex-col",
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
          "bg-[var(--header-bg)] border-r border-[var(--card-border)]"
        )}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-indigo-500/5 relative overflow-hidden">
          <h2 className="text-sm font-black uppercase tracking-[0.25em] text-indigo-400">Navigation</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-[var(--text-secondary)] transition-all active:scale-90">
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
                className={cn(
                  "flex items-center gap-5 px-5 py-4 rounded-sm transition-all border group relative overflow-hidden",
                  isActive
                    ? (isDark
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-black shadow-[0_8px_32px_rgba(99,102,241,0.15)]"
                      : "bg-indigo-50 border-indigo-200 text-indigo-600 font-black")
                    : "border-transparent text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text)]"
                )}
              >
                <div className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-sm border transition-all duration-300 relative overflow-hidden",
                  isActive
                    ? (isDark ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-400" : "bg-white border-indigo-300 text-indigo-600 shadow-sm")
                    : (isDark ? "bg-white/5 border-white/5 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400")
                )}>
                  {React.isValidElement(link.icon) && React.cloneElement(link.icon as React.ReactElement<any>, { size: 22, strokeWidth: isActive ? 2.5 : 2 })}
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.25em]">{link.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setLogoutModalOpen(true)}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-sm transition-all border border-transparent text-red-500 hover:bg-red-500/5 mt-4 group"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-sm bg-red-500/5 border border-red-500/10 text-red-500 group-hover:bg-red-500/10 transition-all">
              <LogOut size={22} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Logout Session</span>
          </button>
        </nav>
      </aside>

      {/* Premium Mobile Bottom Navigation - Collapsable ERP Style */}
      <nav
        className={cn(
          "lg:hidden fixed bottom-0 left-0 right-0 border-t z-50 transition-all duration-500 ease-in-out",
          "bg-[var(--header-bg)] border-[var(--card-border)] shadow-[0_-8px_30px_rgba(0,0,0,0.15)]",
          isBottomBarCollapsed ? "translate-y-[calc(100%-12px)]" : "translate-y-0"
        )}
      >
        {/* Minimalist Collapse Handle */}
        <button
          onClick={() => setIsBottomBarCollapsed(!isBottomBarCollapsed)}
          className="w-full h-4 flex items-center justify-center group"
          aria-label={isBottomBarCollapsed ? "Expand Navigation" : "Collapse Navigation"}
        >
          <div className={cn(
            "w-12 h-1 rounded-full transition-all duration-300",
            isBottomBarCollapsed
              ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
              : "bg-[var(--card-border)] group-hover:bg-indigo-400 group-hover:opacity-70"
          )} />
        </button>

        <Stack direction="row" justify="around" className={cn(
          "pb-safe transition-all duration-300",
          isBottomBarCollapsed ? "opacity-0 invisible h-0" : "py-2.5 opacity-100 visible"
        )}>
          {links.slice(0, 5).map((link) => {
            const absolutePath = link.to.startsWith('/') ? `${basePath}${link.to}` : `${basePath}/${link.to}`;
            const isActive = currentPath === absolutePath || (link.to === "" && currentPath === basePath);
            return (
              <Link
                key={link.to}
                to={absolutePath}
                className={cn(
                  "flex flex-col items-center gap-1.5 px-3 py-1 rounded-sm transition-all duration-300 relative",
                  isActive ? "text-indigo-400" : "text-[var(--text-secondary)]"
                )}
              >
                {isActive && (
                  <div className="absolute top-[-10px] w-8 h-[2px] bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                )}
                <div className={cn("transition-transform duration-300", isActive ? "scale-110 -translate-y-0.5" : "")}>
                  {React.isValidElement(link.icon) && React.cloneElement(link.icon as React.ReactElement<any>, { size: 20 })}
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.1em] whitespace-nowrap leading-none transition-all">{link.label}</span>
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
          <h3 className="text-base font-black text-[var(--text)] uppercase tracking-wider">Are you sure?</h3>
          <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest mt-2 leading-relaxed opacity-70">
            You are about to end your current session.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
