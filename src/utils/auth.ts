import type { UserRole, TokenPayload } from '@/types/auth';

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

export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setToken = (newToken: string): void => {
  localStorage.setItem('authToken', newToken);
};

export const clearToken = (): void => {
  localStorage.removeItem('authToken');
};

export const getUser = (): TokenPayload | null => {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
};



export const getIsAuth = (): boolean => {
  const user = getUser();
  return !!user;
};

export const getRole = (): UserRole | 'guest' => {
  const user = getUser();
  if (user && user.isGlobalAdmin) return 'admin';
  if (user) return 'user';
  return 'guest';
};


export const user = getUser();
export const isAuth = getIsAuth();
export const role = getRole();