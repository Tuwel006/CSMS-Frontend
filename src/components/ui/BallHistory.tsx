interface BallData {
  value: string | number;
  type: 'run' | 'wide' | 'noBall' | 'wicket' | 'bye' | 'legBye';
  isCurrentBall?: boolean;
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
  const getBallStyle = (ball: BallData) => {
    const baseStyle = "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all";
    
    if (ball.isCurrentBall) {
      return `${baseStyle} border-blue-500 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 animate-pulse`;
    }
    
    switch (ball.type) {
      case 'run':
        const runs = Number(ball.value);
        if (runs === 4) return `${baseStyle} border-green-500 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300`;
        if (runs === 6) return `${baseStyle} border-green-600 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200`;
        return `${baseStyle} border-gray-400 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300`;
      
      case 'wicket':
        return `${baseStyle} border-red-500 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300`;
      
      case 'wide':
        return `${baseStyle} border-orange-500 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300`;
      
      case 'noBall':
        return `${baseStyle} border-purple-500 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300`;
      
      case 'bye':
      case 'legBye':
        return `${baseStyle} border-yellow-500 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300`;
      
      default:
        return `${baseStyle} border-gray-400 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300`;
    }
  };

  const formatBallValue = (ball: BallData) => {
    if (ball.type === 'wicket') return 'W';
    if (ball.type === 'wide') return 'Wd';
    if (ball.type === 'noBall') return 'Nb';
    return ball.value.toString();
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4">
      <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Ball History</h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {overs.map((over) => (
          <div key={over.overNumber} className="border-b border-[var(--card-border)] pb-3 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[var(--text)]">
                Over {over.overNumber}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Bowler: {over.bowler}
              </span>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {over.balls.map((ball, index) => (
                <div
                  key={`ball-${over.overNumber}-${index}`}
                  className={getBallStyle(ball)}
                  title={`Ball ${index + 1}: ${ball.type} - ${ball.value}`}
                >
                  {formatBallValue(ball)}
                </div>
              ))}
              
              {/* Show remaining balls in current over */}
              {over.balls.length < 6 && (
                Array.from({ length: 6 - over.balls.length }).map((_, index) => (
                  <div
                    key={`empty-${over.overNumber}-${index}`}
                    className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600"
                  />
                ))
              )}
            </div>
          </div>
        ))}
        
        {overs.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No balls bowled yet</p>
          </div>
        )}
      </div>
      
      {/* Edit Ball Button */}
      <div className="mt-4 pt-3 border-t border-[var(--card-border)]">
        <button className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
          Edit Ball
        </button>
      </div>
    </div>
  );
};

export default BallHistory;