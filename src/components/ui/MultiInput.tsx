import { ReactNode, forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'switch' | 'file';

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface MultiInputProps {
  type?: InputType;
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  options?: Option[];
  checked?: boolean;
  value?: string | number | string[];
  onChange?: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  rows?: number;
  className?: string;
  containerClassName?: string;
  name?: string;
}

const MultiInput = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, MultiInputProps>(({
  type = 'text',
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  options = [],
  checked,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  multiple,
  rows = 3,
  className,
  containerClassName,
  name,
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

  const renderInput = () => {
    const inputClasses = cn(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      errorClasses,
      leftIcon && 'pl-10' || '',
      rightIcon && 'pr-10' || '',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    );

    switch (type) {
      case 'textarea':
        return (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={inputClasses}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            rows={rows}
            value={value as string}
            onChange={(e) => onChange?.(e.target.value)}
            name={name}
            {...props}
          />
        );

      case 'select':
        return (
          <select
            ref={ref as React.Ref<HTMLSelectElement>}
            className={inputClasses}
            disabled={disabled}
            required={required}
            multiple={multiple}
            value={value}
            onChange={(e) => onChange?.(multiple ? Array.from(e.target.selectedOptions, option => option.value) : e.target.value)}
            name={name}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <label key={option.value} className={cn('flex items-center space-x-3 cursor-pointer', option.disabled && 'opacity-50 cursor-not-allowed')}>
                <input
                  type="radio"
                  className={cn('w-4 h-4 text-blue-600 focus:ring-blue-500', isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300')}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange?.(e.target.value)}
                  disabled={option.disabled || disabled}
                  required={required}
                  name={name}
                />
                <span className={cn('text-sm', isDark ? 'text-gray-200' : 'text-gray-700')}>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return options.length > 0 ? (
          <div className="space-y-2">
            {options.map((option) => (
              <label key={option.value} className={cn('flex items-center space-x-3 cursor-pointer', option.disabled && 'opacity-50 cursor-not-allowed')}>
                <input
                  type="checkbox"
                  className={cn('w-4 h-4 text-blue-600 rounded focus:ring-blue-500', isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300')}
                  value={option.value}
                  checked={Array.isArray(value) ? value.includes(option.value.toString()) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked 
                      ? [...currentValues, option.value.toString()]
                      : currentValues.filter(v => v !== option.value.toString());
                    onChange?.(newValues);
                  }}
                  disabled={option.disabled || disabled}
                  name={name}
                />
                <span className={cn('text-sm', isDark ? 'text-gray-200' : 'text-gray-700')}>{option.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className={cn('w-4 h-4 text-blue-600 rounded focus:ring-blue-500', isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300')}
              checked={checked}
              onChange={(e) => onChange?.(e.target.checked)}
              disabled={disabled}
              required={required}
              name={name}
            />
            <span className={cn('text-sm', isDark ? 'text-gray-200' : 'text-gray-700')}>{label}</span>
          </label>
        );

      case 'switch':
        return (
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={(e) => onChange?.(e.target.checked)}
                disabled={disabled}
                name={name}
              />
              <div className={cn(
                'block w-14 h-8 rounded-full transition-colors',
                checked 
                  ? 'bg-blue-600' 
                  : isDark ? 'bg-gray-600' : 'bg-gray-300',
                disabled && 'opacity-50 cursor-not-allowed'
              )}>
                <div className={cn(
                  'absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform',
                  checked && 'transform translate-x-6'
                )} />
              </div>
            </div>
            {label && <span className={cn('ml-3 text-sm', isDark ? 'text-gray-200' : 'text-gray-700')}>{label}</span>}
          </label>
        );

      default:
        return (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            className={inputClasses}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            value={value as string}
            onChange={(e) => onChange?.(e.target.value)}
            name={name}
            {...props}
          />
        );
    }
  };

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && !['checkbox', 'switch'].includes(type) && (
        <label className={cn('block text-sm font-medium', isDark ? 'text-gray-200' : 'text-gray-700')}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && !['radio', 'checkbox', 'switch'].includes(type) && (
          <div className={cn('absolute left-3 top-1/2 transform -translate-y-1/2 z-10', isDark ? 'text-gray-400' : 'text-gray-500')}>
            {leftIcon}
          </div>
        )}
        
        {renderInput()}
        
        {rightIcon && !['radio', 'checkbox', 'switch'].includes(type) && (
          <div className={cn('absolute right-3 top-1/2 transform -translate-y-1/2 z-10', isDark ? 'text-gray-400' : 'text-gray-500')}>
            {rightIcon}
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

MultiInput.displayName = 'MultiInput';

export default MultiInput;