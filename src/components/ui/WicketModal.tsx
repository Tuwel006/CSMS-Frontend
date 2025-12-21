import React, { useState } from 'react';
import { X } from 'lucide-react';

interface WicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dismissalType: string, fielder?: string) => void;
  bowlingTeamPlayers: any[];
}

const WicketModal: React.FC<WicketModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bowlingTeamPlayers
}) => {
  const [dismissalType, setDismissalType] = useState('');
  const [selectedFielder, setSelectedFielder] = useState('');
  const [showFielderSelection, setShowFielderSelection] = useState(false);

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
  };

  const handleConfirm = () => {
    if (dismissalType) {
      onConfirm(dismissalType, selectedFielder || undefined);
      setDismissalType('');
      setSelectedFielder('');
      setShowFielderSelection(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[var(--text)]">Wicket Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
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
                  <option key={player.id} value={player.name}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-[var(--text)] hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!dismissalType || (showFielderSelection && !selectedFielder)}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Wicket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WicketModal;