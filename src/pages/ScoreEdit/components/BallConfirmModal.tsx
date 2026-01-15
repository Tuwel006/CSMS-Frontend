import React from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface BallConfirmModalProps {
  isOpen: boolean;
  ballType: string;
  ballRuns: string;
  isByeRun?: boolean;
  onRunsChange: (runs: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const BallConfirmModal = React.memo(({ isOpen, ballType, ballRuns, onRunsChange, onConfirm, onCancel, isByeRun = false }: BallConfirmModalProps) => {
  if (!isOpen) return null;

  const isNormalRun = ['0', '1', '2', '3', '4', '5', '6'].includes(ballType);
  const showInput = isByeRun || ( ballType === 'NB' && ballRuns === '0');

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md p-6 w-11/12 max-w-md shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4">Confirm Ball Outcome</h2>
        
        <div className="mb-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-md p-6 text-center shadow-md">
            <div className="text-4xl font-black mb-2">{ballType}</div>
            <div className="text-sm font-medium opacity-90">
              {isNormalRun ? `${ballType} Run${ballType !== '1' ? 's' : ''}` :
               ballType === 'WD' ? 'Wide' : 
               ballType === 'NB' ? `No Ball${ballRuns !== '0' ? ` + ${ballRuns}` : ''}` : 
               ballType === 'BYE' ? 'Bye' : 
               ballType === 'LB' ? 'Leg Bye' : ballType}
            </div>
          </div>
        </div>

        {showInput && (
          <div className="mb-4">
            <Input
              type="number"
              label={ballType === 'BYE' ? 'Bye Runs' : ballType === 'LB' ? 'Leg Bye Runs' : ballType === 'WD' ? 'Wide Runs' : 'Additional Bye Runs'}
              value={ballRuns}
              onChange={(value: any) => {
                const val = parseInt(value) || 0;
                onRunsChange(Math.max(0, Math.min(6, val)).toString());
              }}
              placeholder="Enter runs (0-6)"
              helperText={
                ballType === 'BYE' ? "Runs scored as bye"
                : ballType === 'LB' ? "Runs scored as leg bye"
                : ballType === 'WD' ? "Additional runs on wide delivery"
                : "Additional bye/leg bye runs on no ball"
              }
              min="0"
              max="6"
            />
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
});

export default BallConfirmModal;
