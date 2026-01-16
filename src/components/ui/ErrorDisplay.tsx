import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message = 'Something went wrong', 
  onRetry
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-sm p-8`}>
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${isDark ? 'bg-red-900/20' : 'bg-red-100'} mb-4`}>
          <svg className={`w-8 h-8 ${isDark ? 'text-red-400' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
          Oops! Something went wrong
        </h3>
        <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isDark 
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                : 'bg-cyan-600 hover:bg-cyan-700 text-white'
            }`}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
