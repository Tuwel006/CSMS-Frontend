import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { cn } from '../../../lib/utils';
import { LucideIcon } from 'lucide-react';

interface QuickActionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success';
}

const QuickAction: React.FC<QuickActionProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  className,
  variant = 'primary'
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const variantClasses = {
    primary: isDark 
      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
      : 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: isDark 
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
      : 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    success: isDark 
      ? 'bg-green-600 hover:bg-green-700 text-white' 
      : 'bg-green-500 hover:bg-green-600 text-white'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'p-3 rounded-xs transition-all duration-200 text-left w-full group',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-start space-x-2">
        <Icon className="w-4 h-4 mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" />
        <div className="min-w-0">
          <h3 className="font-semibold text-xs">{title}</h3>
          <p className="text-[10px] opacity-90 mt-0.5 line-clamp-2">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default QuickAction;