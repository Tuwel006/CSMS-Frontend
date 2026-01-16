import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  max, 
  label, 
  icon,
  size = 'sm'
}) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  const getColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const heights = {
    sm: 'h-1.5',
    md: 'h-2'
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          {icon}
          {label && <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>}
        </div>
        <span className="text-xs font-bold text-gray-900 dark:text-white">
          {current} / {max}
        </span>
      </div>
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-xs ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-xs transition-all ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
