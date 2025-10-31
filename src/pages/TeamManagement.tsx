import { useState } from 'react';
import Grid from '../components/ui/Grid';
import Form from '../components/ui/Form';
import useTeams from '../hooks/useTeams';

const TeamManagement = () => {
  const [teamName, setTeamName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState('');
  const [teamSuggestions, setTeamSuggestions] = useState<string[]>([]);
  
  const { searchTeams } = useTeams();

  const handleTeamSearch = async (query: string) => {
    console.log('Searching for:', query);
    const suggestions = await searchTeams(query);
    console.log('Got suggestions:', suggestions);
    setTeamSuggestions(suggestions);
  };

  const team1Inputs = [
    {
      type: 'search' as const,
      label: 'Team Name',
      placeholder: 'Search or enter team name...',
      value: teamName,
      onChange: setTeamName,
      suggestions: teamSuggestions,
      onSearch: handleTeamSearch,
      required: true,
      size: 'sm' as const
    },
    {
      type: 'search' as const,
      label: 'Player Name',
      placeholder: 'Search or enter player name...',
      value: playerName,
      onChange: setPlayerName,
      suggestions: ['Virat Kohli', 'MS Dhoni', 'Rohit Sharma'],
      onSearch: (query: string) => console.log('Searching players:', query),
      size: 'sm' as const
    },
    {
      type: 'select' as const,
      label: 'Player Role',
      placeholder: 'Select role...',
      value: playerRole,
      onChange: setPlayerRole,
      size: 'sm' as const,
      options: [
        { value: 'batsman', label: 'Batsman' },
        { value: 'bowler', label: 'Bowler' },
        { value: 'allrounder', label: 'All-rounder' },
        { value: 'wicketkeeper', label: 'Wicket Keeper' }
      ]
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[var(--text)] mb-6">Team Management</h1>
      
      <Grid cols={2} gap="md">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
          <Form 
            title="Team 1" 
            description="Build your first team"
            inputs={team1Inputs}
            submitText="Add Player"
            className="text-sm"
          >
            <button type="button" className="px-3 py-1.5 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg">
              Cancel
            </button>
          </Form>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
          <Form 
            title="Team 2" 
            description="Build your second team"
            inputs={team1Inputs}
            submitText="Save Team"
            className="text-sm"
          />
        </div>
      </Grid>
    </div>
  );
};

export default TeamManagement;