import { ReactNode, forwardRef, useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface InputProps {
  type?: string;
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  containerClassName?: string;
  className?: string;
  placeholder?: string;
  value?: any;
  onChange?: (value: any) => void;
  required?: boolean;
  options?: { value: any; label: string }[];
  suggestions?: string[];
  onSearch?: (query: string) => void;
  rows?: number;
  [key: string]: any;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, InputProps>(({
  type = 'text',
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
  placeholder,
  value,
  onChange,
  required,
  options,
  suggestions,
  onSearch,
  rows = 3,
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
  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '';

  const inputClasses = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    errorClasses,
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    className
  );

  const handleChange = (e: any) => {
    onChange?.(e.target.value);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions || [];

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);
    onChange?.(newQuery);
    onSearch?.(newQuery);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    onChange?.(suggestion);
    setIsOpen(false);
  };

  const renderInput = () => {
    if (type === 'search') {
      return (
        <div ref={dropdownRef} className="relative">
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type="text"
            value={query}
            onChange={handleSearchChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={inputClasses}
            required={required}
            {...props}
          />
          {isOpen && (filteredSuggestions.length > 0 || query.length > 0) && (
            <div className={cn(
              'absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-lg border shadow-lg',
              isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
            )}>
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={cn(
                      'w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    {suggestion}
                  </button>
                ))
              ) : (
                <div className={cn('px-3 py-2 text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
                  Searching...
                </div>
              )}
            </div>
          )}

        </div>
      );
    }

    if (type === 'select') {
      return (
        <select
          ref={ref as React.Ref<HTMLSelectElement>}
          value={value || ''}
          onChange={handleChange}
          className={inputClasses}
          required={required}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options?.map((option) => (
            <option key={option.value} value={option.value} className={isDark ? 'bg-gray-800' : 'bg-white'}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          className={inputClasses}
          required={required}
          rows={rows}
          {...props}
        />
      );
    }

    return (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type={type}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClasses}
        required={required}
        {...props}
      />
    );
  };

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label className={cn('block text-sm font-medium', isDark ? 'text-gray-200' : 'text-gray-700')}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && !['select', 'textarea'].includes(type) && (
          <div className={cn('absolute left-3 top-1/2 transform -translate-y-1/2 z-10', isDark ? 'text-gray-400' : 'text-gray-500')}>
            {leftIcon}
          </div>
        )}
        
        {renderInput()}
        
        {rightIcon && !['select', 'textarea'].includes(type) && (
          <div className={cn('absolute right-3 top-1/2 transform -translate-y-1/2 z-10', isDark ? 'text-gray-400' : 'text-gray-500')}>
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