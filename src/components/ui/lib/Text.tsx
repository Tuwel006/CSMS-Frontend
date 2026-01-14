import { ReactNode, HTMLAttributes } from 'react';

interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  children: ReactNode;
}

export const Text = ({ 
  size,
  weight,
  className = '',
  children,
  ...props 
}: TextProps) => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <span 
      className={`${size ? sizes[size] : ''} ${weight ? weights[weight] : ''} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
