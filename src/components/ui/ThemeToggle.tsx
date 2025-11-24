import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2 rounded-lg transition-all duration-200',
        isDark 
          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
          : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
      )}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default ThemeToggle;
