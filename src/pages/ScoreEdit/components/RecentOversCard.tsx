import React, { useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Box, Stack } from '../../../components/ui/lib';

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
  const isOverComplete = currentOver?.isOverComplete;
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
    <Box p="sm" bg="card" border rounded="sm">
      <Stack direction="row" align="center" justify="between" className="mb-2">
        <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-wide">Bowling</h3>
        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded font-medium">
          {currentInnings?.bowlingTeam ? 
            (teams?.[currentInnings.bowlingTeam]?.short || teams?.[currentInnings.bowlingTeam]?.name || currentInnings.bowlingTeam) 
            : 'Team'}
        </span>
      </Stack>
      
      <div className="mb-2">
        {currentBowler && !isOverComplete ? (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700 rounded-xs p-1.5">
            <Stack direction="row" justify="between" align="center">
              <div>
                <p className="text-[8px] text-gray-600 dark:text-gray-400 uppercase tracking-wide">Now Bowling</p>
                <p className="font-bold text-[10px] text-[var(--text)]">{currentBowler.n}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[var(--text)]">{currentBowler.o}-{currentBowler.r}-{currentBowler.w}</p>
                <p className="text-[8px] text-gray-600 dark:text-gray-400">ER: {currentBowler.eco}</p>
              </div>
            </Stack>
          </div>
        ) : (
          <Button
            onClick={handleBowlerClick}
            variant="outline"
            size="sm"
            className="w-full border-dashed border-emerald-400 dark:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] h-8"
            rightIcon={<ChevronDown size={10} />}
          >
            {isOverComplete ? 'Over Complete' : 'Select Bowler'}
          </Button>
        )}
      </div>
      
      <div>
        <Stack direction="row" justify="between" align="center" className="mb-1">
          <p className="text-[8px] text-[var(--text-secondary)] uppercase tracking-wide">Over {currentOver?.o || 1}</p>
          {isOverComplete && (
            <button
              onClick={onOverComplete}
              className="text-[8px] px-1.5 py-0.5 bg-green-500 hover:bg-green-600 text-white rounded-xs font-bold"
            >
              Complete
            </button>
          )}
        </Stack>
        <div className="flex gap-1">
          {(currentOver?.balls || []).map((ball: any, i: number) => (
            <div key={i} className={`${getBallColor(ball.r)} text-white w-6 h-6 rounded-xs flex items-center justify-center text-[10px] font-bold`}>
              {ball.t === 'WICKET' ? 'W' : ball.t === 'WIDE' ? 'Wd' : ball.t === 'NO_BALL' ? 'Nb' : ball.r}
            </div>
          ))}
          {Array.from({ length: 6 + currentOver.illegalBallsCount - (currentOver?.balls?.length || 0) }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-200 dark:bg-gray-700 w-7 h-7 rounded flex items-center justify-center text-xs">
              •
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
});

export default RecentOversCard;
