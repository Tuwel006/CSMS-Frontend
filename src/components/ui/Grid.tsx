import { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface GridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Grid = ({ children, cols = 2, gap = 'md', className }: GridProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6'
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };

  return (
    <div className={cn(
      'grid',
      colsClasses[cols],
      gapClasses[gap],
      'p-6 rounded-lg',
      isDark ? 'bg-gray-900' : 'bg-gray-50',
      className
    )}>
      {children}
    </div>
  );
};

export default Grid;