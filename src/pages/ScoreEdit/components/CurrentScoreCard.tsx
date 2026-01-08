import React, { useCallback } from 'react';
import { Star, ChevronDown } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface CurrentScoreCardProps {
  currentInnings: any;
  teams: any;
  onSelectBatsman: (action: string) => void;
  loading: boolean;
  scoreUpdating: boolean;
  fetchAvailableBatsmen: () => void;
}

const CurrentScoreCard = React.memo(({ currentInnings, teams, onSelectBatsman, loading, scoreUpdating, fetchAvailableBatsmen }: CurrentScoreCardProps) => {
  const score = currentInnings?.score || { r: 0, w: 0, o: '0.0' };
  const batting = currentInnings?.batting || [];
  const battingTeam = teams?.[currentInnings?.battingTeam];
  const bowlingTeam = teams?.[currentInnings?.bowlingTeam];
  const striker = batting.striker;
  const nonStriker = batting.nonStriker;
  
  const handleBatsmanClick = useCallback(() => {
    fetchAvailableBatsmen();
    onSelectBatsman('OPEN_MODAL');
  }, [fetchAvailableBatsmen, onSelectBatsman]);
  
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-[var(--text)]">Current Score</h3>
        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded font-medium">
          {currentInnings?.battingTeam ? 
            (teams?.[currentInnings.battingTeam]?.short || teams?.[currentInnings.battingTeam]?.name || currentInnings.battingTeam) 
            : 'Team'} Batting
        </span>
      </div>
      <div className="text-center py-2 relative">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-lg font-medium text-[var(--text)] mb-1">
              {currentInnings?.battingTeam ? 
                (teams?.[currentInnings.battingTeam]?.short || teams?.[currentInnings.battingTeam]?.name || currentInnings.battingTeam) 
                : 'Team'}
            </div>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
              {score.r}/{score.w}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              Overs: {score.o}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              {battingTeam?.name} vs {bowlingTeam?.name}
            </div>
            {scoreUpdating && (
              <div className="absolute top-2 right-2 flex space-x-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="mt-2 space-y-1.5">
        <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">BATTING NOW</p>
        
        {striker ? (
          <div className="bg-green-50 dark:bg-green-900/20 rounded p-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Star size={12} className="text-green-600 dark:text-green-400 fill-current" />
                <span className="text-xs font-bold text-[var(--text)]">{striker.n}</span>
              </div>
              <span className="text-xs font-bold text-[var(--text)]">
                {striker.r}({striker.b}) SR: {striker.b > 0 ? ((striker.r / striker.b) * 100).toFixed(1) : '0.0'}
              </span>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleBatsmanClick}
            variant="outline"
            size="sm"
            className="w-full border-dashed border-green-400 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400"
            rightIcon={<ChevronDown size={12} />}
          >
            Select Striker
          </Button>
        )}
        
        {nonStriker ? (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text)]">{nonStriker.n}</span>
              <span className="text-xs font-bold text-[var(--text)]">
                {nonStriker.r}({nonStriker.b}) SR: {nonStriker.b > 0 ? ((nonStriker.r / nonStriker.b) * 100).toFixed(1) : '0.0'}
              </span>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleBatsmanClick}
            variant="outline"
            size="sm"
            className="w-full border-dashed border-gray-400 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/20 text-gray-600 dark:text-gray-400"
            rightIcon={<ChevronDown size={12} />}
          >
            Select Non-Striker
          </Button>
        )}
      </div>
    </div>
  );
});

export default CurrentScoreCard;
