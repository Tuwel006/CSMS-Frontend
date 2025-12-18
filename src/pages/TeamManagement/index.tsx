import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import SingleMatchSetupTab from './SingleMatchSetupTab';
import MatchStartTab from './MatchStartTab';
import { MatchService } from '../../services/matchService';

type Tab = 'match-setup' | 'match-start';

const TeamManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as Tab) || 'match-setup';
  const [matchData, setMatchData] = useState<any>(null);
  const [matchToken, setMatchToken] = useState<string | null>(null);
  const [key, setKey] = useState(0);
console.log("key:   ", key);
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
            match_id: response.data.id
          },
          matchToken: token
        });
      }
    } catch (error) {
      console.error('Error fetching current match:', error);
    }
  };





  return (
    <div className="team-management-page">
      <style>{`
        .team-management-page input,
        .team-management-page button,
        .team-management-page select,
        .team-management-page .rounded,
        .team-management-page .rounded-sm,
        .team-management-page .rounded-md,
        .team-management-page .rounded-lg,
        .team-management-page .rounded-xl {
          border-radius: 0.25rem !important;
        }
      `}</style>
      
      {/* Tab Navigation */}
      <div className="grid grid-cols-2 gap-0 border border-[var(--card-border)]">
        <Button
          variant="ghost"
          onClick={() => setSearchParams({ tab: 'match-setup' })}
          className={`!rounded-none border-r border-[var(--card-border)] ${
            activeTab === 'match-setup'
              ? 'text-blue-600 dark:text-blue-400 !bg-transparent'
              : 'text-[var(--text-secondary)]'
          }`}
          style={{
            backgroundColor: activeTab === 'match-setup' ? 'transparent' : 'var(--hover-bg)',
            borderRadius: '0 !important'
          }}
          size='lg'
        >
          Single Match Setup
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => {
            if (matchData?.matchDetails?.status === 'SCHEDULED') {
              setSearchParams({ tab: 'match-start' });
            }
          }}
          disabled={matchData?.matchDetails?.status !== 'SCHEDULED'}
          className={`!rounded-none ${
            activeTab === 'match-start'
              ? 'text-blue-600 dark:text-blue-400 !bg-transparent'
              : 'text-[var(--text-secondary)]'
          }`}
          style={{
            backgroundColor: activeTab === 'match-start' ? 'transparent' : 'var(--hover-bg)',
            borderRadius: '0 !important'
          }}
        >
          Match Start
        </Button>
      </div>

      <div className="p-2 md:p-6" key={key}>
        {activeTab === 'match-start' ?
          <MatchStartTab 
            matchData={matchData} /> 
          : <SingleMatchSetupTab 
              matchData={matchData} 
              onRefresh={() => setKey(prev => prev + 1)} 
              onGoToMatchStart={() => setSearchParams({ tab: 'match-start' })}
            />}
      </div>
    </div>
  );
};

export default TeamManagement;
