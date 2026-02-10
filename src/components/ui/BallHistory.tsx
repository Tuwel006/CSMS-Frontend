import { useState } from 'react';
import { Edit2 } from 'lucide-react';

interface BallData {
  b: number;
  t: string;
  r: number | string;
}

interface OverData {
  overNumber: number;
  balls: BallData[];
  bowler: string;
}

interface BallHistoryProps {
  overs: OverData[];
}

const BallHistory = ({ overs }: BallHistoryProps) => {
  const [hoveredBall, setHoveredBall] = useState<string | null>(null);

  const getBallStyle = (ball: BallData) => {
    const baseStyle = "w-6 h-6 rounded flex items-center justify-center text-[9px] font-black border-b transition-all cursor-pointer";

    switch (ball.t) {
      case 'NORMAL':
        if (ball.r === 4 || ball.r === 6) return `${baseStyle} bg-emerald-500 border-emerald-700 text-white`;
        if (ball.r === 0) return `${baseStyle} bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-900 text-gray-400`;
        return `${baseStyle} bg-blue-500 border-blue-700 text-white`;
      case 'WICKET':
        return `${baseStyle} bg-rose-500 border-rose-700 text-white`;
      case 'WIDE':
        return `${baseStyle} bg-amber-400 border-amber-600 text-white`;
      case 'NO_BALL':
        return `${baseStyle} bg-indigo-500 border-indigo-700 text-white`;
      default:
        return `${baseStyle} bg-gray-400 border-gray-600 text-white`;
    }
  };

  const formatBallValue = (ball: BallData) => {
    if (ball.t === 'WICKET') return 'W';
    if (ball.t === 'WIDE') return 'Wd';
    if (ball.t === 'NO_BALL') return 'Nb';
    return ball.r.toString();
  };

  return (
    <div className="p-3 bg-[var(--card-bg)] border rounded-md shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
          <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
          History
        </h3>
      </div>

      <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
        {overs.map((over) => (
          <div key={over.overNumber} className="flex items-center gap-2 py-1.5 px-2 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors group">
            <div className="flex flex-col min-w-[32px]">
              <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 leading-none">OV {over.overNumber}</span>
              <span className="text-[8px] text-gray-400 truncate max-w-[40px] mt-0.5">{over.bowler}</span>
            </div>

            <div className="flex gap-1 flex-wrap flex-1">
              {over.balls.map((ball, index) => {
                const ballId = `${over.overNumber}-${index}`;
                return (
                  <div
                    key={ballId}
                    className="relative"
                    onMouseEnter={() => setHoveredBall(ballId)}
                    onMouseLeave={() => setHoveredBall(null)}
                  >
                    <div className={getBallStyle(ball)}>
                      {formatBallValue(ball)}
                    </div>
                    {hoveredBall === ballId && (
                      <button
                        className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg z-10 scale-100 transition-transform"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit2 size={8} />
                      </button>
                    )}
                  </div>
                );
              })}

              {over.balls.length < 6 && (
                Array.from({ length: 6 - over.balls.length }).map((_, index) => (
                  <div
                    key={`empty-${over.overNumber}-${index}`}
                    className="w-6 h-6 rounded border border-dashed border-gray-200 dark:border-gray-800 opacity-20"
                  />
                ))
              )}
            </div>
          </div>
        ))}

        {overs.length === 0 && (
          <div className="py-6 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-20">
            No Records
          </div>
        )}
      </div>
    </div>
  );
};

export default BallHistory;
