import React, { useState } from 'react';
import Toggle from '../../../components/ui/Toggle';
import { Box, Stack } from '../../../components/ui/lib';

interface BallOutcomesMobileProps {
  onBallUpdate: (ballType: string, runs?: string) => void;
  extrasEnabled: boolean;
  onToggleExtras: () => void;
}

const BallOutcomesMobile = React.memo(({ onBallUpdate, extrasEnabled, onToggleExtras }: BallOutcomesMobileProps) => {
  const [nbRuns, setNbRuns] = useState('0');

  const runButtons = ['0', '1', '2', '3', '4', '6'];
  const extraButtons = [
    { type: 'WD', label: 'WD', color: 'orange' },
    { type: 'NB', label: 'NB', color: 'orange', hasSelect: true },
    { type: 'BYE', label: 'B', color: 'purple' },
    { type: 'LB', label: 'LB', color: 'purple' }
  ];

  return (
    <Box p="sm" bg="card" border rounded="md">
      {/* Header with Toggle */}
      <Stack direction="row" justify="between" align="center" className="mb-3">
        <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-wide">BALL OUTCOMES</h3>
        <Stack direction="row" align="center" gap="xs">
          <span className="text-[9px] text-[var(--text-secondary)] uppercase">Extras</span>
          <Toggle checked={extrasEnabled} onChange={onToggleExtras} />
        </Stack>
      </Stack>
      
      {/* Runs Section */}
      <div className="mb-3">
        <p className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Runs</p>
        <div className="grid grid-cols-6 gap-1.5">
          {runButtons.map((run) => (
            <button
              key={run}
              onClick={() => onBallUpdate(run)}
              className={`h-12 rounded-lg font-bold text-base transition-all active:scale-95 ${
                run === '4' || run === '6'
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md'
              }`}
            >
              {run}
            </button>
          ))}
        </div>
      </div>
      
      {/* Extras Section */}
      <div className="mb-3">
        <p className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Extras</p>
        <div className="grid grid-cols-4 gap-1.5">
          {extraButtons.map((extra) => (
            extra.hasSelect ? (
              <button
                key={extra.type}
                onClick={() => onBallUpdate('NB', nbRuns)}
                className="h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-1 px-2"
              >
                <span>{extra.label}</span>
                <select
                  value={nbRuns}
                  onChange={(e) => {
                    e.stopPropagation();
                    setNbRuns(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="h-8 w-8 text-xs bg-white/20 border border-white/30 rounded text-white font-bold focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
                >
                  {['0', '1', '2', '3', '4', '6'].map((r) => (
                    <option key={r} value={r} className="bg-orange-600 text-white">{r}</option>
                  ))}
                </select>
              </button>
            ) : (
              <button
                key={extra.type}
                onClick={() => onBallUpdate(extra.type)}
                className={`h-12 rounded-lg font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 ${
                  extra.color === 'orange'
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                    : 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                }`}
              >
                {extra.label}
              </button>
            )
          ))}
        </div>
      </div>
      
      {/* Wicket Button */}
      <button
        onClick={() => onBallUpdate('W')}
        className="w-full h-14 rounded-lg bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-95 uppercase tracking-wider"
      >
        Wicket
      </button>
    </Box>
  );
});

export default BallOutcomesMobile;
