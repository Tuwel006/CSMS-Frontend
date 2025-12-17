import { useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import SingleMatchSetupTab from './SingleMatchSetupTab';
import MatchStartTab from './MatchStartTab';

type Tab = 'match-setup' | 'match-start';

const TeamManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as Tab) || 'match-setup';

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
      <div className="grid grid-cols-2 gap-0 border-b border-[var(--card-border)]">
        <Button
          variant="ghost"
          onClick={() => setSearchParams({ tab: 'match-setup' })}
          className={`rounded-none relative border-r border-gray-300 dark:border-gray-700 ${
            activeTab === 'match-setup'
              ? 'text-blue-600 dark:text-blue-400 !bg-transparent'
              : 'text-[var(--text-secondary)]'
          }`}
          style={{
            backgroundColor: activeTab === 'match-setup' ? 'transparent' : 'var(--hover-bg)'
          }}
          size='lg'
        >
          Single Match Setup
          {activeTab === 'match-setup' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400"></div>
          )}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setSearchParams({ tab: 'match-start' })}
          className={`rounded-none relative border-l border-gray-300 dark:border-gray-700 ${
            activeTab === 'match-start'
              ? 'text-blue-600 dark:text-blue-400 !bg-transparent'
              : 'text-[var(--text-secondary)]'
          }`}
          style={{
            backgroundColor: activeTab === 'match-start' ? 'transparent' : 'var(--hover-bg)'
          }}
        >
          Match Start
          {activeTab === 'match-start' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400"></div>
          )}
        </Button>
      </div>

      <div className="p-2 md:p-6">
        {activeTab === 'match-start' ? <MatchStartTab /> : <SingleMatchSetupTab />}
      </div>
    </div>
  );
};

export default TeamManagement;
