import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { cn } from '../../../lib/utils';

interface ScoreCardProps {
  teamA: {
    name: string;
    short: string;
    score: string;
    overs: string;
    logo?: string;
  };
  teamB: {
    name: string;
    short: string;
    score: string;
    overs: string;
    logo?: string;
  };
  status: string;
  matchType: string;
  venue?: string;
  className?: string;
  onClick?: () => void;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  teamA,
  teamB,
  status,
  matchType,
  venue,
  className,
  onClick
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'rounded-xs border transition-all duration-200 cursor-pointer hover:shadow-md text-xs',
        isDark 
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
          : 'bg-white border-gray-200 hover:bg-gray-50',
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className={cn(
        'px-2 py-1 border-b text-[10px] font-medium flex justify-between items-center',
        isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'
      )}>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded-xs text-[9px] font-semibold">
          {matchType}
        </span>
        <span className={cn(
          'text-[9px] font-medium',
          status.toLowerCase().includes('live') ? 'text-red-500' : 'text-gray-500'
        )}>
          {status}
        </span>
      </div>

      {/* Teams */}
      <div className="p-2 space-y-1.5">
        {[teamA, teamB].map((team, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              {team.logo ? (
                <img 
                  src={team.logo} 
                  alt={team.name}
                  className="w-4 h-4 rounded-xs object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-xs flex items-center justify-center text-[8px] font-bold flex-shrink-0">
                  {team.short.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <div className="font-semibold text-[11px] truncate">{team.short}</div>
                <div className="text-[9px] text-gray-500 truncate">{team.name}</div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-sm">{team.score}</div>
              <div className="text-[9px] text-gray-500">({team.overs})</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {venue && (
        <div className={cn(
          'px-2 py-1 border-t text-[9px] text-gray-500 truncate',
          isDark ? 'border-gray-700' : 'border-gray-200'
        )}>
          {venue}
        </div>
      )}
    </div>
  );
};

export default ScoreCard;