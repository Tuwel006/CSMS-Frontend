import { LucideIcon } from 'lucide-react';
import Card from './Card';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => {
  return (
    <Card className="p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="text-gray-400" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
    </Card>
  );
};

export default EmptyState;
