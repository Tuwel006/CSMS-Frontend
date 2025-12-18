import { useState } from 'react';
import { AuthService } from '../services/authService';
import { useAuthContexxt } from '../context/AuthContext';
import { AuthResponse } from '@/types/authService';

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
}

interface UseAuthReturn {
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  data: AuthResponse["data"] | null;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: setAuth } = useAuthContexxt();
  const [data, setData] = useState<AuthResponse["data"] | null>(null);

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AuthService.login(data);
      if(response.data) {
        setData(response.data);
      }
      if (response?.data?.token) {
        setAuth(response.data.token);
      }
      console.log('User Data:', response);
      localStorage.setItem('user', JSON.stringify(response.data?.user));
      if (response?.data?.activeMatchId) {
        localStorage.setItem('activeMatchToken', response.data.activeMatchId);
      }
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
      await AuthService.signup(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const { logout: clearAuth } = useAuthContexxt();
  const logout = () => {
    clearAuth();
    setError(null);
  };

  return {
    loading,
    error,
    login,
    data,
    signup,
    logout,
  };
};

export default useAuth;
