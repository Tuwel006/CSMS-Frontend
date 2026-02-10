import React, { useCallback } from 'react';
import { Star, ChevronDown } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Box, Stack } from '../../../components/ui/lib';

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
  const striker = batting.striker;
  const nonStriker = batting.nonStriker;

  const handleBatsmanClick = useCallback(() => {
    fetchAvailableBatsmen();
    onSelectBatsman('OPEN_MODAL');
  }, [fetchAvailableBatsmen, onSelectBatsman]);

  return (
    <Box p="sm" bg="card" border rounded="sm" className="!p-1.5 sm:!p-2.5">
      <Stack direction="row" align="center" justify="between" className="mb-1.5 sm:mb-2">
        <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-wide">Batting</h3>
        <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded font-medium">
          {currentInnings?.battingTeam ?
            (teams?.[currentInnings.battingTeam]?.short || teams?.[currentInnings.battingTeam]?.name || currentInnings.battingTeam)
            : 'Team'}
        </span>
      </Stack>
      <div className="text-center py-2 relative">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="flex space-x-2">
              <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDuration: '0.8s' }}></div>
              <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.15s' }}></div>
              <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.3s' }}></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center justify-center min-h-[70px]">
              <div className={`text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400 drop-shadow-sm transition-all duration-300 ${scoreUpdating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>
                {score.r}/{score.w}
              </div>
              <div className="h-4 flex items-center justify-center mt-1">
                {scoreUpdating && (
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }}></div>
                    <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.1s' }}></div>
                    <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.2s' }}></div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-[10px] font-bold text-[var(--text-secondary)] mt-1 px-3 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
              Overs: {Math.floor(score.b / 6)}.{score.b % 6}
            </div>
          </div>
        )}
      </div>

      <Stack direction="col" gap="xs" className="mt-1.5">
        <p className="text-[8px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Now Batting</p>

        {striker ? (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xs p-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star size={10} className="text-green-600 dark:text-green-400 fill-current" />
                <span className="text-[10px] font-bold text-[var(--text)]">{striker.n}</span>
              </div>
              <span className="text-[10px] font-bold text-[var(--text)]">
                {striker.r}({striker.b})
              </span>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleBatsmanClick}
            variant="outline"
            size="sm"
            className="w-full border-dashed border-green-400 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] h-8"
            rightIcon={<ChevronDown size={10} />}
          >
            Select Striker
          </Button>
        )}

        {nonStriker ? (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xs p-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[var(--text)]">{nonStriker.n}</span>
              <span className="text-[10px] font-bold text-[var(--text)]">
                {nonStriker.r}({nonStriker.b})
              </span>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleBatsmanClick}
            variant="outline"
            size="sm"
            className="w-full border-dashed border-gray-400 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/20 text-gray-600 dark:text-gray-400 text-[10px] h-8"
            rightIcon={<ChevronDown size={10} />}
          >
            Select Non-Striker
          </Button>
        )}
      </Stack>
    </Box>
  );
});

export default CurrentScoreCard;
