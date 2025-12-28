import React from 'react';
import { X } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  role?: string;
}

interface PlayerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (player: Player) => void;
  players: Player[];
  title: string;
  loading?: boolean;
}

const PlayerSelectionModal: React.FC<PlayerSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  players,
  title,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4 max-w-md w-full mx-4 max-h-96 overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[var(--text)]">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => onSelect(player)}
                className="w-full text-left p-3 rounded border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="font-medium text-[var(--text)]">{player.name}</div>
                {player.role && (
                  <div className="text-sm text-gray-500">{player.role}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerSelectionModal;