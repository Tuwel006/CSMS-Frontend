import { ReactNode, FormHTMLAttributes } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  layout?: 'single' | 'double' | 'triple' | 'auto';
  spacing?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card' | 'minimal';
  containerClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerSlot?: ReactNode;
  loading?: boolean;
  error?: string;
}

const Form = ({
  children,
  title,
  subtitle,
  layout = 'single',
  spacing = 'md',
  variant = 'default',
  containerClassName,
  headerClassName,
  contentClassName,
  footerSlot,
  loading,
  error,
  className,
  ...props
}: FormProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const layoutClasses = {
    single: 'grid-cols-1',
    double: 'grid-cols-1 md:grid-cols-2',
    triple: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  const spacingClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const variantClasses = {
    default: isDark 
      ? 'bg-gray-800 border border-gray-700 rounded-xl p-6' 
      : 'bg-white border border-gray-200 rounded-xl p-6 shadow-sm',
    card: isDark
      ? 'bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl'
      : 'bg-white border border-gray-200 rounded-2xl p-8 shadow-lg',
    minimal: 'bg-transparent border-0 p-0'
  };

  return (
    <div className={cn('w-full', containerClassName)}>
      <form 
        className={cn(
          'relative',
          variantClasses[variant],
          loading && 'pointer-events-none opacity-75',
          className
        )}
        {...props}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className={cn('mb-6', headerClassName)}>
            {title && (
              <h2 className={cn(
                'text-2xl font-bold mb-2',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className={cn(
          'grid',
          layoutClasses[layout],
          spacingClasses[spacing],
          contentClassName
        )}>
          {children}
        </div>

        {/* Footer Slot */}
        {footerSlot && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            {footerSlot}
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/10 rounded-xl flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                  Processing...
                </span>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Form;