import { ReactNode, forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className,
  style,
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-5 py-2.5 text-lg',
    '2xl': 'px-6 py-3 text-xl',
  };

  const variantClasses = {
    primary: isDark
      ? 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 shadow-sm hover:shadow-md'
      : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 shadow-sm hover:shadow-md',
    secondary: isDark
      ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 shadow-sm'
      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md',
    outline: isDark
      ? 'bg-transparent hover:bg-gray-800/50 text-gray-300 border border-gray-600/50 hover:border-gray-500'
      : 'bg-transparent hover:bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300 shadow-sm',
    ghost: isDark
      ? 'hover:bg-gray-800/30 text-gray-300 border-0'
      : 'hover:bg-gray-100/50 text-gray-600 border-0',
    danger: isDark
      ? 'bg-red-600 hover:bg-red-700 text-white border border-red-600 shadow-sm hover:shadow-md'
      : 'bg-red-600 hover:bg-red-700 text-white border border-red-600 shadow-sm hover:shadow-md',
  };

  const baseClasses = 'inline-flex items-center justify-center rounded font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const buttonClasses = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    (disabled || loading) && 'opacity-50 cursor-not-allowed',
    className
  );

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      style={style}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && leftIcon && <span className="mr-1.5">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-1.5">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;