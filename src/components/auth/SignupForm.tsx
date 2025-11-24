import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { Input, Button } from '../ui';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const { signup, loading, error } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) {
      errors.terms = 'You must accept the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await signup({ username, email, password });
      navigate('/user/auth/login');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className={cn('text-xl font-semibold mb-2', isDark ? 'text-white' : 'text-slate-900')}>
          Create Account
        </h2>
        <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
          Join the professional cricket management platform
        </p>
      </div>

      {error && (
        <div className={cn(
          'mb-4 p-3 rounded-lg text-sm border',
          isDark 
            ? 'bg-red-900/20 border-red-800 text-red-400' 
            : 'bg-red-50 border-red-200 text-red-700'
        )}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          label="Username"
          value={username}
          onChange={setUsername}
          placeholder="Choose a username"
          leftIcon={<User size={16} />}
          required
          variant="default"
          size="md"
          error={validationErrors.username}
        />

        <Input
          type="email"
          label="Email Address"
          value={email}
          onChange={setEmail}
          placeholder="Enter your email"
          leftIcon={<Mail size={16} />}
          required
          variant="default"
          size="md"
          error={validationErrors.email}
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Create a password"
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                'transition-colors',
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          required
          variant="default"
          size="md"
          error={validationErrors.password}
          helperText="Must be at least 6 characters"
        />

        <Input
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm your password"
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={cn(
                'transition-colors',
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          required
          variant="default"
          size="md"
          error={validationErrors.confirmPassword}
        />

        <div className="space-y-2">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600 mt-0.5"
            />
            <span className={cn('ml-2 text-xs', isDark ? 'text-gray-300' : 'text-gray-700')}>
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                Privacy Policy
              </a>
            </span>
          </label>
          {validationErrors.terms && (
            <p className="text-xs text-red-500">{validationErrors.terms}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          leftIcon={!loading && <UserPlus size={16} />}
          className="w-full"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className={cn('w-full border-t', isDark ? 'border-gray-600' : 'border-gray-300')} />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={cn('px-2 bg-white', isDark ? 'bg-gray-800 text-gray-400' : 'text-gray-500')}>
              Or sign up with
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="w-full">
            <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </Button>
          <Button variant="outline" size="md" className="w-full">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;