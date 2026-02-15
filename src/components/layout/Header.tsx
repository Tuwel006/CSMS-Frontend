import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSearch } from '../../context/SearchContext';
import { Sun, Moon, ChevronDown } from 'lucide-react';
import SearchBar from '../ui/SearchBar';
import SearchResults from '../ui/SearchResults';
import ProfileDropdown from './ProfileDropdown';
import useAuth from '../../hooks/useAuth';
import { useAuthContexxt } from '../../context/AuthContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const {
    isSearchOpen,
    searchValue,
    toggleSearch,
    setSearchValue,
    performSearch,
  } = useSearch();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const { logout } = useAuth();
  const { user } = useAuthContexxt();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-14 bg-[var(--header-bg)] border-b border-[var(--card-border)] flex items-center justify-between px-6 sticky top-0 z-50 relative">
      {/* Premium accent line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="flex items-baseline gap-2">
        <h1 className="text-lg font-black text-[var(--header-text)] tracking-tighter uppercase font-outfit leading-none">
          CSMS <span className="text-cyan-600">Portal</span>
        </h1>
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-500 opacity-70">Management</span>
      </div>
      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <SearchBar
            isOpen={isSearchOpen}
            onToggle={toggleSearch}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearch={performSearch}
            placeholder="Search matches, teams, players..."
          />
          <SearchResults />
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-[var(--hover-bg)] text-[var(--header-text)]"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun />
          ) : (
            <Moon />
          )}
        </button>
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-white">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <ChevronDown
              className={`text-[var(--header-text)] transition-transform ${isProfileOpen ? 'rotate-180' : ''
                }`}
              size={16}
            />
          </button>
          {isProfileOpen && user && (
            <ProfileDropdown user={user} onLogout={handleLogout} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
