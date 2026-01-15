import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSearch } from '../../context/SearchContext';
import { Sun, Moon, Search, Menu, X } from 'lucide-react';
import { IconButton } from '../ui/lib/IconButton';
import { Stack } from '../ui/lib/Stack';
import SearchBar from '../ui/SearchBar';
import SearchResults from '../ui/SearchResults';
import ProfileDropdown from './ProfileDropdown';
import useAuth from '../../hooks/useAuth';
import { useAuthContexxt } from '../../context/AuthContext';

interface MobileHeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

const Header = ({ onMenuToggle, isMobileMenuOpen }: MobileHeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { isSearchOpen, searchValue, toggleSearch, setSearchValue, performSearch } = useSearch();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const { logout } = useAuth();
  const { user } = useAuthContexxt();

  return (
    <header className="h-12 md:h-14 bg-[var(--header-bg)] border-b border-[var(--card-border)] sticky top-0 z-40">
      <Stack direction="row" justify="between" align="center" className="h-full px-2 md:px-4">
        <Stack direction="row" align="center" gap="xs">
          <IconButton
            icon={isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            onClick={onMenuToggle}
            tooltip={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden"
            size="sm"
          />
          <h1 className="text-sm md:text-lg font-bold text-[var(--header-text)] truncate">
            Cricket Score
          </h1>
        </Stack>

        <Stack direction="row" align="center" gap="xs">
          <div className="relative flex items-center">
            <IconButton
              icon={<Search size={18} />}
              onClick={toggleSearch}
              tooltip="Search"
              className="md:hidden"
              size="sm"
            />
            <div className="hidden md:flex items-center">
              <SearchBar
                isOpen={isSearchOpen}
                onToggle={toggleSearch}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onSearch={performSearch}
                placeholder="Search..."
              />
            </div>
            <SearchResults />
          </div>

          <IconButton
            icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            onClick={toggleTheme}
            tooltip={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            size="sm"
          />

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!isProfileOpen)}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs hover:bg-blue-700 transition-colors"
            >
              {user?.email?.charAt(0).toUpperCase()}
            </button>
            {isProfileOpen && user && (
              <ProfileDropdown user={user} onLogout={logout} />
            )}
          </div>
        </Stack>
      </Stack>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-[var(--header-bg)] border-b border-[var(--card-border)] p-3">
          <SearchBar
            isOpen={true}
            onToggle={toggleSearch}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearch={performSearch}
            placeholder="Search..."
          />
        </div>
      )}
    </header>
  );
};

export default Header;
