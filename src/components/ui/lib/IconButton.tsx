import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Tooltip } from './Tooltip';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  tooltip?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = ({ 
  icon, 
  tooltip, 
  variant = 'ghost', 
  size = 'md',
  className = '',
  ...props 
}: IconButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-[var(--text)]',
    ghost: 'hover:bg-gray-200 dark:hover:bg-white/10 text-[var(--text)]',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };
  
  const sizes = {
    sm: 'p-1.5 text-sm',
    md: 'p-2',
    lg: 'p-3'
  };

  const button = (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );

  return tooltip ? <Tooltip content={tooltip}>{button}</Tooltip> : button;
};
