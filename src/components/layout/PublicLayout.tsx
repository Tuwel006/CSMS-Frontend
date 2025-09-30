import { Outlet, useNavigate, useOutlet } from 'react-router-dom';
import { Gamepad2, User } from 'lucide-react';
import PublicHeader from './PublicHeader';
import { useAuthContexxt } from '@/context/AuthContext';

const PublicLayout = () => {
  const navigate = useNavigate();
  const outlet = useOutlet();
  const {isAuth, user, logout } = useAuthContexxt();
  console.log('Outlet:', outlet);
  const navItems = [
    { label: 'Home', href: '/', isActive: true },
    { label: 'Matches', href: '/matches' },
    { label: 'Tournaments', href: '/tournaments' },
    { label: 'Leaderboards', href: '/leaderboards' },
    { label: 'Profile', href: '/profile' }
  ];

  const handleLogout = () => {
    logout();
    // navigate('/login');
  };
  console.log('Public Layout Rendered. isAuth:', isAuth, 'user:', user);
  const actions = !isAuth
    ? [{ icon: User, label: 'Login', onClick: () => navigate('/login') }]
    : [];

  return (
    <div className="min-h-screen bg-slate-800">
      <PublicHeader
        logo={{ icon: Gamepad2, className: 'text-green-400' }}
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
