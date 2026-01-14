import React, { useState } from 'react';
import Toggle from '../../../components/ui/Toggle';
import { Box, Stack } from '../../../components/ui/lib';

interface BallOutcomesProps {
  onBallUpdate: (ballType: string, runs?: string) => void;
  extrasEnabled: boolean;
  onToggleExtras: () => void;
}

const BallOutcomes = React.memo(({ onBallUpdate, extrasEnabled, onToggleExtras }: BallOutcomesProps) => {
  const [nbRuns, setNbRuns] = useState('0');

  return (
    <Box p="sm" bg="card" border rounded="sm" className="mb-3">
      <Stack direction="row" justify="between" align="center" className="mb-2">
        <h3 className="text-xs font-semibold text-[var(--text)]">BALL OUTCOMES</h3>
        <Stack direction="row" align="center" gap="xs">
          <span className="text-[10px] text-[var(--text-secondary)]">Extras</span>
          <Toggle checked={extrasEnabled} onChange={onToggleExtras} />
        </Stack>
      </Stack>
      
      {/* Row 1: Digit Buttons */}
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {['0', '1', '2', '3', '4', '5', '6'].map((run) => (
          <button
            key={run}
            onClick={() => onBallUpdate(run)}
            className={`h-9 rounded-xs border-2 font-bold text-sm transition-all hover:scale-105 active:scale-95 ${
              run === '4' || run === '6'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
            }`}
          >
            {run}
          </button>
        ))}
      </div>
      
      {/* Row 2: Extras */}
      <div className="grid grid-cols-4 gap-1.5 mb-1.5">
        <button
          onClick={() => onBallUpdate('WD')}
          className="h-9 rounded-xs border-2 border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 font-bold text-xs hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all"
        >
          WD
        </button>
        
        <button
          onClick={() => onBallUpdate('NB', nbRuns)}
          className="h-9 rounded-xs border-2 border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 font-bold text-xs hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all flex items-center justify-between overflow-hidden"
        >
          <span className="flex-1 text-left pl-2">NB</span>
          <select
            value={nbRuns}
            onChange={(e) => {
              e.stopPropagation();
              setNbRuns(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-full w-10 text-xs bg-transparent border-l-2 border-orange-400 text-orange-700 dark:text-orange-300 font-bold focus:outline-none cursor-pointer text-center"
          >
            {['0', '1', '2', '3', '4', '5', '6'].map((r) => (
              <option key={r} value={r} className="bg-white dark:bg-gray-800">{r}</option>
            ))}
          </select>
        </button>
        
        <button
          onClick={() => onBallUpdate('BYE')}
          className="h-9 rounded-xs border-2 border-purple-400 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all"
        >
          BYE
        </button>
        
        <button
          onClick={() => onBallUpdate('LB')}
          className="h-9 rounded-xs border-2 border-purple-400 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all"
        >
          LB
        </button>
      </div>
      
      {/* Row 3: Wicket */}
      <button
        onClick={() => onBallUpdate('W')}
        className="w-full h-10 rounded-xs border-2 border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
      >
        WICKET
      </button>
    </Box>
  );
});

export default BallOutcomes;
