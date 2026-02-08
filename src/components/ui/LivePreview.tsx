import { X, ChevronDown, ChevronUp } from 'lucide-react';
import type { MatchScoreResponse } from '@/types/scoreService';
import { useState, useMemo } from 'react';

interface LivePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  matchData: MatchScoreResponse | null;
}

const LivePreview = ({ isOpen, onClose, matchData }: LivePreviewProps) => {
  const [isBattingExpanded, setIsBattingExpanded] = useState(true);
  const currentInning = matchData?.innings?.[matchData.innings.length - 1];

  const allBatsmen = useMemo(() => {
    if (!currentInning) return [];
    const batsmen = [];
    if (currentInning.batting.striker) batsmen.push({ ...currentInning.batting.striker, isStriker: true });
    if (currentInning.batting.nonStriker) batsmen.push({ ...currentInning.batting.nonStriker, isStriker: false });
    if (currentInning.dismissed) batsmen.push(...currentInning.dismissed.map((b: { id: number; n: string; r: number; b: number; order?: number }) => ({ ...b, isStriker: false })));
    return batsmen.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [currentInning]);

  return (
    <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Live Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X size={20} className="text-gray-900 dark:text-gray-100" />
          </button>
        </div>

        {matchData && currentInning ? (
          <>
            {/* Match Info */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4 mb-3">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {matchData.teams.A.short} vs {matchData.teams.B.short}
                </h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {currentInning.score.r}/{currentInning.score.w}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{Math.floor(currentInning.score.b / 6)}.{currentInning.score.b % 6} overs</div>
              </div>
            </div>

            {/* Batting Section - Collapsible */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded mb-3">
              <button
                onClick={() => setIsBattingExpanded(!isBattingExpanded)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {isBattingExpanded ? 'Batting' : 'Current Batsmen'}
                </h4>
                {isBattingExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {!isBattingExpanded ? (
                <div className="px-3 pb-3 space-y-2">
                  {currentInning.batting.striker && (
                    <div className="flex justify-between text-sm py-1.5">
                      <span className="text-gray-900 dark:text-gray-100 flex items-center gap-1">
                        {currentInning.batting.striker.n}
                        <span className="text-yellow-500 text-xs">★</span>
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">{currentInning.batting.striker.r} ({currentInning.batting.striker.b})</span>
                    </div>
                  )}
                  {currentInning.batting.nonStriker && (
                    <div className="flex justify-between text-sm py-1.5">
                      <span className="text-gray-900 dark:text-gray-100">{currentInning.batting.nonStriker.n}</span>
                      <span className="text-gray-900 dark:text-gray-100">{currentInning.batting.nonStriker.r} ({currentInning.batting.nonStriker.b})</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-3 pb-3 space-y-1.5">
                  {allBatsmen.map((batsman, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-900 dark:text-gray-100">{batsman.n}</span>
                        {batsman.isStriker && <span className="text-yellow-500 text-xs">★</span>}
                      </div>
                      <span className="text-gray-900 dark:text-gray-100">{batsman.r} ({batsman.b})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Current Bowler */}
            {currentInning.bowling && currentInning.bowling.length > 0 && currentInning.currentOver && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Current Bowler</h4>
                {(() => {
                  const currentBowler = currentInning.bowling.find((b: { id: number; n: string; w: number; r: number; o: string | number }) => b.id === currentInning.currentOver.bowlerId);
                  return currentBowler ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-900 dark:text-gray-100">{currentBowler.n}</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {currentBowler.w}/{currentBowler.r} ({Math.floor(currentBowler.b / 6)}.{currentBowler.b % 6})
                      </span>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* All Bowlers */}
            {currentInning.bowling && currentInning.bowling.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Bowling</h4>
                <div className="space-y-1.5">
                  {currentInning.bowling.map((bowler, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <span className="text-gray-900 dark:text-gray-100">{bowler.n}</span>
                      <span className="text-gray-900 dark:text-gray-100">{bowler.w}/{bowler.r} ({Math.floor(bowler.b / 6)}.{bowler.b % 6})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Over */}
            {currentInning.currentOver && currentInning.currentOver.balls && currentInning.currentOver.balls.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Current Over</h4>
                <div className="flex gap-1.5 flex-wrap">
                  {currentInning.currentOver.balls.map((ball, idx) => {
                    const getBallStyle = () => {
                      if (ball.t === 'WIDE' || ball.t === 'NO_BALL') return 'bg-red-100 dark:bg-red-900';
                      if (ball.r === 6) return 'bg-purple-100 dark:bg-purple-900';
                      if (ball.r === 4) return 'bg-green-100 dark:bg-green-900';
                      if (ball.r === 0) return 'bg-gray-100 dark:bg-gray-700';
                      return 'bg-blue-100 dark:bg-blue-900';
                    };

                    return (
                      <span key={idx} className={`w-8 h-8 ${getBallStyle()} rounded flex items-center justify-center text-xs font-medium`}>
                        {ball.t === 'WIDE' ? 'WD' : ball.t === 'NO_BALL' ? 'NB' : ball.r}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No match data available
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreview;