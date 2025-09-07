import { ReactNode } from 'react';
import PublicHeader from './PublicHeader';

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-800">
      <PublicHeader />
      <main>{children}</main>
    </div>
  );
};

export default PublicLayout;