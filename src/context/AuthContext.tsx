import type { TokenPayload, UserRole } from '@/types/auth';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuth: boolean;
  user: TokenPayload | null;
  role: UserRole | 'guest';
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const decodeToken = (token: string): TokenPayload | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };

  const getToken = (): string | null => {
    return localStorage.getItem('authToken');
  };

  const getUser = (): TokenPayload | null => {
    const token = getToken();
    if (!token) return null;
    const newUser = decodeToken(token);
    return newUser;
  };

  const getRole = (): UserRole | 'guest' => {
    const user = getUser();
    if (user && user.isGlobalAdmin){
       return 'admin';
    }
    if (user) {
      return 'user';
    }
    return 'guest';
  };

  const getIsAuth = (): boolean => {
    const user = getUser();
    return !!user;
  };

  const [user, setUser] = useState<TokenPayload | null>(() => getUser());
  const [role, setRole] = useState<UserRole | 'guest'>(() => getRole());
  const [isAuth, setIsAuth] = useState<boolean>(() => getIsAuth());

  const login = (token: string) => {
    const newUser = decodeToken(token);
    if (newUser) {
      localStorage.setItem('authToken', token);
      setUser(newUser);
      setIsAuth(true);
      if (newUser.isGlobalAdmin) {
        setRole('admin');
      } else {
        setRole('user');
      }
    }
  };

  const logout = () => {
    setIsAuth(false);
    setUser(null);
    setRole('guest');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuth, user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const useAuthContexxt = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
