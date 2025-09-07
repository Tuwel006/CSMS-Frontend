import { useState } from 'react';
import { AuthService } from '../services/authService';
import useAuthToken from './useAuthToken';

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  name?: string;
}

interface UseAuthReturn {
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setToken, clearToken } = useAuthToken();

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AuthService.login(data);
      setToken(response.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AuthService.signup(data);
      setToken(response.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setError(null);
  };

  return {
    loading,
    error,
    login,
    signup,
    logout
  };
};

export default useAuth;