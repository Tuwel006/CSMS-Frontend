import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { cn } from '../../../lib/utils';
import { Stack } from './Stack';
import { Box } from './Box';
import Card from './Card';

interface Team {
  name: string;
  short: string;
  score: string;
  overs: string;
  logo?: string;
}

interface ScoreCardProps {
  teamA: Team;
  teamB: Team;
  status: string;
  matchType: string;
  venue?: string;
  result?: string;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'compact';
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  teamA,
  teamB,
  status,
  matchType,
  venue,
  result,
  className,
  onClick,
  variant = 'default'
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isCompact = variant === 'compact';

  const TeamRow = ({ team }: { team: Team }) => (
    <Stack direction="row" justify="between" align="center">
      <Stack direction="row" gap="sm" align="center" className="min-w-0 flex-1">
        {team.logo ? (
          <img 
            src={team.logo} 
            alt={team.name}
            className={cn('rounded-xs object-cover flex-shrink-0', isCompact ? 'w-3 h-3' : 'w-4 h-4')}
          />
        ) : (
          <Box 
            rounded="sm" 
            className={cn(
              'bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-bold flex-shrink-0',
              isCompact ? 'w-3 h-3 text-[7px]' : 'w-4 h-4 text-[8px]'
            )}
          >
            {team.short.charAt(0)}
          </Box>
        )}
        <Stack gap="none" className="min-w-0">
          <div className={cn('font-semibold truncate', isCompact ? 'text-[10px]' : 'text-[11px]')}>
            {team.short}
          </div>
          {!isCompact && (
            <div className="text-[9px] text-gray-500 truncate">{team.name}</div>
          )}
        </Stack>
      </Stack>
      <Stack gap="none" align="end" className="flex-shrink-0">
        <div className={cn('font-bold', isCompact ? 'text-xs' : 'text-sm')}>{team.score}</div>
        <div className={cn('text-gray-500', isCompact ? 'text-[8px]' : 'text-[9px]')}>({team.overs})</div>
      </Stack>
    </Stack>
  );

  return (
    <Card
      onClick={onClick}
      className={cn(
        'transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1',
        isDark 
          ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 shadow-lg shadow-gray-900/50' 
          : 'bg-gradient-to-br from-white via-cyan-50/50 to-blue-50/60 border-cyan-200/70 shadow-lg shadow-cyan-300/40',
        isCompact && 'w-64 flex-shrink-0',
        className
      )}
    >
      {/* Header */}
      <Box 
        p="sm" 
        className={cn(
          'border-b flex justify-between items-center',
          isDark ? 'border-gray-600 bg-gray-700/60' : 'border-cyan-200/50 bg-gradient-to-r from-cyan-50/60 to-blue-50/60'
        )}
      >
        <span className={cn(
          'px-1.5 py-0.5 rounded-xs text-[9px] font-semibold',
          isDark ? 'bg-cyan-800/70 text-cyan-200 border border-cyan-600/50' : 'bg-cyan-600 text-white shadow-sm'
        )}>
          {matchType}
        </span>
        <span className={cn(
          'text-[9px] font-medium',
          status.toLowerCase().includes('live') ? 'text-red-500' : 'text-gray-500'
        )}>
          {status}
        </span>
      </Box>

      {/* Teams */}
      <Box p={isCompact ? 'sm' : 'sm'}>
        <Stack gap={isCompact ? 'sm' : 'xs'}>
          <TeamRow team={teamA} />
          <TeamRow team={teamB} />
        </Stack>
      </Box>

      {/* Footer */}
      {(venue || result) && !isCompact && (
        <Box 
          p="sm" 
          className={cn(
            'border-t text-[9px] truncate',
            isDark ? 'border-gray-600 bg-gray-700/60' : 'border-cyan-200/50 bg-gradient-to-r from-cyan-50/60 to-blue-50/60'
          )}
        >
          {result ? (
            <div className="font-medium text-gray-700 dark:text-gray-300">{result}</div>
          ) : (
            <div className="text-gray-500">{venue}</div>
          )}
        </Box>
      )}
    </Card>
  );
};

export default ScoreCard;