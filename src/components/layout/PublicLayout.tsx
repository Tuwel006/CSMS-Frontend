import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Gamepad2, User, Moon, Sun } from 'lucide-react';
import PublicHeader from './PublicHeader';
import { useAuthContexxt } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const PublicLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {isAuth, user, logout } = useAuthContexxt();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Home', href: '/', isActive: location.pathname === '/' },
    { label: 'Matches', href: '/matches', isActive: location.pathname.startsWith('/matches') },
    { label: 'Tournaments', href: '/tournaments', isActive: location.pathname.startsWith('/tournaments') },
    { label: 'Leaderboards', href: '/leaderboards', isActive: location.pathname.startsWith('/leaderboards') },
    { label: 'Profile', href: '/profile', isActive: location.pathname.startsWith('/profile') }
  ];

  const handleLogout = () => {
    logout();
  };

  const actions = !isAuth
    ? [
        { icon: theme === 'dark' ? Sun : Moon, onClick: toggleTheme },
        { icon: User, label: 'Login', onClick: () => navigate('/login') }
      ]
    : [{ icon: theme === 'dark' ? Sun : Moon, onClick: toggleTheme }];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <PublicHeader
        logo={{ icon: Gamepad2, className: 'text-slate-300' }}
        navItems={navItems}
        actions={actions}
        user={user}
        isAuth={isAuth}
        onLogout={handleLogout}
      />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
