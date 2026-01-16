import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ScoreCardSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-sm p-3 animate-pulse`}>
      <div className="flex justify-between items-center mb-3">
        <div className={`h-4 w-16 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
        <div className={`h-4 w-12 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
            <div className={`h-3 w-20 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
          </div>
          <div className={`h-4 w-16 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
            <div className={`h-3 w-20 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
          </div>
          <div className={`h-4 w-16 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
        </div>
      </div>
    </div>
  );
};

export default ScoreCardSkeleton;
