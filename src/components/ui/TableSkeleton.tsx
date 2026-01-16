import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="animate-pulse">
      <div className={`${isDark ? 'bg-gray-750' : 'bg-gray-100'} px-4 py-2 mb-2`}>
        <div className={`h-4 w-24 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
      </div>
      
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex justify-between items-center px-4 py-2">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-8 h-8 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`} />
              <div className={`h-3 w-32 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
            </div>
            <div className="flex gap-4">
              <div className={`h-3 w-8 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
              <div className={`h-3 w-8 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
              <div className={`h-3 w-8 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
