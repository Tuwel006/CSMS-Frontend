import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { cn } from '../../../lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  title,
  value,
  change,
  className
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const changeColors = {
    increase: 'text-green-500',
    decrease: 'text-red-500',
    neutral: 'text-gray-500'
  };

  return (
    <div className={cn(
      'p-3 rounded-xs border transition-all duration-200',
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className={cn(
            'text-[10px] font-medium truncate',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}>
            {title}
          </p>
          <p className={cn(
            'text-lg font-bold mt-0.5',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            {value}
          </p>
          {change && (
            <p className={cn('text-[9px] mt-0.5', changeColors[change.type])}>
              {change.value}
            </p>
          )}
        </div>
        <Icon className={cn(
          'w-5 h-5 flex-shrink-0',
          isDark ? 'text-gray-400' : 'text-gray-500'
        )} />
      </div>
    </div>
  );
};

export default StatsCard;