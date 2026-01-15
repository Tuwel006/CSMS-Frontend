import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { cn } from '../../../lib/utils';

interface FloatingThemeToggleProps {
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const FloatingThemeToggle: React.FC<FloatingThemeToggleProps> = ({
  className,
  position = 'top-right'
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'fixed z-50 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110',
        isDark 
          ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-gray-700' 
          : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200',
        positionClasses[position],
        className
      )}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default FloatingThemeToggle;