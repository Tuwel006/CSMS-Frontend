import { type TokenPayload } from '@/types/auth';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileDropdownProps {
  user: TokenPayload;
  onLogout: () => void;
}

const ProfileDropdown = ({ user, onLogout }: ProfileDropdownProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={cn(
      "absolute right-0 mt-3 w-64 rounded-xs shadow-2xl py-2 z-[60] border overflow-hidden",
      isDark
        ? "bg-[#0a0a0b] border-[#1a1c1e] shadow-black/50"
        : "bg-white border-slate-200 shadow-slate-200/50"
    )}>
      {/* User Header */}
      <div className="px-5 py-4 border-b border-[var(--card-border)] bg-[#0c0e10]">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xs bg-indigo-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/20">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-black text-[var(--text)] text-[10px] uppercase tracking-widest truncate leading-none mb-1.5">
              {user?.email?.split('@')[0]}
            </p>
            <p className="text-[var(--text-secondary)] text-[9px] font-bold uppercase tracking-wider truncate opacity-60">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Action Links */}
      <div className="py-2">
        <Link
          to="/admin/profile"
          className="flex items-center gap-3 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-indigo-400 hover:bg-[#151719] transition-all"
        >
          <User size={14} className="opacity-50" />
          View Profile
        </Link>
        <Link
          to="/admin/settings"
          className="flex items-center gap-3 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-indigo-400 hover:bg-[#151719] transition-all"
        >
          <Settings size={14} className="opacity-50" />
          Settings
        </Link>
      </div>

      <div className="border-t border-[var(--card-border)] my-1"></div>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all"
      >
        <LogOut size={14} className="opacity-70" />
        Sign Out
      </button>
    </div>
  );
};

export default ProfileDropdown;
