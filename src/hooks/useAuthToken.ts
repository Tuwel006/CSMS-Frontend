import type { UserRole, TokenPayload } from '@/types/auth';
import { useState, useEffect, useMemo } from 'react';

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

const useAuthToken = () => {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem('authToken')
  );

  const decodedPayload = useMemo(() => {
    if (!token) return null;
    return decodeToken(token);
  }, [token]);

  useEffect(() => {
    const handleStorageChange = () => {
      setTokenState(localStorage.getItem('authToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setToken = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setTokenState(newToken);
  };

  const clearToken = () => {
    localStorage.removeItem('authToken');
    setTokenState(null);
  };

  const isAuth = !!(
    decodedPayload && decodedPayload.exp > Date.now() / 1000
  );
  const role: UserRole | 'guest' =
    isAuth && decodedPayload ? decodedPayload.role : 'guest';
  const user = decodedPayload;

  return {
    token,
    user,
    role,
    clearToken,
    setToken,
    isAuth
  };
};

export default useAuthToken;
