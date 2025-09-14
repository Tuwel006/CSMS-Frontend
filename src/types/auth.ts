export type UserRole = 'user' | 'guest' | 'admin' | 'subscriber' | 'superadmin';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  isSubscribed: boolean;
  exp: number;
  iat: number;
}

export interface AuthTokenHook {
  token: string | null;
  payload: TokenPayload | null;
  isAuth: boolean;
  role: UserRole | '';
  clearToken: () => void;
  setToken: (token: string) => void;
}