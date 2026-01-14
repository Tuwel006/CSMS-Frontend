import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'success';
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  onClick,
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    primary: 'bg-cyan-600 dark:bg-cyan-700 border-cyan-600 dark:border-cyan-700 text-white',
    success: 'bg-emerald-600 dark:bg-emerald-700 border-emerald-600 dark:border-emerald-700 text-white'
  };

  return (
    <div
      className={`border rounded-xs shadow-sm ${variantClasses[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className={`px-2 sm:px-3 py-1 sm:py-1.5 font-semibold text-xs sm:text-sm border-b border-gray-200 dark:border-gray-700 ${headerClassName}`}>
          {title}
        </div>
      )}
      <div className={bodyClassName}>
        {children}
      </div>
    </div>
  );
};

export default Card;
