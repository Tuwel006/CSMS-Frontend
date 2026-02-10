import React, { useState } from 'react';
import Toggle from '../../../components/ui/Toggle';
import { Box, Stack } from '../../../components/ui/lib';

interface BallOutcomesProps {
  onBallUpdate: (ballType: string, runs?: string) => void;
  extrasEnabled: boolean;
  onToggleExtras: () => void;
  disabled?: boolean;
}

const BallOutcomes = React.memo(({ onBallUpdate, extrasEnabled, onToggleExtras, disabled }: BallOutcomesProps) => {
  const [nbRuns, setNbRuns] = useState('0');

  const btnClass = (gradient: string, border: string, text: string, shadow: string) => `
    relative overflow-hidden h-9 sm:h-10 rounded-lg border font-black text-xs sm:text-sm transition-all
    flex items-center justify-center tracking-tighter
    ${disabled ? 'opacity-30 cursor-not-allowed grayscale' : 'active:translate-y-[2px] active:shadow-none hover:brightness-110 active:brightness-90'}
    ${gradient} ${border} ${text} ${shadow}
    before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/20 before:to-transparent
    after:absolute after:top-0 after:left-0 after:right-0 after:h-[40%] after:bg-white/20 after:rounded-t-lg
  `;

  return (
    <Box p="sm" bg="card" border rounded="lg" className="mb-2 sm:mb-4 shadow-xl border-t-4 border-t-blue-500/50 bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-secondary)] relative overflow-hidden">
      <Stack direction="row" justify="between" align="center" className="mb-2 sm:mb-4 px-1">
        <h3 className="text-[10px] sm:text-xs font-black text-[var(--text)] uppercase tracking-widest flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-blue-500"></span>
          </span>
          Live Controls
        </h3>
        <Stack direction="row" align="center" gap="sm" className="bg-black/5 dark:bg-white/5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[var(--card-border)]">
          <span className="text-[9px] sm:text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-tight">Extras</span>
          <Toggle size="sm" checked={extrasEnabled} onChange={onToggleExtras} disabled={disabled} />
        </Stack>
      </Stack>

      {/* Row 1: Digit Buttons */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3">
        {['0', '1', '2', '3', '4', '5', '6'].map((run) => (
          <button
            key={run}
            disabled={disabled}
            onClick={() => onBallUpdate(run)}
            className={btnClass(
              run === '4' || run === '6'
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-700'
                : 'bg-gradient-to-br from-blue-500 to-blue-700',
              run === '4' || run === '6' ? 'border-emerald-400' : 'border-blue-400',
              'text-white',
              run === '4' || run === '6' ? 'shadow-[0_2px_0_0_rgba(16,185,129,0.5)] sm:shadow-[0_3px_0_0_rgba(16,185,129,0.5)]' : 'shadow-[0_2px_0_0_rgba(59,130,246,0.5)] sm:shadow-[0_3px_0_0_rgba(59,130,246,0.5)]'
            )}
          >
            <span className="relative z-10 drop-shadow-md">{run}</span>
          </button>
        ))}
      </div>

      {/* Row 2: Extras */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-2 sm:mb-3">
        <button
          disabled={disabled}
          onClick={() => onBallUpdate('WD')}
          className={btnClass('bg-gradient-to-br from-amber-500 to-amber-700', 'border-amber-400', 'text-white', 'shadow-[0_2px_0_0_rgba(245,158,11,0.5)] sm:shadow-[0_3px_0_0_rgba(245,158,11,0.5)]')}
        >
          <span className="relative z-10 text-[10px] sm:text-[11px] drop-shadow-md">WD</span>
        </button>

        <div className={`relative ${btnClass('bg-gradient-to-br from-amber-500 to-amber-700', 'border-amber-400', 'text-white', 'shadow-[0_2px_0_0_rgba(245,158,11,0.5)] sm:shadow-[0_3px_0_0_rgba(245,158,11,0.5)]')} !p-0`}>
          <button
            disabled={disabled}
            onClick={() => onBallUpdate('NB', nbRuns)}
            className="flex-1 h-full flex items-center justify-center pl-1 sm:pl-2 font-black text-[10px] sm:text-[11px] z-10 drop-shadow-md"
          >
            NB
          </button>
          <select
            disabled={disabled}
            value={nbRuns}
            onChange={(e) => {
              e.stopPropagation();
              setNbRuns(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-full w-8 sm:w-10 bg-black/20 border-l border-white/20 text-white font-black focus:outline-none cursor-pointer text-center appearance-none rounded-r-lg text-[10px] sm:text-[11px] z-10"
          >
            {['0', '1', '2', '3', '4', '5', '6'].map((r) => (
              <option key={r} value={r} className="bg-gray-800 text-white">{r}</option>
            ))}
          </select>
        </div>

        <button
          disabled={disabled}
          onClick={() => onBallUpdate('BYE')}
          className={btnClass('bg-gradient-to-br from-indigo-500 to-indigo-700', 'border-indigo-400', 'text-white', 'shadow-[0_2px_0_0_rgba(99,102,241,0.5)] sm:shadow-[0_3px_0_0_rgba(99,102,241,0.5)]')}
        >
          <span className="relative z-10 text-[10px] sm:text-[11px] drop-shadow-md">BYE</span>
        </button>

        <button
          disabled={disabled}
          onClick={() => onBallUpdate('LB')}
          className={btnClass('bg-gradient-to-br from-indigo-500 to-indigo-700', 'border-indigo-400', 'text-white', 'shadow-[0_2px_0_0_rgba(99,102,241,0.5)] sm:shadow-[0_3px_0_0_rgba(99,102,241,0.5)]')}
        >
          <span className="relative z-10 text-[10px] sm:text-[11px] drop-shadow-md">LB</span>
        </button>
      </div>

      {/* Row 3: Wicket */}
      <button
        disabled={disabled}
        onClick={() => onBallUpdate('W')}
        className={btnClass('w-full h-10 sm:h-11 bg-gradient-to-br from-rose-500 to-rose-700', 'border-rose-400', 'text-white', 'shadow-[0_2px_0_0_rgba(244,63,94,0.5)] sm:shadow-[0_3px_0_0_rgba(244,63,94,0.5)]')}
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse"></div>
          <span className="uppercase tracking-[0.2em] sm:tracking-[0.25em] font-black text-[10px] sm:text-xs relative z-10 drop-shadow-md">WICKET</span>
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse"></div>
        </div>
      </button>
    </Box>
  );
});

export default BallOutcomes;
