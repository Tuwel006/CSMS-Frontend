import { ReactNode, forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  children,
  className,
  containerClassName,
  ...props
}, ref) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const variantClasses = {
    default: isDark 
      ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
      : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20',
    outlined: isDark
      ? 'bg-transparent border-2 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400'
      : 'bg-transparent border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500',
    filled: isDark
      ? 'bg-gray-700 border-0 text-white placeholder-gray-400 focus:bg-gray-600'
      : 'bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:bg-gray-200'
  };

  const baseClasses = 'w-full rounded-lg transition-all duration-200 focus:outline-none focus:ring-2';
  const errorClasses = error ? (isDark ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-red-500 focus:border-red-500 focus:ring-red-500/20') : '';

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label className={cn('block text-sm font-medium', isDark ? 'text-gray-200' : 'text-gray-700')}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className={cn('absolute left-3 top-1/2 transform -translate-y-1/2', isDark ? 'text-gray-400' : 'text-gray-500')}>
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={cn(
            baseClasses,
            sizeClasses[size],
            variantClasses[variant],
            errorClasses,
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className={cn('absolute right-3 top-1/2 transform -translate-y-1/2', isDark ? 'text-gray-400' : 'text-gray-500')}>
            {rightIcon}
          </div>
        )}
        
        {children && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {children}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {helperText && !error && (
        <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;