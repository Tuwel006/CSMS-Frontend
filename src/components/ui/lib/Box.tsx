import { ReactNode, HTMLAttributes } from 'react';

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  p?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  m?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  bg?: 'card' | 'hover' | 'transparent';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

export const Box = ({ 
  p = 'none',
  m = 'none',
  bg = 'transparent',
  rounded = 'none',
  border = false,
  shadow = 'none',
  className = '',
  children='',
  ...props 
}: BoxProps) => {
  const paddings = {
    none: 'p-0',
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const margins = {
    none: 'm-0',
    xs: 'm-1',
    sm: 'm-2',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8'
  };

  const backgrounds = {
    card: 'bg-[var(--card-bg)]',
    hover: 'bg-[var(--hover-bg)]',
    transparent: 'bg-transparent'
  };

  const roundeds = {
    none: 'rounded-none',
    sm: 'rounded-xs',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full'
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <div 
      className={`${paddings[p]} ${margins[m]} ${backgrounds[bg]} ${roundeds[rounded]} ${border ? 'border border-[var(--card-border)]' : ''} ${shadows[shadow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
