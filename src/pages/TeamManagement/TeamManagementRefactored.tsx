import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Calendar } from 'lucide-react';
import { Box, Stack, Card, Text, Stepper, RadioGroup } from '../../components/ui/lib';
import Button from '../../components/ui/Button';
=======
import { useSearchParams } from 'react-router-dom';
import { Box, Stack, IconButton } from '../../components/ui/lib';
import { FileText, Play } from 'lucide-react';
>>>>>>> 87c46b1 (feat: Add Text and Tooltip components for UI consistency)
import SingleMatchSetupTab from './SingleMatchSetupTab';
import MatchStartTab from './MatchStartTab';
import { MatchService } from '../../services/matchService';

<<<<<<< HEAD
type MatchType = 'single' | 'tournament';
type FlowStep = 'select-type' | 'setup-teams' | 'start-match';

const TeamManagementRefactored = () => {
  const navigate = useNavigate();
  const [matchType, setMatchType] = useState<MatchType>('single');
  const [currentStep, setCurrentStep] = useState<FlowStep>('select-type');
  const [matchData, setMatchData] = useState<any>(null);
  const [matchToken, setMatchToken] = useState<string | null>(null);
=======
type Tab = 'match-setup' | 'match-start';

const TeamManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as Tab) || 'match-setup';
  const [matchData, setMatchData] = useState<any>(null);
  const [, setMatchToken] = useState<string | null>(null);
>>>>>>> 87c46b1 (feat: Add Text and Tooltip components for UI consistency)
  const [key, setKey] = useState(0);

  useEffect(() => {
    const savedToken = localStorage.getItem('activeMatchToken');
    if (savedToken) {
      setMatchToken(savedToken);
      fetchCurrentMatch(savedToken);
<<<<<<< HEAD
      setCurrentStep('setup-teams');
=======
>>>>>>> 87c46b1 (feat: Add Text and Tooltip components for UI consistency)
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
<<<<<<< HEAD
        
        // Auto-navigate to start-match if scheduled
        if (response.data.status === 'SCHEDULED') {
          setCurrentStep('start-match');
        }
=======
>>>>>>> 87c46b1 (feat: Add Text and Tooltip components for UI consistency)
      }
    } catch (error) {
      console.error('Error fetching current match:', error);
    }
  };

<<<<<<< HEAD
  const steps = [
    { label: 'Match Type', description: 'Choose format' },
    { label: 'Setup Teams', description: 'Create teams' },
    { label: 'Start Match', description: 'Begin playing' }
  ];

  const getStepIndex = () => {
    switch (currentStep) {
      case 'select-type': return 0;
      case 'setup-teams': return 1;
      case 'start-match': return 2;
      default: return 0;
    }
  };

  const matchTypeOptions = [
    {
      value: 'single',
      label: 'Single Match',
      description: 'Quick match between two teams',
      icon: <Users size={24} className="text-blue-600" />
    },
    {
      value: 'tournament',
      label: 'Tournament',
      description: 'Multiple teams, multiple matches',
      icon: <Trophy size={24} className="text-yellow-600" />
    }
  ];

  const handleMatchTypeSelect = () => {
    if (matchType === 'tournament') {
      // TODO: Implement tournament flow
      alert('Tournament mode coming soon!');
      return;
    }
    setCurrentStep('setup-teams');
  };

  const handleGoToMatchStart = () => {
    setCurrentStep('start-match');
  };

  const handleMatchStart = () => {
    navigate('/admin/score-edit');
  };

  return (
    <Box className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 sm:p-4">
      <Box className="max-w-7xl mx-auto">
        {/* Header */}
        <Stack direction="col" gap="md" className="mb-6">
          <Stack direction="row" justify="between" align="center">
            <Stack direction="col" gap="xs">
              <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Team Management
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Set up your match and manage teams
              </Text>
            </Stack>
          </Stack>

          {/* Stepper */}
          {currentStep !== 'select-type' && (
            <Card bodyClassName="p-4">
              <Stepper 
                steps={steps} 
                currentStep={getStepIndex()}
                onStepClick={(step) => {
                  if (step === 0) setCurrentStep('select-type');
                  if (step === 1 && matchToken) setCurrentStep('setup-teams');
                }}
              />
            </Card>
          )}
        </Stack>

        {/* Content */}
        {currentStep === 'select-type' && (
          <Card bodyClassName="p-6">
            <Stack direction="col" gap="lg">
              <Stack direction="col" gap="xs" align="center" className="text-center">
                <Calendar size={48} className="text-blue-600 mb-2" />
                <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Choose Match Type
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Select how you want to organize your cricket match
                </Text>
              </Stack>

              <RadioGroup
                name="matchType"
                options={matchTypeOptions}
                value={matchType}
                onChange={(value) => setMatchType(value as MatchType)}
              />

              <Stack direction="row" justify="center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleMatchTypeSelect}
                  className="px-8"
                >
                  Continue
                </Button>
              </Stack>
            </Stack>
          </Card>
        )}

        {currentStep === 'setup-teams' && (
          <Box key={key}>
            <SingleMatchSetupTab
              matchData={matchData}
              onRefresh={() => setKey(prev => prev + 1)}
              onGoToMatchStart={handleGoToMatchStart}
            />
          </Box>
        )}

        {currentStep === 'start-match' && (
          <Box>
            <MatchStartTab
              matchData={matchData}
              onMatchStart={handleMatchStart}
              onRefresh={() => setKey(prev => prev + 1)}
            />
          </Box>
        )}
=======
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
>>>>>>> 87c46b1 (feat: Add Text and Tooltip components for UI consistency)
      </Box>
    </Box>
  );
};

<<<<<<< HEAD
export default TeamManagementRefactored;
=======
export default TeamManagement;
>>>>>>> 87c46b1 (feat: Add Text and Tooltip components for UI consistency)
