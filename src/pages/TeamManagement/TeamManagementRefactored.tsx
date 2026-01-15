import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Stack } from '../../components/ui/lib';
import { FileText, Play } from 'lucide-react';
import SingleMatchSetupTab from './SingleMatchSetupTab';
import MatchStartTab from './MatchStartTab';
import { MatchService } from '../../services/matchService';

type Tab = 'match-setup' | 'match-start';

const TeamManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as Tab) || 'match-setup';
  const [matchData, setMatchData] = useState<any>(null);
  const [, setMatchToken] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const savedToken = localStorage.getItem('activeMatchToken');
    if (savedToken) {
      setMatchToken(savedToken);
      fetchCurrentMatch(savedToken);
    }
  }, [key]);

  const fetchCurrentMatch = async (token: string) => {
    try {
      const response = await MatchService.getCurrentMatch(token);
      if (response.status >= 200 && response.status < 300 && response.data) {
        setMatchData({
          teamA: response.data.teamA,
          teamB: response.data.teamB,
          matchDetails: {
            status: response.data.status,
            match_date: response.data.match_date,
            venue: response.data.venue,
            format: response.data.format,
            umpire_1: response.data.umpire_1,
            umpire_2: response.data.umpire_2,
            match_id: response.data.id,
            toss_winner_team_id: response.data.toss_winner_team_id,
            batting_first_team_id: response.data.batting_first_team_id
          },
          matchToken: token
        });
      }
    } catch (error) {
      console.error('Error fetching current match:', error);
    }
  };

  return (
    <Box p="none" className="h-full">
      {/* Tab Navigation */}
      <Stack direction="row" gap="none" className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
        <button
          onClick={() => setSearchParams({ tab: 'match-setup' })}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 md:py-4 text-sm md:text-base font-medium transition-colors border-b-2 ${
            activeTab === 'match-setup'
              ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
              : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <FileText size={18} />
          <span className="hidden sm:inline">Match Setup</span>
          <span className="sm:hidden">Setup</span>
        </button>
        <button
          onClick={() => {
            if (matchData?.matchDetails?.status === 'SCHEDULED') {
              setSearchParams({ tab: 'match-start' });
            }
          }}
          disabled={matchData?.matchDetails?.status !== 'SCHEDULED'}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 md:py-4 text-sm md:text-base font-medium transition-colors border-b-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            activeTab === 'match-start'
              ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
              : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Play size={18} />
          <span className="hidden sm:inline">Match Start</span>
          <span className="sm:hidden">Start</span>
        </button>
      </Stack>

      <Box p="sm" className="md:p-6" key={key}>
        {activeTab === 'match-start' ?
          <MatchStartTab 
            matchData={matchData}
            onMatchStart={() => setSearchParams({tab: 'match-setup'})}
            onRefresh={() => setKey(prev => prev + 1)} 
             /> 
          : <SingleMatchSetupTab 
              matchData={matchData} 
              onRefresh={() => setKey(prev => prev + 1)} 
              onGoToMatchStart={() => setSearchParams({ tab: 'match-start' })}
            />}
      </Box>
    </Box>
  );
};

export default TeamManagement;
