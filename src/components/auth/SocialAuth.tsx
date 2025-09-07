import React from 'react';
import AuthService from '../../services/authService';

// Social Auth Icons as SVG components
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#F25022" d="M1 1h10v10H1z"/>
    <path fill="#00A4EF" d="M13 1h10v10H13z"/>
    <path fill="#7FBA00" d="M1 13h10v10H1z"/>
    <path fill="#FFB900" d="M13 13h10v10H13z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

interface SocialAuthProps {
  onGoogleAuth?: () => void;
  onMicrosoftAuth?: () => void;
  onFacebookAuth?: () => void;
  isLoading?: boolean;
}

const SocialAuth: React.FC<SocialAuthProps> = ({
  onGoogleAuth,
  onMicrosoftAuth,
  onFacebookAuth,
  isLoading = false
}) => {
  const handleGoogleAuth = () => {
    if (onGoogleAuth) {
      onGoogleAuth();
    } else {
      AuthService.initiateGoogleAuth();
    }
  };

  const handleMicrosoftAuth = () => {
    if (onMicrosoftAuth) {
      onMicrosoftAuth();
    } else {
      AuthService.initiateMicrosoftAuth();
    }
  };

  const handleFacebookAuth = () => {
    if (onFacebookAuth) {
      onFacebookAuth();
    } else {
      AuthService.initiateFacebookAuth();
    }
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-slate-800 text-gray-400">Or continue with</span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center gap-4">
        <button 
          type="button"
          disabled={isLoading}
          className="w-12 h-12 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGoogleAuth}
        >
          <GoogleIcon />
        </button>
        
        <button 
          type="button"
          disabled={isLoading}
          className="w-12 h-12 flex items-center justify-center bg-[#0078d4] rounded-lg hover:bg-[#106ebe] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleMicrosoftAuth}
        >
          <MicrosoftIcon />
        </button>
        
        <button 
          type="button"
          disabled={isLoading}
          className="w-12 h-12 flex items-center justify-center bg-[#1877F2] rounded-lg hover:bg-[#166fe5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleFacebookAuth}
        >
          <FacebookIcon />
        </button>
      </div>
    </div>
  );
};

export default SocialAuth;