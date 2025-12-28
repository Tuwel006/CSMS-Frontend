import { useState, useMemo } from 'react';
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
  navClassName = 'hidden md:flex items-center gap-1',
  user,
  isAuth,
  onLogout
}: DynamicHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const Logo = logo.icon;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const avatarColor = useMemo(() => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'];
    const index = user?.email ? user.email.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }, [user?.email]);
  return (
    <header className='bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Logo className='text-slate-700 dark:text-slate-300' size={26} />
            <span className='text-slate-900 dark:text-slate-100 font-semibold text-base hidden sm:block'>CSMS</span>
          </div>
          
          <nav className={navClassName}>
            {navItems.map((item, index) => (
              <Link 
                key={index}
                to={item.href}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  item.isActive 
                    ? 'text-blue-600 dark:text-white border-b-2 border-blue-500' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return action.label ? (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm font-medium transition-colors"
                >
                  <Icon size={16} />
                  {action.label}
                </button>
              ) : (
                <button
                  key={index}
                  onClick={action.onClick}
                  className='p-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors'
                >
                  <Icon size={18} />
                </button>
              );
            })}
            {isAuth && user && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-slate-300 hover:text-white px-2 py-1.5 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center font-semibold text-white border border-slate-500`}>
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                </button>
                {isDropdownOpen && (
                  <ProfileDropdown user={user} onLogout={onLogout} />
                )}
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors'
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className='md:hidden bg-gray-100 dark:bg-slate-700 border-t border-gray-300 dark:border-slate-600'>
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex flex-col gap-1">
              {navItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.href}
                  className={`px-4 py-2.5 text-sm font-medium transition-all rounded-md ${
                    item.isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-300 dark:border-slate-600">
              {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button 
                    key={index} 
                    onClick={action.onClick} 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm font-medium transition-colors flex-1 justify-center rounded-md shadow-sm"
                  >
                    <Icon size={16} />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
