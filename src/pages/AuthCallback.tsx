import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Gamepad2, Loader2 } from 'lucide-react';
import useAuthToken from '../hooks/useAuthToken';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setToken } = useAuthToken();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        navigate('/login?error=' + encodeURIComponent(error));
        return;
      }

      if (token) {
        setToken(token);
        navigate('/dashboard');
      } else {
        navigate('/login?error=no_token');
      }
    };

    handleAuthCallback();
  }, [searchParams, setToken, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Gamepad2 className="text-green-400 animate-pulse" size={64} />
        </div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Loader2 className="animate-spin text-green-400" size={24} />
          <h1 className="text-2xl font-bold text-white">Authenticating...</h1>
        </div>
        <p className="text-gray-400">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
};

export default AuthCallback;