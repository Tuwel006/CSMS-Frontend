import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Toggle from '../../../components/ui/Toggle';

interface BallOutcomesProps {
  onBallUpdate: (ballType: string, runs?: string) => void;
  extrasEnabled: boolean;
  onToggleExtras: () => void;
}

const BallOutcomes = React.memo(({ onBallUpdate, extrasEnabled, onToggleExtras }: BallOutcomesProps) => {
  const [nbRuns, setNbRuns] = useState('0');

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-[var(--text)]">Ball Outcomes</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--text-secondary)]">Extra Runs</span>
          <Toggle checked={extrasEnabled} onChange={onToggleExtras} />
        </div>
      </div>
      
      <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 mb-3">
        {['0', '1', '2', '3', '4', '5', '6'].map((ball) => (
          <Button
            key={ball}
            onClick={() => onBallUpdate(ball)}
            variant="outline"
            size="sm"
            className="h-9 font-bold bg-[var(--card-bg)] shadow-sm hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-sm transition-all"
          >
            {ball}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
        <Button
          onClick={() => onBallUpdate('WD')}
          variant="outline"
          size="sm"
          className="h-9 border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20 hover:border-orange-500 text-orange-800 dark:text-orange-200 font-bold"
        >
          WD
        </Button>
        
        <button
          onClick={() => onBallUpdate('NB', nbRuns)}
          className="h-9 rounded border-2 border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20 hover:border-orange-500 text-orange-800 dark:text-orange-200 font-bold text-xs transition-all flex items-center justify-between px-2 overflow-hidden"
        >
          <span className="flex-1 text-left">NB</span>
          <select
            value={nbRuns}
            onChange={(e) => {
              e.stopPropagation();
              setNbRuns(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-full w-12 text-xs bg-transparent border-l border-orange-400 dark:border-orange-500 text-orange-800 dark:text-orange-200 font-bold focus:outline-none cursor-pointer pl-1"
          >
            {['0', '1', '2', '3', '4', '5', '6'].map((r) => (
              <option key={r} value={r} className="bg-orange-50 dark:bg-gray-800">{r}</option>
            ))}
          </select>
        </button>
        
        <Button
          onClick={() => onBallUpdate('BYE')}
          variant="outline"
          size="sm"
          className="h-9 border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20 hover:border-orange-500 text-orange-800 dark:text-orange-200 font-bold"
        >
          BYE
        </Button>
        
        <Button
          onClick={() => onBallUpdate('LB')}
          variant="outline"
          size="sm"
          className="h-9 border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20 hover:border-orange-500 text-orange-800 dark:text-orange-200 font-bold"
        >
          LB
        </Button>
      </div>
      
      <Button
        onClick={() => onBallUpdate('W')}
        variant="danger"
        size="md"
        className="w-full h-10 font-bold"
      >
        WICKET
      </Button>
    </div>
  );
});

export default BallOutcomes;
