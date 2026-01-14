import { ReactNode } from 'react';
import { Box } from './Box';
import { Stack } from './Stack';

interface SectionProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  noPadding?: boolean;
}

export const Section = ({ title, subtitle, action, children, noPadding = false }: SectionProps) => {
  return (
    <Box p={noPadding ? 'none' : 'md'} bg="card" border rounded="md" className="w-full">
      {(title || action) && (
        <Stack direction="row" justify="between" align="center" className="mb-4">
          <div>
            {title && <h2 className="text-lg md:text-xl font-semibold text-[var(--text)]">{title}</h2>}
            {subtitle && <p className="text-sm text-[var(--text-secondary)] mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </Stack>
      )}
      {children}
    </Box>
  );
};
