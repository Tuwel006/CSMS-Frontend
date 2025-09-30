import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

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
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const variantClasses = {
    default: 'bg-white border border-gray-200',
    outlined: 'bg-transparent border-2 border-gray-300',
    elevated: 'bg-white shadow-lg border-0',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer' : '';

  return (
    <div 
      className={cn(
        'rounded-xl',
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