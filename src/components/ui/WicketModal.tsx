import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import Input from './Input';

interface WicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dismissalType: string, fielder?: string, normalRun?: number, byeRuns?: number, outBatsmanId?: string, ballType?: 'NORMAL' | 'WIDE' | 'NO_BALL') => void;
  bowlingTeamPlayers: any[];
  currentBatsmen?: { striker: any; nonStriker: any };
}

const WicketModal: React.FC<WicketModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bowlingTeamPlayers,
  currentBatsmen
}) => {
  const [dismissalType, setDismissalType] = useState('');
  const [selectedFielder, setSelectedFielder] = useState('');
  const [showFielderSelection, setShowFielderSelection] = useState(false);
  const [runs, setRuns] = useState('0');
  const [outBatsmanId, setOutBatsmanId] = useState('');
  const [runType, setRunType] = useState<'NORMAL' | 'BYE'>('NORMAL');
  const [ballType, setBallType] = useState<'NORMAL' | 'WIDE' | 'NO_BALL'>('NORMAL');

  const dismissalTypes = [
    'Bowled',
    'Caught',
    'LBW',
    'Run Out',
    'Stumped',
    'Hit Wicket'
  ];

  const handleDismissalTypeSelect = (type: string) => {
    setDismissalType(type);
    if (type === 'Caught' || type === 'Run Out' || type === 'Stumped') {
      setShowFielderSelection(true);
    } else {
      setShowFielderSelection(false);
      setSelectedFielder('');
    }
    if (type !== 'Run Out') {
      setRuns('0');
      setOutBatsmanId('');
    }
  };

  const handleConfirm = () => {
    if (dismissalType) {
      const normalRun = runType === 'NORMAL' ? parseInt(runs) : 0;
      const byeRuns = runType === 'BYE' ? parseInt(runs) : 0;
      if(dismissalType === 'Run Out') {
        onConfirm(
          dismissalType,
          selectedFielder,
          normalRun,
          byeRuns,
          outBatsmanId,
          ballType
        );
      }
      else if(dismissalType === 'Stumped') {
        onConfirm(
          dismissalType,
          selectedFielder,
          undefined,
          byeRuns,
          outBatsmanId,
          ballType
        );
      }
      else {
        onConfirm(
          dismissalType,
          selectedFielder,
          normalRun,
          byeRuns,
          outBatsmanId,
          ballType
        );
      }

      setDismissalType('');
      setSelectedFielder('');
      setShowFielderSelection(false);
      setRuns('0');
      setOutBatsmanId('');
      setRunType('NORMAL');
      setBallType('NORMAL');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[var(--card-border)]">
          <h3 className="text-lg font-bold text-[var(--text)]">Wicket Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-4">
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text)]">
              Dismissal Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {dismissalTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleDismissalTypeSelect(type)}
                  className={`p-2 text-sm rounded border transition-colors ${
                    dismissalType === type
                      ? 'bg-red-500 text-white border-red-500'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {(dismissalType === 'Run Out' || dismissalType === 'Stumped') && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">
                  Ball Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setBallType('NORMAL')}
                    className={`p-2 text-sm rounded border transition-colors ${
                      ballType === 'NORMAL'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setBallType('WIDE')}
                    className={`p-2 text-sm rounded border transition-colors ${
                      ballType === 'WIDE'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    Wide
                  </button>
                  <button
                    onClick={() => setBallType('NO_BALL')}
                    className={`p-2 text-sm rounded border transition-colors ${
                      ballType === 'NO_BALL'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    No Ball
                  </button>
                </div>
              </div>
            </>
          )}

          {dismissalType === 'Run Out' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">
                  Run Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setRunType('NORMAL')}
                    className={`p-2 text-sm rounded border transition-colors ${
                      runType === 'NORMAL'
                        ? 'bg-green-500 text-white border-green-500'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    Runs
                  </button>
                  <button
                    onClick={() => setRunType('BYE')}
                    className={`p-2 text-sm rounded border transition-colors ${
                      runType === 'BYE'
                        ? 'bg-green-500 text-white border-green-500'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    Bye
                  </button>
                </div>
              </div>
              
              <Input
                type="number"
                label={runType === 'BYE' ? 'Bye Runs' : 'Runs Scored'}
                value={runs}
                onChange={setRuns}
                placeholder="Enter runs (0-6)"
                min="0"
                max="6"
              />
              
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text)]">
                  Batsman Out
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {currentBatsmen?.striker && (
                    <button
                      onClick={() => setOutBatsmanId(currentBatsmen.striker.id)}
                      className={`p-2 text-sm rounded border transition-colors ${
                        outBatsmanId === currentBatsmen.striker.id
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {currentBatsmen.striker.n} (Striker)
                    </button>
                  )}
                  {currentBatsmen?.nonStriker && (
                    <button
                      onClick={() => setOutBatsmanId(currentBatsmen.nonStriker.id)}
                      className={`p-2 text-sm rounded border transition-colors ${
                        outBatsmanId === currentBatsmen.nonStriker.id
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {currentBatsmen.nonStriker.n}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {showFielderSelection && (
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text)]">
                Fielder
              </label>
              <select
                value={selectedFielder}
                onChange={(e) => setSelectedFielder(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-[var(--card-bg)] text-[var(--text)]"
              >
                <option value="">Select Fielder</option>
                {bowlingTeamPlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          </div>
        </div>

        <div className="flex gap-2 p-4 border-t border-[var(--card-border)] bg-[var(--card-bg)]">
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!dismissalType || (showFielderSelection && !selectedFielder) || (dismissalType === 'Run Out' && !outBatsmanId)}
            variant="danger"
            className="flex-1"
          >
            Confirm Wicket
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WicketModal;