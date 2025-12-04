import { useState, useCallback, useRef, useEffect } from 'react';
import Form from '../components/ui/Form';
import Input from '../components/ui/Input';
import { TeamService } from '../services/teamService';
import { Team } from '../services/teamService';
import { PlayerService } from '../services/playerService';

const TeamManagement = () => {
  // Load initial state from localStorage
  const loadFormData = () => {
    const saved = localStorage.getItem('teamManagementForm');
    return saved ? JSON.parse(saved) : {};
  };

  const savedData = loadFormData();

  // Team 1 state
  const [team1Name, setTeam1Name] = useState(savedData.team1Name || '');
  const [team1Location, setTeam1Location] = useState(savedData.team1Location || '');
  const [team1Id, setTeam1Id] = useState(savedData.team1Id || '');
  const [team1PlayerName, setTeam1PlayerName] = useState(savedData.team1PlayerName || '');
  const [team1PlayerId, setTeam1PlayerId] = useState(savedData.team1PlayerId || '');
  const [team1PlayerRole, setTeam1PlayerRole] = useState(savedData.team1PlayerRole || '');
  const [team1Suggestions, setTeam1Suggestions] = useState<Team[] | []>([]);
  const [showTeam1Dropdown, setShowTeam1Dropdown] = useState(false);
  const [team1PlayerSuggestions, setTeam1PlayerSuggestions] = useState<any[]>([]);
  const [showTeam1PlayerDropdown, setShowTeam1PlayerDropdown] = useState(false);
  
  // Team 2 state
  const [team2Name, setTeam2Name] = useState(savedData.team2Name || '');
  const [team2Location, setTeam2Location] = useState(savedData.team2Location || '');
  const [team2Id, setTeam2Id] = useState(savedData.team2Id || '');
  const [team2PlayerName, setTeam2PlayerName] = useState(savedData.team2PlayerName || '');
  const [team2PlayerId, setTeam2PlayerId] = useState(savedData.team2PlayerId || '');
  const [team2PlayerRole, setTeam2PlayerRole] = useState(savedData.team2PlayerRole || '');
  const [team2Suggestions, setTeam2Suggestions] = useState<Team[] | []>([]);
  const [showTeam2Dropdown, setShowTeam2Dropdown] = useState(false);
  const [team2PlayerSuggestions, setTeam2PlayerSuggestions] = useState<any[]>([]);
  const [showTeam2PlayerDropdown, setShowTeam2PlayerDropdown] = useState(false);

  // Save form data to localStorage whenever state changes
  useEffect(() => {
    const formData = {
      team1Name, team1Location, team1Id, team1PlayerName, team1PlayerId, team1PlayerRole,
      team2Name, team2Location, team2Id, team2PlayerName, team2PlayerId, team2PlayerRole
    };
    localStorage.setItem('teamManagementForm', JSON.stringify(formData));
  }, [team1Name, team1Location, team1Id, team1PlayerName, team1PlayerId, team1PlayerRole, team2Name, team2Location, team2Id, team2PlayerName, team2PlayerId, team2PlayerRole]);

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
  
  const searchTeam1Timeout = useRef<number>(null);
  const searchTeam2Timeout = useRef<number>(null);
  const searchPlayer1Timeout = useRef<number>(null);
  const searchPlayer2Timeout = useRef<number>(null);

  const debouncedSearchTeam1 = useCallback(
    (name: string, location: string, id: string) => {
      const searchFunction = async () => {
        if (name || location || id) {
          try {
            const params: Record<string, string> = {};
            if (name) params.name = name;
            if (location) params.location = location;
            if (id) params.id = id;
            
            const response = await TeamService.search(params);
            console.log('Team1 API Response:', response);
            
            // Handle nested response structure: response.data.data
            const teams = response?.data?.data || [];
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
            
            const response = await TeamService.search(params);
            console.log('Team2 API Response:', response);
            
            // Handle nested response structure: response.data.data
            const teams = response?.data?.data || [];
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



  const debouncedSearchPlayer1 = useCallback(
    (name: string, id: string) => {
      const searchFunction = async () => {
        if (name || id) {
          try {
            const params: Record<string, string> = {};
            if (name) params.name = name;
            if (id) params.id = id;
            
            const response = await PlayerService.search(params);
            // Handle nested response structure: response.data.data
            const players = response?.data?.data || [];
            setTeam1PlayerSuggestions(players);
            setShowTeam1PlayerDropdown(players.length > 0);
          } catch (error) {
            console.error('Player search error:', error);
            setShowTeam1PlayerDropdown(false);
          }
        } else {
          setShowTeam1PlayerDropdown(false);
        }
      };
      
      if (searchPlayer1Timeout.current) window.clearTimeout(searchPlayer1Timeout.current);
      searchPlayer1Timeout.current = window.setTimeout(searchFunction, 300);
    },
    []
  );

  const handleTeam1PlayerNameChange = (value: string) => {
    setTeam1PlayerName(value);
    debouncedSearchPlayer1(value, team1PlayerId);
  };

  const handleTeam1PlayerIdChange = (value: string) => {
    setTeam1PlayerId(value);
    debouncedSearchPlayer1(team1PlayerName, value);
  };

  const handleTeam1PlayerSelect = (player: any) => {
    setTeam1PlayerName(player.name);
    setTeam1PlayerId(player.id.toString());
    setShowTeam1PlayerDropdown(false);
  };

  const handleTeam1PlayerRoleChange = (value: string) => {
    setTeam1PlayerRole(value);
  };

  const team1Inputs = [
    {
      type: 'select' as const,
      label: 'Player Role',
      placeholder: 'Select role...',
      value: team1PlayerRole,
      onChange: handleTeam1PlayerRoleChange,
      size: 'md' as const,
      options: [
        { value: 'batsman', label: 'Batsman' },
        { value: 'bowler', label: 'Bowler' },
        { value: 'allrounder', label: 'All-rounder' },
        { value: 'wicketkeeper', label: 'Wicket Keeper' }
      ]
    }
  ];

  const debouncedSearchPlayer2 = useCallback(
    (name: string, id: string) => {
      const searchFunction = async () => {
        if (name || id) {
          try {
            const params: Record<string, string> = {};
            if (name) params.name = name;
            if (id) params.id = id;
            
            const response = await PlayerService.search(params);
            // Handle nested response structure: response.data.data
            const players = response?.data?.data || [];
            setTeam2PlayerSuggestions(players);
            setShowTeam2PlayerDropdown(players.length > 0);
          } catch (error) {
            console.error('Player search error:', error);
            setShowTeam2PlayerDropdown(false);
          }
        } else {
          setShowTeam2PlayerDropdown(false);
        }
      };
      
      if (searchPlayer2Timeout.current) window.clearTimeout(searchPlayer2Timeout.current);
      searchPlayer2Timeout.current = window.setTimeout(searchFunction, 300);
    },
    []
  );

  const handleTeam2PlayerNameChange = (value: string) => {
    setTeam2PlayerName(value);
    debouncedSearchPlayer2(value, team2PlayerId);
  };

  const handleTeam2PlayerIdChange = (value: string) => {
    setTeam2PlayerId(value);
    debouncedSearchPlayer2(team2PlayerName, value);
  };

  const handleTeam2PlayerSelect = (player: any) => {
    setTeam2PlayerName(player.name);
    setTeam2PlayerId(player.id.toString());
    setShowTeam2PlayerDropdown(false);
  };

  const handleTeam2PlayerRoleChange = (value: string) => {
    setTeam2PlayerRole(value);
  };

  const team2Inputs = [
    {
      type: 'select' as const,
      label: 'Player Role',
      placeholder: 'Select role...',
      value: team2PlayerRole,
      onChange: handleTeam2PlayerRoleChange,
      size: 'md' as const,
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
                size="md"
                className="flex-1"
              />
              <Input
                type="text"
                label="Location"
                placeholder="Search by location..."
                value={team1Location}
                onChange={handleTeam1LocationChange}
                size="md"
                className="flex-1"
              />
              <Input
                type="text"
                label="ID"
                placeholder="Search by ID..."
                value={team1Id}
                onChange={handleTeam1IdChange}
                size="md"
                className="flex-1"
              />
            </div>
            {showTeam1Dropdown && team1Suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md shadow-lg max-h-48 overflow-y-auto">
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
          
          <div className="relative">
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                label="Player Name"
                placeholder="Search by name..."
                value={team1PlayerName}
                onChange={handleTeam1PlayerNameChange}
                size="md"
                className="flex-1"
              />
              <Input
                type="text"
                label="Player ID"
                placeholder="Search by ID..."
                value={team1PlayerId}
                onChange={handleTeam1PlayerIdChange}
                size="md"
                className="flex-1"
              />
            </div>
            {showTeam1PlayerDropdown && team1PlayerSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-20 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md shadow-lg max-h-48 overflow-y-auto">
                {team1PlayerSuggestions.map((player, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-[var(--hover-bg)] cursor-pointer text-sm text-[var(--text)]"
                    onClick={() => handleTeam1PlayerSelect(player)}
                  >
                    {player.name} - ({player.id})
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
                size="md"
                className="flex-1"
              />
              <Input
                type="text"
                label="Location"
                placeholder="Search by location..."
                value={team2Location}
                onChange={handleTeam2LocationChange}
                size="md"
                className="flex-1"
              />
              <Input
                type="text"
                label="ID"
                placeholder="Search by ID..."
                value={team2Id}
                onChange={handleTeam2IdChange}
                size="md"
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
          
          <div className="relative">
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                label="Player Name"
                placeholder="Search by name..."
                value={team2PlayerName}
                onChange={handleTeam2PlayerNameChange}
                size="md"
                className="flex-1"
              />
              <Input
                type="text"
                label="Player ID"
                placeholder="Search by ID..."
                value={team2PlayerId}
                onChange={handleTeam2PlayerIdChange}
                size="md"
                className="flex-1"
              />
            </div>
            {showTeam2PlayerDropdown && team2PlayerSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-20 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md shadow-lg max-h-48 overflow-y-auto">
                {team2PlayerSuggestions.map((player, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-[var(--hover-bg)] cursor-pointer text-sm text-[var(--text)]"
                    onClick={() => handleTeam2PlayerSelect(player)}
                  >
                    {player.name} - ({player.id})
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