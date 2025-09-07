import { useState, useEffect } from 'react';

interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
}

interface AuthTokenHook {
  token: string | null;
  payload: TokenPayload | null;
  isAuth: boolean;
  roles: string[];
  clearToken: () => void;
  setToken: (token: string) => void;
}

const useAuthToken = (): AuthTokenHook => {
  const [token, setTokenState] = useState<string | null>(null);
  const [payload, setPayload] = useState<TokenPayload | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setTokenState(storedToken);
      decodeToken(storedToken);
    }
  }, []);

  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      setPayload(decoded);
    } catch (error) {
      console.error('Invalid token:', error);
      setPayload(null);
    }
  };

  const setToken = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setTokenState(newToken);
    decodeToken(newToken);
  };

  const clearToken = () => {
    localStorage.removeItem('authToken');
    setTokenState(null);
    setPayload(null);
  };

  const isAuth = !!(token && payload && payload.exp > Date.now() / 1000);
  const roles = payload?.roles || [];

  return {
    token,
    payload,
    isAuth,
    roles,
    clearToken,
    setToken
  };
};

export default useAuthToken;