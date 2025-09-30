import { useState, useEffect } from 'react';
import { useMatch } from '../context/MatchContext';
import BallOutcome from '../components/ui/BallOutcome';
import BallHistory from '../components/ui/BallHistory';
import LivePreview from '../components/ui/LivePreview';
import { Eye } from 'lucide-react';
import type { Match, Innings, Team, Player } from '../types/match';

interface BallOutcomeData {
  runs: number;
  ballType: 'normal' | 'wide' | 'noBall' | 'legBye' | 'bye' | 'wicket' | 'penalty';
  extraType?: string;
  additionalRuns?: number;
  wicketType?: string;
  fielder?: string;
  newBatsman?: string;
}

// Stateless components
const MatchHeader = ({ match }: { match: Match }) => (
  <div>
    <h1 className="text-2xl font-bold text-[var(--text)] mb-2">
      {match.team1.name} vs {match.team2.name}
    </h1>
    <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
      <span className="flex items-center gap-1">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        Live
      </span>
      <span>ODI Match • {match.overs} Overs</span>
      <span>Innings {match.currentInnings}</span>
    </div>
  </div>
);

const CurrentScoreCard = ({ match, innings }: { match: Match; innings: Innings }) => (
  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
    <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Current Score</h3>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[var(--text)]">{match.team1.name}</span>
        <span className="text-2xl font-bold text-[var(--text)]">{innings.score}/{innings.wickets}</span>
      </div>
      <div className="text-sm text-[var(--text-secondary)]">
        Overs: {innings.overs.length}.0/{match.overs} • Run Rate: {(innings.score / (innings.overs.length || 1)).toFixed(2)}
      </div>
      <div className="border-t border-[var(--card-border)] pt-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[var(--text-secondary)]">Batsmen:</span>
            <div className="text-[var(--text)] mt-1">
              <div>{innings.currentBatsmen[0]}* 45 (32)</div>
              <div>{innings.currentBatsmen[1]} 23 (18)</div>
            </div>
          </div>
          <div>
            <span className="text-[var(--text-secondary)]">Bowler:</span>
            <div className="text-[var(--text)] mt-1">
              {innings.currentBowler} 3-0-28-2
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RecentOversCard = ({ overs }: { overs: any[] }) => (
  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
    <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Recent Overs</h3>
    <div className="space-y-2">
      {overs.slice(-4).reverse().map((over, index) => (
        <div key={over.overNumber} className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Over {over.overNumber}:</span>
          <span className="text-[var(--text)] font-mono">
            {over.balls.map((ball: any) => ball.value).join(' ')}
          </span>
          <span className="text-[var(--text)]">
            {over.balls.reduce((sum: number, ball: any) => sum + (typeof ball.value === 'number' ? ball.value : 0), 0)} runs
          </span>
        </div>
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { match, currentInnings, addBall, createMatch } = useMatch();

  // Get ball history from current innings
  const ballHistory = currentInnings?.overs.map(over => ({
    overNumber: over.overNumber,
    bowler: over.bowler,
    balls: over.balls.map(ball => ({
      value: ball.ballType === 'wicket' ? 'W' : 
             ball.ballType === 'wide' ? 'Wd' :
             ball.ballType === 'noBall' ? 'Nb' : ball.runs,
      type: ball.ballType === 'wicket' ? 'wicket' as const :
            ball.ballType === 'wide' ? 'wide' as const :
            ball.ballType === 'noBall' ? 'noBall' as const : 'run' as const
    }))
  })) || [];

  // Initialize dummy data on component mount
  useEffect(() => {
    if (!match) {
      initializeDummyMatch();
    }
  }, [match]);

  const initializeDummyMatch = async () => {
    const indiaPlayers: Player[] = [
      { id: '1', name: 'R. Sharma', role: 'batsman' },
      { id: '2', name: 'S. Gill', role: 'batsman' },
      { id: '3', name: 'V. Kohli', role: 'batsman' },
      { id: '4', name: 'S. Iyer', role: 'batsman' },
      { id: '5', name: 'K.L. Rahul', role: 'wicketkeeper' },
      { id: '6', name: 'H. Pandya', role: 'allrounder' },
      { id: '7', name: 'R. Jadeja', role: 'allrounder' },
      { id: '8', name: 'M. Shami', role: 'bowler' },
      { id: '9', name: 'J. Bumrah', role: 'bowler' },
      { id: '10', name: 'K. Yadav', role: 'bowler' },
      { id: '11', name: 'S. Thakur', role: 'bowler' }
    ];

    const australiaPlayers: Player[] = [
      { id: '12', name: 'D. Warner', role: 'batsman' },
      { id: '13', name: 'T. Head', role: 'batsman' },
      { id: '14', name: 'S. Smith', role: 'batsman' },
      { id: '15', name: 'M. Labuschagne', role: 'batsman' },
      { id: '16', name: 'A. Carey', role: 'wicketkeeper' },
      { id: '17', name: 'G. Maxwell', role: 'allrounder' },
      { id: '18', name: 'M. Stoinis', role: 'allrounder' },
      { id: '19', name: 'P. Cummins', role: 'bowler' },
      { id: '20', name: 'M. Starc', role: 'bowler' },
      { id: '21', name: 'J. Hazlewood', role: 'bowler' },
      { id: '22', name: 'A. Zampa', role: 'bowler' }
    ];

    const team1: Team = {
      id: 'india',
      name: 'India',
      players: indiaPlayers,
      playing11: indiaPlayers.map(p => p.id),
      battingOrder: indiaPlayers.map(p => p.id)
    };

    const team2: Team = {
      id: 'australia',
      name: 'Australia',
      players: australiaPlayers,
      playing11: australiaPlayers.map(p => p.id),
      battingOrder: australiaPlayers.map(p => p.id)
    };

    const dummyMatch: Omit<Match, 'id'> = {
      team1,
      team2,
      tossWinner: 'india',
      tossDecision: 'bat',
      battingTeam: 'india',
      bowlingTeam: 'australia',
      overs: 50,
      currentInnings: 1,
      status: 'live'
    };

    await createMatch(dummyMatch);
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

  if (!match || !currentInnings) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">
          <h2 className="text-xl font-semibold text-[var(--text)] mb-4">Loading Match...</h2>
          <p className="text-[var(--text-secondary)]">Setting up dummy match data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4 sm:p-6">
      {/* Header with Match Info and Live Preview Button */}
      <div className="flex justify-between items-start mb-6">
        <MatchHeader match={match} />
        <button 
          onClick={() => setIsPreviewOpen(true)}
          className="flex items-center gap-2 text-sm bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-2 rounded-lg text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Eye size={16} />
          Live Preview
        </button>
      </div>

      {/* Current Match Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CurrentScoreCard match={match} innings={currentInnings} />
        <RecentOversCard overs={ballHistory} />
      </div>

      {/* Ball Input Section */}
      <BallOutcome onBallUpdate={handleBallUpdate} />
      
      {/* Ball History */}
      <div className="mt-6">
        <BallHistory overs={ballHistory} />
      </div>
      
      {/* Live Preview Modal */}
      <LivePreview 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
