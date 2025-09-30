import { type TokenPayload } from '@/types/auth';

interface ProfileDropdownProps {
  user: TokenPayload;
  onLogout: () => void;
}

const ProfileDropdown = ({ user, onLogout }: ProfileDropdownProps) => {
  return (
    <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl py-2 z-50 border border-slate-700">
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-white">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white text-md">{user?.email?.split('@')[0]}</p>
            <p className="text-slate-400 text-sm">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700 my-1"></div>
      <a
        href="/profile"
        className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
      >
        View Profile
      </a>
      <a
        href="/settings"
        className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
      >
        Settings
      </a>
      <div className="border-t border-slate-700 my-1"></div>
      <button
        onClick={onLogout}
        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
      >
        Sign Out
      </button>
    </div>
  );
};

export default ProfileDropdown;
