import React from 'react';
import { Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { Box, Stack } from '../../../components/ui/lib';

interface MatchHeaderProps {
  teams: any;
  meta: any;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onPreview: () => void;
}

const MatchHeader = React.memo(({ teams, meta, isCollapsed, onToggleCollapse, onPreview }: MatchHeaderProps) => {
  return (
    <Box p="xs" bg="card" border rounded="sm" shadow="sm" className='mb-1.5'>
      <Stack direction="row" align="center" justify="between" gap="xs">
        <Box p="xs" className="flex-1 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-blue-950 dark:via-blue-900 dark:to-indigo-950 border border-blue-300 dark:border-blue-700 rounded-xs shadow-sm">
          <Stack direction="col" align="center" gap="none">
            <span className="text-[8px] font-bold text-blue-700 dark:text-blue-300 tracking-wide">TEAM A</span>
            <h2 className="text-xs md:text-sm font-black text-blue-900 dark:text-blue-50 truncate max-w-full">{teams?.A?.short || teams?.A?.name}</h2>
          </Stack>
        </Box>

        <Stack direction="col" align="center" gap="none" className="px-1 shrink-0">
          <span className="text-xs md:text-sm font-black text-gray-400 dark:text-gray-600">VS</span>
          <Stack direction="row" align="center" gap="xs" className="px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full">
            <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
            <span>{meta?.status || 'LIVE'}</span>
          </Stack>
        </Stack>

        <Box p="xs" className="flex-1 bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100 dark:from-emerald-950 dark:via-green-900 dark:to-teal-950 border border-emerald-300 dark:border-emerald-700 rounded-xs shadow-sm">
          <Stack direction="col" align="center" gap="none">
            <span className="text-[8px] font-bold text-emerald-700 dark:text-emerald-300 tracking-wide">TEAM B</span>
            <h2 className="text-xs md:text-sm font-black text-emerald-900 dark:text-emerald-50 truncate max-w-full">{teams?.B?.short || teams?.B?.name}</h2>
          </Stack>
        </Box>
      </Stack>
      
      <div className="flex items-center justify-between mt-1 pt-1 border-t border-[var(--card-border)]">
        <button
          onClick={onToggleCollapse}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
          title={isCollapsed ? 'Show Header' : 'Hide Header'}
        >
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
        <span className="text-[8px] text-[var(--text-secondary)]">{meta?.format} Overs</span>
        <button
          onClick={onPreview}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
          title="Live Preview"
        >
          <Eye size={14} />
        </button>
      </div>
    </Box>
  );
});

export default MatchHeader;
