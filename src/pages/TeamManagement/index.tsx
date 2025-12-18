import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import SingleMatchSetupTab from './SingleMatchSetupTab';
import MatchStartTab from './MatchStartTab';

type Tab = 'match-setup' | 'match-start';

const TeamManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as Tab) || 'match-setup';
  const [matchData, setMatchData] = useState<any>(null);

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
          onClick={() => setSearchParams({ tab: 'match-start' })}
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

      <div className="p-2 md:p-6">
        {activeTab === 'match-start' ? <MatchStartTab matchData={matchData} /> : <SingleMatchSetupTab onStartMatch={(data) => { setMatchData(data); setSearchParams({ tab: 'match-start' }); }} />}
      </div>
    </div>
  );
};

export default TeamManagement;
