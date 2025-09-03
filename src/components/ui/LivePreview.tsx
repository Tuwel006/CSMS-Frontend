import { X } from 'lucide-react';

interface LivePreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const LivePreview = ({ isOpen, onClose }: LivePreviewProps) => {
  return (
    <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-[var(--card-bg)] border-l border-[var(--card-border)] z-50 transform transition-transform duration-300 overflow-y-auto ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text)]">Live Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} className="text-[var(--text)]" />
          </button>
        </div>
        
        {/* Match Info */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4 mb-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-[var(--text)] mb-2">IND vs ENG</h3>
            <div className="text-3xl font-bold text-[var(--text)] mb-1">127/3</div>
            <div className="text-sm text-[var(--text-secondary)]">12.0 overs</div>
          </div>
        </div>

        {/* Current Batsmen */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-[var(--text)] mb-3">Current Batsmen</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text)]">V. Kohli*</span>
              <span className="text-[var(--text)]">42 (38)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text)]">R. Sharma</span>
              <span className="text-[var(--text)]">35 (29)</span>
            </div>
          </div>
        </div>

        {/* Current Bowler */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-[var(--text)] mb-3">Current Bowler</h4>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text)]">J. Anderson</span>
            <span className="text-[var(--text)]">2/28 (4.0)</span>
          </div>
        </div>

        {/* Recent Overs */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4">
          <h4 className="text-sm font-medium text-[var(--text)] mb-3">Recent Overs</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
                <span>Over 12</span>
                <span>Bowler</span>
              </div>
              <div className="flex gap-1">
                <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">1</span>
                <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">0</span>
                <span className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-xs">4</span>
                <span className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center text-xs">W</span>
                <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">2</span>
                <span className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center text-xs border-2 border-blue-500">W</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
                <span>Over 11</span>
                <span>Bowler</span>
              </div>
              <div className="flex gap-1">
                <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">0</span>
                <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">1</span>
                <span className="w-6 h-6 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center text-xs">6</span>
                <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">0</span>
                <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">1</span>
                <span className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-xs">4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;