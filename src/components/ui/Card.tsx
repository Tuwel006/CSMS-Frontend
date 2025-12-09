import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'outlined' | 'elevated' | 'gradient';
  hover?: boolean;
  onClick?: () => void;
}

const Card = ({ 
  children, 
  className, 
  size = 'md', 
  variant = 'default', 
  hover = false,
  onClick 
}: CardProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const variantClasses = {
    default: isDark 
      ? 'bg-gray-800 border border-gray-700' 
      : 'bg-white border border-gray-200',
    outlined: isDark
      ? 'bg-transparent border-2 border-gray-600'
      : 'bg-transparent border-2 border-gray-300',
    elevated: isDark
      ? 'bg-gray-800 shadow-lg border-0'
      : 'bg-white shadow-lg border-0',
    gradient: isDark
      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
      : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer' : '';

  return (
    <div 
      className={cn(
        'rounded-lg',
        sizeClasses[size],
        variantClasses[variant],
        hoverClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;