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
            className={cn(
              'rounded-xs object-cover flex-shrink-0 border transition-transform group-hover:scale-110',
              isCompact ? 'w-5 h-5' : 'w-6 h-6',
              isDark ? 'border-white/10' : 'border-slate-200'
            )}
          />
        ) : (
          <Box
            rounded="sm"
            className={cn(
              'flex items-center justify-center font-black flex-shrink-0 border uppercase tracking-tighter',
              isCompact ? 'w-5 h-5 text-[8px]' : 'w-6 h-6 text-[10px]',
              isDark
                ? 'bg-slate-800/50 border-white/10 text-cyan-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            )}
          >
            {team.short.slice(0, 2)}
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
        'transition-all duration-300 cursor-pointer hover:-translate-y-1 active:scale-[0.98] group overflow-hidden relative',
        isDark
          ? 'bg-[#05070a] border-[#1a1c1e] shadow-none'
          : 'bg-white border-slate-200 shadow-none',
        isCompact && 'w-64 flex-shrink-0',
        className
      )}
    >
      {/* Ultra-Thin Top status indicator */}
      <div className={cn(
        'absolute top-0 left-0 w-full h-[2px] z-20',
        status.toLowerCase().includes('live') ? 'bg-red-600' : 'bg-cyan-600'
      )} />

      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none',
        isDark ? 'bg-white' : 'bg-black'
      )} />

      {/* Header */}
      <Box
        p="sm"
        className={cn(
          'border-b flex justify-between items-center relative z-10',
          isDark ? 'border-[#1a1c1e] bg-[#0c0e10]' : 'border-slate-50 bg-slate-50/50'
        )}
      >
        <div className="flex items-center gap-2">
          <div className={cn('w-1 h-3 rounded-full', isDark ? 'bg-cyan-500' : 'bg-cyan-600')} />
          <span className={cn(
            'px-1.5 py-0.5 rounded-xs text-[8px] font-black uppercase tracking-widest',
            isDark ? 'text-cyan-400' : 'text-cyan-700'
          )}>
            {matchType}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {status.toLowerCase().includes('live') && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          )}
          <span className={cn(
            'text-[9px] font-black uppercase tracking-tighter transition-colors',
            status.toLowerCase().includes('live')
              ? 'text-red-500'
              : isDark ? 'text-slate-500' : 'text-slate-400'
          )}>
            {status}
          </span>
        </div>
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