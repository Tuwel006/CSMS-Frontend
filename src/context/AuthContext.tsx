import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const auth = localStorage.getItem('auth');
    return auth === 'true' ? { name: 'PlayerX', email: 'player@example.com' } : null;
  });

  const login = async (email: string, password: string) => {
    // Mock authentication
    if (email && password) {
      setIsAuthenticated(true);
      setUser({ name: 'PlayerX', email });
      localStorage.setItem('auth', 'true');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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