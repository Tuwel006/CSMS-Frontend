import { useState } from 'react';
import { useMatch } from '../context/MatchContext';
import BallOutcome from '../components/ui/BallOutcome';
import BallHistory from '../components/ui/BallHistory';
import LivePreview from '../components/ui/LivePreview';
import { Eye } from 'lucide-react';

interface BallOutcomeData {
  runs: number;
  ballType: 'normal' | 'wide' | 'noBall' | 'legBye' | 'bye' | 'wicket' | 'penalty';
  extraType?: string;
  additionalRuns?: number;
  wicketType?: string;
  fielder?: string;
  newBatsman?: string;
}

const Dashboard = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [ballHistory, setBallHistory] = useState([
    {
      overNumber: 12,
      bowler: 'Bowler',
      balls: [
        { value: 1, type: 'run' as const },
        { value: 0, type: 'run' as const },
        { value: 4, type: 'run' as const },
        { value: 'W', type: 'wicket' as const },
        { value: 2, type: 'run' as const },
        { value: 'W', type: 'wicket' as const, isCurrentBall: true }
      ]
    },
    {
      overNumber: 11,
      bowler: 'Bowler',
      balls: [
        { value: 0, type: 'run' as const },
        { value: 1, type: 'run' as const },
        { value: 6, type: 'run' as const },
        { value: 0, type: 'run' as const },
        { value: 1, type: 'run' as const },
        { value: 4, type: 'run' as const }
      ]
    },
    {
      overNumber: 10,
      bowler: 'Bowler',
      balls: [
        { value: 1, type: 'run' as const },
        { value: 1, type: 'run' as const },
        { value: 0, type: 'run' as const },
        { value: 2, type: 'run' as const },
        { value: 'Nb', type: 'noBall' as const },
        { value: 4, type: 'run' as const }
      ]
    }
  ]);

  const { match, currentInnings, addBall } = useMatch();

  const handleBallUpdate = async (outcome: BallOutcomeData) => {
    await addBall({
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
        <h2 className="text-xl font-semibold text-[var(--text)] mb-4">No Active Match</h2>
        <p className="text-[var(--text-secondary)] mb-4">Please set up a match first to start scoring.</p>
        <a 
          href="/match-setup" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Setup Match
        </a>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4 sm:p-6">
      <div className="flex justify-end mb-6">
        <button 
          onClick={() => setIsPreviewOpen(true)}
          className="flex items-center gap-2 text-sm bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-1 rounded text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Eye size={16} />
          Live Preview
        </button>
      </div>

      <BallOutcome onBallUpdate={handleBallUpdate} />
      
      <div className="mt-6">
        <BallHistory overs={ballHistory} />
      </div>
      
      <LivePreview 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
