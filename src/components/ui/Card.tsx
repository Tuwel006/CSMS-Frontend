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
    default: 'bg-[var(--card-bg)] border border-[var(--card-border)] shadow-md',
    outlined: 'bg-transparent border-2 border-[var(--card-border)] shadow-sm',
    elevated: 'bg-[var(--card-bg)] shadow-lg border border-[var(--card-border)]',
    gradient: 'bg-[var(--card-bg)] border border-[var(--card-border)] shadow-md'
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