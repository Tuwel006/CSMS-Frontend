import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface PageLoaderProps {
  fullScreen?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ fullScreen = true }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-20 h-20">
        <div className={`absolute inset-0 rounded-full border-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`} />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-600 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin" style={{ animationDuration: '1s', animationDirection: 'reverse' }} />
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <div className="w-3 h-3 bg-cyan-600 rounded-full animate-pulse" />
        </div>
      </div>
      <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} animate-pulse`}>
        Loading...
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
};

export default PageLoader;
