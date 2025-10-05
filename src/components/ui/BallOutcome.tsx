import { useState } from 'react';
import ScoreButton from './ScoreButton';
import Dropdown from './Dropdown';
import Input from './Input';

interface BallOutcomeProps {
  onBallUpdate: (outcome: BallOutcomeData) => void;
}

interface BallOutcomeData {
  runs: number;
  ballType: 'normal' | 'wide' | 'noBall' | 'legBye' | 'bye' | 'wicket' | 'penalty';
  extraType?: string;
  additionalRuns?: number;
  wicketType?: string;
  fielder?: string;
  newBatsman?: string;
}

const BallOutcome = ({ onBallUpdate }: BallOutcomeProps) => {
  const [selectedRuns, setSelectedRuns] = useState<number | null>(null);
  const [ballType, setBallType] = useState<string>('');
  const [showExtraOptions, setShowExtraOptions] = useState(false);
  const [showWicketOptions, setShowWicketOptions] = useState(false);
  const [showNewBatsman, setShowNewBatsman] = useState(false);
  
  // Form states
  const [extraType, setExtraType] = useState('');
  const [additionalRuns, setAdditionalRuns] = useState('');
  const [dismissalType, setDismissalType] = useState('');
  const [fielder, setFielder] = useState('');
  const [newBatsman, setNewBatsman] = useState('');

  const runOptions = [0, 1, 2, 3, 4, 6];
  const ballTypeOptions = ['Wide', 'No Ball', 'Bye', 'Leg Bye', 'Wicket', 'Penalty'];
  
  const extraTypeOptions = [
    { value: 'wide', label: 'Wide' },
    { value: 'noBall', label: 'No Ball' },
    { value: 'bye', label: 'Bye' },
    { value: 'legBye', label: 'Leg Bye' }
  ];

  const dismissalOptions = [
    { value: 'bowled', label: 'Bowled' },
    { value: 'caught', label: 'Caught' },
    { value: 'lbw', label: 'LBW' },
    { value: 'runOut', label: 'Run Out' },
    { value: 'stumped', label: 'Stumped' },
    { value: 'hitWicket', label: 'Hit Wicket' }
  ];

  const handleBallTypeSelect = (type: string) => {
    setBallType(type);
    
    // Reset states
    setShowExtraOptions(false);
    setShowWicketOptions(false);
    setShowNewBatsman(false);
    
    // Show appropriate options based on selection
    if (['Wide', 'No Ball', 'Bye', 'Leg Bye'].includes(type)) {
      setShowExtraOptions(true);
    } else if (type === 'Wicket') {
      setShowWicketOptions(true);
      setShowNewBatsman(true);
    }
  };

  const isRunButtonDisabled = (run: number) => {
    if (ballType === 'Wicket') return true;
    if (ballType === 'Wide' && run !== 0) return false;
    if (ballType === 'Wide' && run === 0) return true;
    return false;
  };

  const isBallTypeDisabled = (type: string) => {
    if (selectedRuns !== null && selectedRuns > 0) {
      return ['Wicket', 'Wide'].includes(type);
    }
    return false;
  };

  const handleConfirm = () => {
    const outcome: BallOutcomeData = {
      runs: selectedRuns || 0,
      ballType: ballType.toLowerCase().replace(' ', '') as any,
      extraType: extraType || undefined,
      additionalRuns: additionalRuns ? parseInt(additionalRuns) : undefined,
      wicketType: dismissalType || undefined,
      fielder: fielder || undefined,
      newBatsman: newBatsman || undefined
    };
    
    onBallUpdate(outcome);
    
    // Reset form
    setSelectedRuns(null);
    setBallType('');
    setShowExtraOptions(false);
    setShowWicketOptions(false);
    setShowNewBatsman(false);
    setExtraType('');
    setAdditionalRuns('');
    setDismissalType('');
    setFielder('');
    setNewBatsman('');
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4">
      <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Ball Outcome</h3>
      
      {/* Run Selection */}
      <div className="mb-4">
        <div className="grid grid-cols-3 sm:flex gap-3">
          {runOptions.map((run) => (
            <ScoreButton
              key={run}
              value={run}
              isSelected={selectedRuns === run}
              onClick={() => setSelectedRuns(run)}
              variant={run === 4 || run === 6 ? 'success' : 'primary'}
              disabled={isRunButtonDisabled(run)}
            />
          ))}
        </div>
      </div>

      {/* Ball Type Selection */}
      <div className="mb-4">
        <div className="grid grid-cols-2 sm:flex gap-3">
          {ballTypeOptions.map((type) => (
            <ScoreButton
              key={type}
              value={type}
              isSelected={ballType === type}
              onClick={() => handleBallTypeSelect(type)}
              variant={type === 'Wicket' ? 'danger' : 'secondary'}
              size="sm"
              disabled={isBallTypeDisabled(type)}
            />
          ))}
        </div>
      </div>

      {/* Extra Options */}
      {showExtraOptions && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-[var(--text)] mb-2">Extra Options</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[var(--text)] mb-1">Extra Type:</label>
              <Dropdown
                options={extraTypeOptions}
                value={extraType}
                onChange={setExtraType}
                placeholder="Select type"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--text)] mb-1">Additional Runs:</label>
              <Input
                type="number"
                value={additionalRuns}
                onChange={(e) => setAdditionalRuns(e.target.value)}
                placeholder="0"
                min="0"
                size="sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Wicket Options */}
      {showWicketOptions && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-[var(--text)] mb-2">Wicket Options</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[var(--text)] mb-1">Dismissal Type:</label>
              <Dropdown
                options={dismissalOptions}
                value={dismissalType}
                onChange={setDismissalType}
                placeholder="Select dismissal"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--text)] mb-1">Fielder:</label>
              <Input
                type="text"
                value={fielder}
                onChange={(e) => setFielder(e.target.value)}
                placeholder="Select fielder"
                size="sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* New Batsman Selection */}
      {showNewBatsman && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-[var(--text)] mb-2">New Batsman</h4>
          <div>
            <label className="block text-xs text-[var(--text)] mb-1">Select Batsman:</label>
            <Input
              type="text"
              value={newBatsman}
              onChange={(e) => setNewBatsman(e.target.value)}
              placeholder="Select Player"
              size="sm"
            />
            <button
              onClick={handleConfirm}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Confirm Button (for non-wicket outcomes) */}
      {!showNewBatsman && (selectedRuns !== null || ballType) && (
        <button
          onClick={handleConfirm}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Update Ball
        </button>
      )}
    </div>
  );
};

export default BallOutcome;