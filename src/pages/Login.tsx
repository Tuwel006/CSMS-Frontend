import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Gamepad2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useAuthToken from '../hooks/useAuthToken';
import Input from '../components/ui/Input';
import Form from '../components/ui/Form';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, loading, error } = useAuth();
  const { isAuth } = useAuthToken();
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   if (isAuth) {
  //     navigate('/home');
  //   }
  // }, [isAuth, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await signup({ username, email, password });
        navigate('/login');
        return;
      }
      setTimeout(() => {navigate('/');}, 1000);
      
      const pathname = location.pathname;
      window.open(`${pathname}`, '_blank');
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="bg-black/50 absolute inset-0"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Gamepad2 className="text-green-400" size={48} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back!' : 'Join the Game!'}
            </h1>
            <p className="text-gray-400">
              {isLogin ? 'Sign in to continue your gaming journey' : 'Create your account to get started'}
            </p>
          </div>

          {/* Form */}
          <Form 
            onSubmit={handleSubmit}
            variant="minimal"
            spacing="lg"
            loading={loading}
            error={error}
            footerSlot={
              <div className="space-y-4">
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-green-400 bg-slate-700 border-slate-600 rounded focus:ring-green-400" />
                      <span className="ml-2 text-sm text-gray-300">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-green-400 hover:text-green-300">Forgot password?</a>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-400 text-black py-3 px-4 rounded-lg font-semibold hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
                </button>
              </div>
            }
          >
            {!isLogin && (
              <Input
                type="text"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                leftIcon={<Mail size={20} />}
                required
              />
            )}
            
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              leftIcon={<Mail size={20} />}
              required
            />

            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              leftIcon={<Lock size={20} />}
              required
            >
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </Input>
          </Form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-400 hover:text-green-300 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;