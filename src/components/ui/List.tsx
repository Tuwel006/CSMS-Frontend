import { ReactNode } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import Grid from './Grid';

interface ListItem {
  id: string | number;
  title: string;
  subtitle?: string;
  content?: ReactNode;
  [key: string]: any;
}

interface ListProps {
  items: ListItem[];
  showEdit?: boolean;
  showDelete?: boolean;
  onEdit?: (item: ListItem) => void;
  onDelete?: (item: ListItem) => void;
  onClick?: (item: ListItem) => void;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
}

const List = ({
  items,
  showEdit = false,
  showDelete = false,
  onEdit,
  onDelete,
  onClick,
  className,
  cols = 1,
  gap = 'md'
}: ListProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const renderItem = (item: ListItem) => (
    <div
      key={item.id}
      className={cn(
        'p-4 rounded-lg border transition-all duration-200',
        isDark 
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
          : 'bg-white border-gray-200 hover:bg-gray-50',
        onClick && 'cursor-pointer hover:shadow-md',
        'group'
      )}
      onClick={() => onClick?.(item)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className={cn('font-medium truncate', isDark ? 'text-white' : 'text-gray-900')}>
            {item.title}
          </h3>
          {item.subtitle && (
            <p className={cn('text-sm mt-1 truncate', isDark ? 'text-gray-400' : 'text-gray-600')}>
              {item.subtitle}
            </p>
          )}
          {item.content && (
            <div className="mt-2">
              {item.content}
            </div>
          )}
        </div>

        {(showEdit || showDelete) && (
          <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {showEdit && onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  isDark 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-blue-400'
                    : 'hover:bg-blue-100 text-gray-500 hover:text-blue-600'
                )}
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {showDelete && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item);
                }}
                className={cn(
                  'p-1.5 rounded-lg transition-colors',
                  isDark 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400'
                    : 'hover:bg-red-100 text-gray-500 hover:text-red-600'
                )}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (items.length === 0) {
    return (
      <div className={cn('text-center py-8', isDark ? 'text-gray-400' : 'text-gray-500')}>
        <p>No items to display</p>
      </div>
    );
  }

  return (
    <Grid cols={cols} gap={gap} className={cn('p-0 bg-transparent border-0 shadow-none', className)}>
      {items.map(renderItem)}
    </Grid>
  );
};

export default List;