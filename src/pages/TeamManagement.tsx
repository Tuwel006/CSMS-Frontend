import { useState, useCallback, useRef } from 'react';
import Form from '../components/ui/Form';
import Input from '../components/ui/Input';
import { apiClient } from '../utils/api';

interface Team {
  id: number;
  name: string;
  location: string;
}

const TeamManagement = () => {
  // Team 1 state
  const [team1Name, setTeam1Name] = useState('');
  const [team1Location, setTeam1Location] = useState('');
  const [team1Id, setTeam1Id] = useState('');

  const handleTeam1NameChange = (value: string) => {
    setTeam1Name(value);
    debouncedSearchTeam1(value, team1Location, team1Id);
  };

  const handleTeam1LocationChange = (value: string) => {
    setTeam1Location(value);
    debouncedSearchTeam1(team1Name, value, team1Id);
  };

  const handleTeam1IdChange = (value: string) => {
    setTeam1Id(value);
    debouncedSearchTeam1(team1Name, team1Location, value);
  };
  const [team1PlayerName, setTeam1PlayerName] = useState('');
  const [team1PlayerRole, setTeam1PlayerRole] = useState('');
  const [team1Suggestions, setTeam1Suggestions] = useState<Team[]>([]);
  const [showTeam1Dropdown, setShowTeam1Dropdown] = useState(false);
  
  // Team 2 state
  const [team2Name, setTeam2Name] = useState('');
  const [team2Location, setTeam2Location] = useState('');
  const [team2Id, setTeam2Id] = useState('');

  const handleTeam2NameChange = (value: string) => {
    setTeam2Name(value);
    debouncedSearchTeam2(value, team2Location, team2Id);
  };

  const handleTeam2LocationChange = (value: string) => {
    setTeam2Location(value);
    debouncedSearchTeam2(team2Name, value, team2Id);
  };

  const handleTeam2IdChange = (value: string) => {
    setTeam2Id(value);
    debouncedSearchTeam2(team2Name, team2Location, value);
  };
  const [team2PlayerName, setTeam2PlayerName] = useState('');
  const [team2PlayerRole, setTeam2PlayerRole] = useState('');
  const [team2Suggestions, setTeam2Suggestions] = useState<Team[]>([]);
  const [showTeam2Dropdown, setShowTeam2Dropdown] = useState(false);
  
  const searchTeam1Timeout = useRef<number>();
  const searchTeam2Timeout = useRef<number>();


  const debouncedSearchTeam1 = useCallback(
    (name: string, location: string, id: string) => {
      const searchFunction = async () => {
        if (name || location || id) {
          try {
            const params: Record<string, string> = {};
            if (name) params.name = name;
            if (location) params.location = location;
            if (id) params.id = id;
            
            const response = await apiClient.get<Team[]>('/teams/search', params);
            console.log('Team1 API Response:', response);
            
            const teams = response.data || [];
            console.log('Processed teams:', teams);
            console.log('Setting dropdown visible:', teams.length > 0);
            
            setTeam1Suggestions(teams);
            setShowTeam1Dropdown(teams.length > 0);
          } catch (error) {
            console.error('Search error:', error);
            setShowTeam1Dropdown(false);
          }
        } else {
          setShowTeam1Dropdown(false);
        }
      };
      
      if (searchTeam1Timeout.current) window.clearTimeout(searchTeam1Timeout.current);
      searchTeam1Timeout.current = window.setTimeout(searchFunction, 300);
    },
    [setTeam1Suggestions, setShowTeam1Dropdown]
  );

  const debouncedSearchTeam2 = useCallback(
    (name: string, location: string, id: string) => {
      const searchFunction = async () => {
        if (name || location || id) {
          try {
            const params: Record<string, string> = {};
            if (name) params.name = name;
            if (location) params.location = location;
            if (id) params.id = id;
            
            const response = await apiClient.get<Team[]>('/teams/search', params);
            console.log('Team2 API Response:', response);
            
            const teams = response.data || [];
            console.log('Processed teams:', teams);
            console.log('Setting dropdown visible:', teams.length > 0);
            
            setTeam2Suggestions(teams);
            setShowTeam2Dropdown(teams.length > 0);
          } catch (error) {
            console.error('Search error:', error);
            setShowTeam2Dropdown(false);
          }
        } else {
          setShowTeam2Dropdown(false);
        }
      };
      
      if (searchTeam2Timeout.current) window.clearTimeout(searchTeam2Timeout.current);
      searchTeam2Timeout.current = window.setTimeout(searchFunction, 300);
    },
    [setTeam2Suggestions, setShowTeam2Dropdown]
  );



  const handleTeam1Select = (team: Team) => {
    setTeam1Name(team.name);
    setTeam1Location(team.location);
    setTeam1Id(team.id.toString());
    setShowTeam1Dropdown(false);
  };

  const handleTeam2Select = (team: Team) => {
    setTeam2Name(team.name);
    setTeam2Location(team.location);
    setTeam2Id(team.id.toString());
    setShowTeam2Dropdown(false);
  };



  const team1Inputs = [
    {
      type: 'search' as const,
      label: 'Player Name',
      placeholder: 'Search or enter player name...',
      value: team1PlayerName,
      onChange: setTeam1PlayerName,
      suggestions: ['Virat Kohli', 'MS Dhoni', 'Rohit Sharma'],
      onSearch: (query: string) => console.log('Searching players:', query),
      size: 'sm' as const
    },
    {
      type: 'select' as const,
      label: 'Player Role',
      placeholder: 'Select role...',
      value: team1PlayerRole,
      onChange: setTeam1PlayerRole,
      size: 'sm' as const,
      options: [
        { value: 'batsman', label: 'Batsman' },
        { value: 'bowler', label: 'Bowler' },
        { value: 'allrounder', label: 'All-rounder' },
        { value: 'wicketkeeper', label: 'Wicket Keeper' }
      ]
    }
  ];

  const team2Inputs = [
    {
      type: 'search' as const,
      label: 'Player Name',
      placeholder: 'Search or enter player name...',
      value: team2PlayerName,
      onChange: setTeam2PlayerName,
      suggestions: ['Virat Kohli', 'MS Dhoni', 'Rohit Sharma'],
      onSearch: (query: string) => console.log('Searching players:', query),
      size: 'sm' as const
    },
    {
      type: 'select' as const,
      label: 'Player Role',
      placeholder: 'Select role...',
      value: team2PlayerRole,
      onChange: setTeam2PlayerRole,
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
    <div className="p-2 md:p-6">
      <h1 className="text-2xl font-bold text-[var(--text)] mb-6">Team Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Team 1</h3>
          <p className="text-sm text-gray-600 mb-4">Build your first team</p>
          
          <div className="relative">
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                label="Name"
                placeholder="Search by name..."
                value={team1Name}
                onChange={handleTeam1NameChange}
                size="sm"
                className="flex-1"
              />
              <Input
                type="text"
                label="Location"
                placeholder="Search by location..."
                value={team1Location}
                onChange={handleTeam1LocationChange}
                size="sm"
                className="flex-1"
              />
              <Input
                type="text"
                label="ID"
                placeholder="Search by ID..."
                value={team1Id}
                onChange={handleTeam1IdChange}
                size="sm"
                className="flex-1"
              />
            </div>
            {showTeam1Dropdown && team1Suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {team1Suggestions.map((team, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-[var(--hover-bg)] cursor-pointer text-sm text-[var(--text)]"
                    onClick={() => handleTeam1Select(team)}
                  >
                    {team.name} - {team.location} - ({team.id})
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Form 
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
          <h3 className="text-lg font-semibold mb-2">Team 2</h3>
          <p className="text-sm text-gray-600 mb-4">Build your second team</p>
          
          <div className="relative">
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                label="Name"
                placeholder="Search by name..."
                value={team2Name}
                onChange={handleTeam2NameChange}
                size="sm"
                className="flex-1"
              />
              <Input
                type="text"
                label="Location"
                placeholder="Search by location..."
                value={team2Location}
                onChange={handleTeam2LocationChange}
                size="sm"
                className="flex-1"
              />
              <Input
                type="text"
                label="ID"
                placeholder="Search by ID..."
                value={team2Id}
                onChange={handleTeam2IdChange}
                size="sm"
                className="flex-1"
              />
            </div>
            {showTeam2Dropdown && team2Suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-20 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md shadow-lg max-h-48 overflow-y-auto">
                {team2Suggestions.map((team, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-[var(--hover-bg)] cursor-pointer text-sm text-[var(--text)]"
                    onClick={() => handleTeam2Select(team)}
                  >
                    {team.name} - {team.location} - ({team.id})
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Form 
            inputs={team2Inputs}
            submitText="Save Team"
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;