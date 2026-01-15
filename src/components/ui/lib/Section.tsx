import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { cn } from '../../../lib/utils';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  action?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  children,
  className,
  headerClassName,
  contentClassName,
  action
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className={cn('space-y-4', className)}>
      {(title || subtitle || action) && (
        <div className={cn(
          'flex items-center justify-between',
          headerClassName
        )}>
          <div>
            {title && (
              <h2 className={cn(
                'text-xl font-bold',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={cn(
                'text-sm mt-1',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={contentClassName}>
        {children}
      </div>
    </section>
  );
};

export default Section;