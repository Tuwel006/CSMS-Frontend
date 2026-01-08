import React, { useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface RecentOversCardProps {
  currentInnings: any;
  teams: any;
  onSelectBowler: (action: string) => void;
  fetchBowlingTeam: () => void;
  onOverComplete: () => void;
}

const RecentOversCard = React.memo(({ currentInnings, teams, onSelectBowler, fetchBowlingTeam, onOverComplete }: RecentOversCardProps) => {
  const currentOver = currentInnings?.currentOver;
  const bowling = currentInnings?.bowling || [];
  const currentBowler = bowling.find((b: any) => b.id === currentOver?.bowlerId);
  const bowlingTeam = teams?.[currentInnings?.bowlingTeam];
  const isOverComplete = currentOver?.balls?.length === 6;
  const bowlersWithOvers = bowling.filter((b: any) => parseFloat(b.o) > 0);
  
  const handleBowlerClick = useCallback(() => {
    fetchBowlingTeam();
    onSelectBowler('OPEN_MODAL');
  }, [fetchBowlingTeam, onSelectBowler]);
  
  const getBallColor = (ball: string) => {
    const colors: any = { '0': 'bg-gray-500', '1': 'bg-green-500', '2': 'bg-green-600', '3': 'bg-green-700', '4': 'bg-blue-500', '6': 'bg-yellow-500', 'W': 'bg-red-500', 'WD': 'bg-pink-500', 'NB': 'bg-purple-500' };
    return colors[ball] || 'bg-gray-400';
  };
  
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-[var(--text)]">Recent Overs</h3>
        <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded font-medium">
          {currentInnings?.bowlingTeam ? 
            (teams?.[currentInnings.bowlingTeam]?.short || teams?.[currentInnings.bowlingTeam]?.name || currentInnings.bowlingTeam) 
            : 'Team'} Bowling
        </span>
      </div>
      
      <div className="mb-2 relative">
        {currentBowler && !isOverComplete ? (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-0.5">BOWLING NOW</p>
                <p className="font-bold text-xs text-[var(--text)]">{currentBowler.n}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[var(--text)]">{currentBowler.o}-{currentBowler.m || 0}-{currentBowler.r}-{currentBowler.w}</p>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">ER: {currentBowler.eco}</p>
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleBowlerClick}
            variant="outline"
            size="sm"
            className="w-full border-dashed border-orange-400 dark:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400 h-auto py-2"
            rightIcon={<ChevronDown size={14} />}
          >
            <div className="text-left">
              <p className="text-[10px]">{isOverComplete ? 'Over Complete' : 'Select Bowler'}</p>
              <p className="font-bold text-xs">{isOverComplete ? 'Choose next bowler' : `Choose from ${bowlingTeam?.name}`}</p>
            </div>
          </Button>
        )}
      </div>
      
      {bowlersWithOvers.length > 0 && (
        <div className="mb-2">
          <p className="text-[10px] text-[var(--text-secondary)] mb-1">BOWLERS</p>
          <div className="space-y-1 max-h-[4.5rem] overflow-y-auto">
            {bowlersWithOvers.map((bowler: any) => (
              <div key={bowler.id} className="bg-gray-50 dark:bg-gray-800 rounded p-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--text)] truncate">{bowler.n}</span>
                <span className="text-xs text-[var(--text-secondary)]">{bowler.o}-{bowler.m || 0}-{bowler.r}-{bowler.w}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] text-[var(--text-secondary)]">Current Over {currentOver?.o || 1}</p>
          {isOverComplete && (
            <Button
              onClick={onOverComplete}
              variant="primary"
              size="sm"
              className="text-[10px] px-2 py-0.5 bg-green-500 hover:bg-green-600"
            >
              Complete Over
            </Button>
          )}
        </div>
        <div className="flex gap-1.5">
          {(currentOver?.balls || []).map((ball: any, i: number) => (
            <div key={i} className={`${getBallColor(ball.r)} text-white w-7 h-7 rounded flex items-center justify-center text-xs font-bold`}>
              {ball.t === 'WICKET' ? 'W' : ball.t === 'WIDE' ? 'Wd' : ball.t === 'NO_BALL' ? 'Nb' : ball.r}
            </div>
          ))}
          {Array.from({ length: 6 - (currentOver?.balls?.length || 0) }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-200 dark:bg-gray-700 w-7 h-7 rounded flex items-center justify-center text-xs">
              •
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default RecentOversCard;
