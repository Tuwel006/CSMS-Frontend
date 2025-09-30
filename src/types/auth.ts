export type UserRole = 'user' | 'guest' | 'admin' | 'subscriber' | 'superadmin';

export interface TokenPayload {
  id: string;
  username: string;
  email: string;
  isGlobalAdmin: boolean;
  tenantId: string;
  exp?: number;
}

export interface AuthTokenHook {
  token: string | null;
  payload: TokenPayload | null;
  isAuth: boolean;
  role: UserRole | '';
  clearToken: () => void;
  setToken: (token: string) => void;
}
