import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { cn } from '../../../lib/utils';

interface CompactScoreCardProps {
  teamA: { name: string; short: string; score: string; overs: string; };
  teamB: { name: string; short: string; score: string; overs: string; };
  status: string;
  matchType: string;
  onClick?: () => void;
}

const CompactScoreCard: React.FC<CompactScoreCardProps> = ({
  teamA, teamB, status, matchType, onClick
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'w-64 flex-shrink-0 rounded-xs border cursor-pointer transition-all duration-200 hover:shadow-md',
        isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className={cn('px-3 py-1.5 border-b flex justify-between items-center', isDark ? 'border-gray-700' : 'border-gray-200')}>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded-xs text-[9px] font-semibold">
          {matchType}
        </span>
        <span className={cn('text-[9px] font-medium', status.toLowerCase().includes('live') ? 'text-red-500' : 'text-gray-500')}>
          {status}
        </span>
      </div>

      {/* Teams */}
      <div className="p-3 space-y-2">
        {[teamA, teamB].map((team, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-xs flex items-center justify-center text-[7px] font-bold flex-shrink-0">
                {team.short.charAt(0)}
              </div>
              <span className="font-semibold text-[10px] truncate">{team.short}</span>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-xs">{team.score}</div>
              <div className="text-[8px] text-gray-500">({team.overs})</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompactScoreCard;