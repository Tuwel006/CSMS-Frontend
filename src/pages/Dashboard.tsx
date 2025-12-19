import { useState, useEffect } from 'react';
import BallOutcome from '../components/ui/BallOutcome';
import BallHistory from '../components/ui/BallHistory';
import LivePreview from '../components/ui/LivePreview';
import ActiveSessionHeader from '../components/ActiveSessionHeader';
import { Eye, Star, ChevronDown } from 'lucide-react';
import { MatchService } from '../services/matchService';
import { showToast } from '../utils/toast';
import { CurrentMatchResponse } from '../types/matchService';

interface BallOutcomeData {
  runs: number;
  ballType: 'normal' | 'wide' | 'noBall' | 'legBye' | 'bye' | 'wicket' | 'penalty';
  extraType?: string;
  additionalRuns?: number;
  wicketType?: string;
  fielder?: string;
  newBatsman?: string;
}

const MatchHeader = ({ teamA, teamB, venue, format }: any) => (
  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md p-2 mb-2">
    <div className="flex items-center justify-between gap-2">
      {/* Team A Card */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-blue-950 dark:via-blue-900 dark:to-indigo-950 border-2 border-blue-300 dark:border-blue-700 rounded-lg px-3 py-2.5 shadow-md hover:shadow-lg transition-shadow">
        <div className="text-center">
          <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-0.5 tracking-wide">TEAM A</div>
          <h2 className="text-sm sm:text-base font-black text-blue-900 dark:text-blue-50 truncate">{teamA?.short_name || teamA?.name}</h2>
        </div>
      </div>

      {/* VS & Live Badge */}
      <div className="flex flex-col items-center gap-1 px-2">
        <div className="text-lg sm:text-xl font-black text-gray-400 dark:text-gray-600">VS</div>
        <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500 dark:bg-red-500 text-white dark:text-white text-[10px] font-bold rounded-full animate-pulse">
          <div className="w-1.5 h-1.5 bg-white dark:bg-white rounded-full"></div>
          LIVE
        </div>
      </div>

      {/* Team B Card */}
      <div className="flex-1 bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100 dark:from-emerald-950 dark:via-green-900 dark:to-teal-950 border-2 border-emerald-300 dark:border-emerald-700 rounded-lg px-3 py-2.5 shadow-md hover:shadow-lg transition-shadow">
        <div className="text-center">
          <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 mb-0.5 tracking-wide">TEAM B</div>
          <h2 className="text-sm sm:text-base font-black text-emerald-900 dark:text-emerald-50 truncate">{teamB?.short_name || teamB?.name}</h2>
        </div>
      </div>
    </div>
    
    {/* Match Info */}
    <div className="text-center mt-1.5 pt-1.5 border-t border-[var(--card-border)]">
      <div className="text-[10px] text-[var(--text-secondary)]">
        <span className="font-semibold">{venue}</span> • <span>{format} Overs</span>
      </div>
    </div>
  </div>
);

const CurrentScoreCard = ({ score }: any) => {
  const [showBatsmanDropdown, setShowBatsmanDropdown] = useState(false);
  const batsmen = ['S. Iyer', 'H. Pandya', 'R. Jadeja'];
  const striker = { name: 'R. Sharma', runs: 45, balls: 32 };
  const nonStriker = { name: 'V. Kohli', runs: 28, balls: 21 };
  
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3">
      <h3 className="text-sm font-bold text-[var(--text)] mb-2">Current Score</h3>
      <div className="text-center py-2">
        <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
          {score?.runs || 0}/{score?.wickets || 0}
        </div>
        <div className="text-xs text-[var(--text-secondary)] mt-1">
          Overs: {score?.overs || '0.0'}
        </div>
      </div>
      
      <div className="mt-2 space-y-1.5">
        <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">BATTING NOW</p>
        <div className="bg-green-50 dark:bg-green-900/20 rounded p-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star size={12} className="text-green-600 dark:text-green-400 fill-current" />
              <span className="text-xs font-bold text-[var(--text)]">{striker.name}</span>
            </div>
            <span className="text-xs font-bold text-[var(--text)]">{striker.runs}({striker.balls})</span>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text)]">{nonStriker.name}</span>
            <span className="text-xs font-bold text-[var(--text)]">{nonStriker.runs}({nonStriker.balls})</span>
          </div>
        </div>
        
        <div className="relative mt-3">
          <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">SELECT NEXT</p>
          <button
            onClick={() => setShowBatsmanDropdown(!showBatsmanDropdown)}
            className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border-2 border-dashed border-blue-400 dark:border-blue-600 rounded p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Choose Next Batsman</span>
            <ChevronDown size={12} className={`text-blue-600 dark:text-blue-400 transition-transform ${showBatsmanDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showBatsmanDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded shadow-lg max-h-24 overflow-y-auto">
              {batsmen.map((b, i) => (
                <button key={i} onClick={() => setShowBatsmanDropdown(false)} className="w-full text-left px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RecentOversCard = ({ overs }: any) => {
  const [showBowlerDropdown, setShowBowlerDropdown] = useState(false);
  const bowlers = ['M. Starc', 'A. Zampa', 'J. Hazlewood'];
  const currentBowler = 'P. Cummins';
  
  const getBallColor = (ball: string) => {
    const colors: any = { '0': 'bg-gray-500', '1': 'bg-green-500', '2': 'bg-green-600', '3': 'bg-green-700', '4': 'bg-blue-500', '6': 'bg-yellow-500', 'W': 'bg-red-500', 'WD': 'bg-pink-500', 'NB': 'bg-purple-500' };
    return colors[ball] || 'bg-gray-400';
  };
  
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3">
      <h3 className="text-sm font-bold text-[var(--text)] mb-2">Recent Overs</h3>
      
      <div className="mb-2 relative">
        <button
          onClick={() => setShowBowlerDropdown(!showBowlerDropdown)}
          className="w-full flex items-center justify-between bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded p-2 hover:bg-orange-100 dark:hover:bg-orange-900/30"
        >
          <div>
            <p className="text-[10px] text-gray-600 dark:text-gray-400">Bowler</p>
            <p className="font-bold text-xs text-[var(--text)]">{currentBowler}</p>
          </div>
          <ChevronDown size={14} className={`transition-transform ${showBowlerDropdown ? 'rotate-180' : ''}`} />
        </button>
        {showBowlerDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded shadow-lg max-h-24 overflow-y-auto">
            {bowlers.map((b, i) => (
              <button key={i} onClick={() => setShowBowlerDropdown(false)} className="w-full text-left px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                {b}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-[10px] text-[var(--text-secondary)] mb-1.5">Current Over</p>
        <div className="flex gap-1.5">
          {['1', '4', '0', 'W'].map((ball, i) => (
            <div key={i} className={`${getBallColor(ball)} text-white w-7 h-7 rounded flex items-center justify-center text-xs font-bold`}>
              {ball}
            </div>
          ))}
          <div className="bg-gray-200 dark:bg-gray-700 w-7 h-7 rounded flex items-center justify-center text-xs">•</div>
          <div className="bg-gray-200 dark:bg-gray-700 w-7 h-7 rounded flex items-center justify-center text-xs">•</div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [matchData, setMatchData] = useState<CurrentMatchResponse | null>(null);
  const [matchToken, setMatchToken] = useState<string | null>(null);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('activeMatchToken');
    if (token) {
      setMatchToken(token);
      fetchCurrentMatch(token);
    }
  }, []);

  const fetchCurrentMatch = async (token: string) => {
    try {
      const response = await MatchService.getCurrentMatch(token);
      if (response.status >= 200 && response.status < 300 && response.data) {
        setMatchData(response.data);
      }
    } catch (error) {
      console.error('Error fetching match:', error);
      showToast.error('Failed to load match data');
    }
  };

  const handleBallUpdate = (outcome: BallOutcomeData) => {
    addBall({
      runs: outcome.runs,
      ballType: outcome.ballType,
      extraRuns: outcome.additionalRuns,
      wicketType: outcome.wicketType,
      fielder: outcome.fielder,
      batsmanOut: outcome.wicketType ? 'current_batsman' : undefined,
      newBatsman: outcome.newBatsman
    });
  };

  if (!matchData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto p-2 sm:p-4">
      {!isHeaderCollapsed && (
        <>
          <div className="mb-2">
            <ActiveSessionHeader matchToken={matchToken} onCancel={() => {}} />
          </div>
          
          <MatchHeader 
            teamA={matchData.teamA} 
            teamB={matchData.teamB} 
            venue={matchData.venue}
            format={matchData.format}
          />
        </>
      )}

      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
          className="text-xs text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
        >
          {isHeaderCollapsed ? '▼ Show Header' : '▲ Hide Header'}
        </button>
        <button 
          onClick={() => setIsPreviewOpen(true)}
          className="flex items-center gap-2 text-sm bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-1.5 rounded-lg text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <Eye size={16} />
          Live Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <CurrentScoreCard score={matchData.score} />
        <RecentOversCard overs={[]} />
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3">
        <h3 className="text-sm font-bold text-[var(--text)] mb-2">Ball Outcome</h3>
        <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
          {['0', '1', '2', '3', '4', '6', 'W', 'WD', 'NB'].map((ball) => (
            <button
              key={ball}
              onClick={() => console.log(ball)}
              className="h-9 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-800 dark:text-gray-200 font-bold text-sm transition-all"
            >
              {ball}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        <BallHistory overs={[]} />
      </div>
      
      <LivePreview 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
