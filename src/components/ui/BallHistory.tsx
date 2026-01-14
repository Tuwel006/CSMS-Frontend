import { useState } from 'react';
import { Edit2 } from 'lucide-react';

interface BallData {
  b: number;
  t: string;
  r: number;
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
    const baseStyle = "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-all cursor-pointer hover:scale-110";
    
    switch (ball.t) {
      case 'NORMAL':
        if (ball.r === 4) return `${baseStyle} bg-gradient-to-br from-green-400 to-green-500 text-white`;
        if (ball.r === 6) return `${baseStyle} bg-gradient-to-br from-green-500 to-green-600 text-white`;
        return `${baseStyle} bg-gradient-to-br from-gray-400 to-gray-500 text-white`;
      case 'WICKET':
        return `${baseStyle} bg-gradient-to-br from-red-500 to-red-600 text-white`;
      case 'WIDE':
        return `${baseStyle} bg-gradient-to-br from-orange-400 to-orange-500 text-white`;
      case 'NO_BALL':
        return `${baseStyle} bg-gradient-to-br from-purple-400 to-purple-500 text-white`;
      case 'BYE':
      case 'LEG_BYE':
        return `${baseStyle} bg-gradient-to-br from-yellow-400 to-yellow-500 text-white`;
      default:
        return `${baseStyle} bg-gradient-to-br from-gray-400 to-gray-500 text-white`;
    }
  };

  const formatBallValue = (ball: BallData) => {
    if (ball.t === 'WICKET') return 'W';
    if (ball.t === 'WIDE') return 'Wd';
    if (ball.t === 'NO_BALL') return 'Nb';
    if (ball.t === 'BYE') return 'B';
    if (ball.t === 'LEG_BYE') return 'Lb';
    return ball.r.toString();
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xs p-3">
      <h3 className="text-xs font-semibold text-[var(--text)] mb-2">BALL HISTORY</h3>
      
      <div className="space-y-2 min-h-16 max-h-56 overflow-y-auto">
        {overs.map((over) => (
          <div key={over.overNumber} className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-[var(--text-secondary)] w-12 shrink-0">
              Over {over.overNumber}
            </span>
            
            <div className="flex gap-1 flex-1 flex-wrap">
              {over.balls.map((ball, index) => {
                const ballId = `${over.overNumber}-${index}`;
                return (
                  <div
                    key={ballId}
                    className="relative group"
                    onMouseEnter={() => setHoveredBall(ballId)}
                    onMouseLeave={() => setHoveredBall(null)}
                  >
                    <div className={getBallStyle(ball)}>
                      {formatBallValue(ball)}
                    </div>
                    {hoveredBall === ballId && (
                      <button
                        className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                        title="Edit ball"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit
                        }}
                      >
                        <Edit2 size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
              
              {over.balls.length < 6 && (
                Array.from({ length: 6 - over.balls.length }).map((_, index) => (
                  <div
                    key={`empty-${over.overNumber}-${index}`}
                    className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 opacity-40"
                  />
                ))
              )}
            </div>
          </div>
        ))}
        
        {overs.length === 0 && (
          <div className="text-center py-4 text-[10px] text-gray-500 dark:text-gray-400">
            No balls bowled yet
          </div>
        )}
      </div>
    </div>
  );
};

export default BallHistory;
