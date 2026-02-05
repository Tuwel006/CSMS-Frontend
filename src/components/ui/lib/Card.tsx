import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'success';
  p?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  onClick,
  variant = 'default',
  p = 'none'
}) => {
  const paddings = {
    none: 'p-0',
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const variantClasses = {
    default: 'bg-[var(--card-bg)] border-[var(--card-border)]',
    primary: 'bg-cyan-600 dark:bg-cyan-700 border-cyan-600 dark:border-cyan-700 text-white',
    success: 'bg-emerald-600 dark:bg-emerald-700 border-emerald-600 dark:border-emerald-700 text-white'
  };

  return (
    <div
      className={`border rounded-xs shadow-sm ${variantClasses[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className={`px-2 sm:px-3 py-1 sm:py-1.5 font-semibold text-xs sm:text-sm border-b border-[var(--card-border)] ${headerClassName}`}>
          {title}
        </div>
      )}
      <div className={`${paddings[p]} ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
