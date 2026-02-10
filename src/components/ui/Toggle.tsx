import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(({
  checked,
  onChange,
  size = 'md',
  className,
  disabled
}, ref) => {
  const sizes = {
    sm: { container: 'h-4 w-7', thumb: 'h-3 w-3', translate: 'translate-x-3.5' },
    md: { container: 'h-5 w-9', thumb: 'h-3.5 w-3.5', translate: 'translate-x-5' },
    lg: { container: 'h-6 w-11', thumb: 'h-4.5 w-4.5', translate: 'translate-x-6' }
  };

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={onChange}
      className={cn(
        'relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        sizes[size].container,
        checked ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600',
        disabled && 'opacity-50 cursor-not-allowed grayscale',
        className
      )}
    >
      <span
        className={cn(
          'inline-block transform rounded-full bg-white transition-transform',
          sizes[size].thumb,
          checked ? sizes[size].translate : 'translate-x-0.5'
        )}
      />
    </button>
  );
});

Toggle.displayName = 'Toggle';

export default Toggle;
