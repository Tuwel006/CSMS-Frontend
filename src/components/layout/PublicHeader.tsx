import { useState } from 'react';
import { type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type TokenPayload } from '@/types/auth';
import ProfileDropdown from './ProfileDropdown';
interface NavItem {
  label: string;
  href: string;
  className?: string;
  isActive?: boolean;
}

interface ActionItem {
  icon: LucideIcon;
  label?: string;
  onClick?: () => void;
  className?: string;
}

interface DynamicHeaderProps {
  logo: {
    icon: LucideIcon;
    className?: string;
  };
  navItems: NavItem[];
  actions: ActionItem[];
  containerClassName?: string;
  navClassName?: string;
  mobileMenuClassName?: string;
  user: TokenPayload | null;
  isAuth: boolean;
  onLogout: () => void;
}

const PublicHeader = ({
  logo,
  navItems,
  actions,
  containerClassName = 'bg-slate-900 text-white px-4 sm:px-6 py-4',
  navClassName = 'hidden md:flex items-center gap-8',
  mobileMenuClassName = 'md:hidden mt-4 pb-4 border-t border-gray-700',
  user,
  isAuth,
  onLogout
}: DynamicHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const Logo = logo.icon;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <header className={containerClassName}>
      <div className="flex items-center justify-between">
        <Logo className={logo.className} size={32} />
        
        <nav className={navClassName}>
          {navItems.map((item, index) => (
            <Link 
              key={index}
              to={item.href}
              className={item.className || (item.isActive ? "text-green-400 border-b-2 border-green-400 pb-1" : "hover:text-green-400")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuth && user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-white hover:text-green-400"
              >
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              </button>
              {isDropdownOpen && (
                <ProfileDropdown user={user} onLogout={onLogout} />
              )}
            </div>
          ) : (
            actions.map((action, index) => {
              const Icon = action.icon;
              return action.label ? (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={
                    action.className ||
                    'flex items-center gap-2 text-white hover:text-green-400'
                  }
                >
                  <Icon className="bg-gray-600 rounded-full p-1" size={32} />
                  {action.label}
                </button>
              ) : (
                <Icon
                  key={index}
                  onClick={action.onClick}
                  className={
                    action.className || 'hover:text-green-400 cursor-pointer'
                  }
                  size={20}
                />
              );
            })
          )}
        </div>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className={mobileMenuClassName}>
          <nav className="flex flex-col gap-4 mt-4">
            {navItems.map((item, index) => (
              <a 
                key={index}
                href={item.href}
                className={item.isActive ? "text-green-400 border-b border-green-400 pb-2" : "hover:text-green-400"}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button key={index} onClick={action.onClick} className={action.className || "flex items-center gap-2 text-white hover:text-green-400"}>
                  <Icon className="bg-gray-600 rounded-full p-1" size={24} />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
