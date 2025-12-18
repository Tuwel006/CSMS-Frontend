import { useState, useEffect } from 'react';
import BallOutcome from '../components/ui/BallOutcome';
import BallHistory from '../components/ui/BallHistory';
import LivePreview from '../components/ui/LivePreview';
import ActiveSessionHeader from '../components/ActiveSessionHeader';
import { Eye } from 'lucide-react';
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

const CurrentScoreCard = ({ score }: any) => (
  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
    <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Current Score</h3>
    <div className="text-center py-4">
      <div className="text-5xl font-black text-blue-600 dark:text-blue-400">
        {score?.runs || 0}/{score?.wickets || 0}
      </div>
      <div className="text-sm text-[var(--text-secondary)] mt-2">
        Overs: {score?.overs || '0.0'}
      </div>
    </div>
  </div>
);

const RecentOversCard = ({ overs }: any) => (
  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
    <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Recent Overs</h3>
    <div className="text-center text-[var(--text-secondary)] py-4">
      {overs?.length > 0 ? 'Over history will appear here' : 'No overs yet'}
    </div>
  </div>
);

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

      <BallOutcome onBallUpdate={handleBallUpdate} />
      
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
