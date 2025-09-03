interface ScoreButtonProps {
  value: string | number;
  isSelected?: boolean;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const ScoreButton = ({ 
  value, 
  isSelected = false, 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false
}: ScoreButtonProps) => {
  const getVariantClasses = () => {
    const base = 'transition-all duration-200 font-semibold rounded-xl border-2 shadow-sm';
    
    if (disabled) {
      return `${base} bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed`;
    }
    
    switch (variant) {
      case 'primary':
        return isSelected 
          ? `${base} bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500 text-white shadow-lg transform scale-105` 
          : `${base} bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-md`;
      case 'secondary':
        return isSelected 
          ? `${base} bg-gradient-to-br from-gray-500 to-gray-600 border-gray-500 text-white shadow-lg transform scale-105` 
          : `${base} bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md`;
      case 'danger':
        return isSelected 
          ? `${base} bg-gradient-to-br from-red-500 to-red-600 border-red-500 text-white shadow-lg transform scale-105` 
          : `${base} bg-white dark:bg-gray-800 border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-md`;
      case 'success':
        return isSelected 
          ? `${base} bg-gradient-to-br from-green-500 to-green-600 border-green-500 text-white shadow-lg transform scale-105` 
          : `${base} bg-white dark:bg-gray-800 border-green-300 dark:border-green-600 text-green-600 dark:text-green-400 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 hover:shadow-md`;
      default:
        return base;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm min-w-[40px]';
      case 'lg':
        return 'px-6 py-3 text-lg min-w-[60px]';
      default:
        return 'px-4 py-2 text-base min-w-[50px]';
    }
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${getVariantClasses()} ${getSizeClasses()} flex items-center justify-center`}
    >
      {value}
    </button>
  );
};

export default ScoreButton;