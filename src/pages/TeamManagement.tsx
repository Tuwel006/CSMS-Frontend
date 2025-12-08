import { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from '../components/ui/Form';
import Button from '../components/ui/Button';
import MultiFieldSearch from '../components/ui/MultiFieldSearch';
import { TeamService } from '../services/teamService';
import { Team } from '../services/teamService';
import { PlayerService } from '../services/playerService';
import { RootState } from '../store';
import {
  setTeam1,
  setTeam2,
  resetTeam1,
  resetTeam2,
} from '../store/slices/teamManagementSlice';

const TeamManagement = () => {
  const dispatch = useDispatch();
  const { team1, team2 } = useSelector((state: RootState) => state.teamManagement);

  // Remove old localStorage item
  useEffect(() => {
    localStorage.removeItem('teamManagementForm');
  }, []);

  // Team 1 state
  const [team1Suggestions, setTeam1Suggestions] = useState<Team[] | []>([]);
  const [showTeam1Dropdown, setShowTeam1Dropdown] = useState(false);
  const [team1PlayerSuggestions, setTeam1PlayerSuggestions] = useState<any[]>([]);
  const [showTeam1PlayerDropdown, setShowTeam1PlayerDropdown] = useState(false);

  // Team 2 state
  const [team2Suggestions, setTeam2Suggestions] = useState<Team[] | []>([]);
  const [showTeam2Dropdown, setShowTeam2Dropdown] = useState(false);
  const [team2PlayerSuggestions, setTeam2PlayerSuggestions] = useState<any[]>([]);
  const [showTeam2PlayerDropdown, setShowTeam2PlayerDropdown] = useState(false);

  // Local state for player inputs (since they are added to a list)
  const [team1PlayerName, setTeam1PlayerName] = useState('');
  const [team1PlayerId, setTeam1PlayerId] = useState('');
  const [team1PlayerRole, setTeam1PlayerRole] = useState('');

  const [team2PlayerName, setTeam2PlayerName] = useState('');
  const [team2PlayerId, setTeam2PlayerId] = useState('');
  const [team2PlayerRole, setTeam2PlayerRole] = useState('');

  const handleTeam1NameChange = (value: string) => {
    dispatch(setTeam1({ name: value, id: null })); // Clear ID on manual change
    debouncedSearchTeam1(value, team1.location, '');
  };

  const handleTeam1LocationChange = (value: string) => {
    dispatch(setTeam1({ location: value }));
    debouncedSearchTeam1(team1.name, value, team1.id || '');
  };

  const handleTeam1IdChange = (value: string) => {
    dispatch(setTeam1({ id: value }));
    debouncedSearchTeam1(team1.name, team1.location, value);
  };

  const handleTeam2NameChange = (value: string) => {
    dispatch(setTeam2({ name: value, id: null }));
    debouncedSearchTeam2(value, team2.location, '');
  };

  const handleTeam2LocationChange = (value: string) => {
    dispatch(setTeam2({ location: value }));
    debouncedSearchTeam2(team2.name, value, team2.id || '');
  };

  const handleTeam2IdChange = (value: string) => {
    dispatch(setTeam2({ id: value }));
    debouncedSearchTeam2(team2.name, team2.location, value);
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
            const teams = response?.data?.data || [];
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
    []
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
            const teams = response?.data?.data || [];
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
    []
  );

  const handleTeam1Select = (team: Team) => {
    dispatch(setTeam1({ name: team.name, location: team.location, id: team.id.toString() }));
    setShowTeam1Dropdown(false);
  };

  const handleTeam2Select = (team: Team) => {
    dispatch(setTeam2({ name: team.name, location: team.location, id: team.id.toString() }));
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
    setTeam1PlayerId(''); // Clear ID on manual change
    debouncedSearchPlayer1(value, '');
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
    setTeam2PlayerId(''); // Clear ID on manual change
    debouncedSearchPlayer2(value, '');
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

  const handleClearTeam1 = () => {
    dispatch(resetTeam1());
  };

  const handleClearTeam1Player = () => {
    setTeam1PlayerName('');
    setTeam1PlayerId('');
  };

  const handleClearTeam2 = () => {
    dispatch(resetTeam2());
  };

  const handleClearTeam2Player = () => {
    setTeam2PlayerName('');
    setTeam2PlayerId('');
  };

  return (
    <div className="p-2 md:p-6">
      <h1 className="text-2xl font-bold text-[var(--text)] mb-6">Team Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Team 1</h3>
          <p className="text-sm text-gray-600 mb-4">Build your first team</p>

          <MultiFieldSearch
            fields={[
              { label: 'Name', placeholder: 'Search by name...', value: team1.name, onChange: handleTeam1NameChange, className: 'flex-1' },
              { label: 'Location', placeholder: 'Search by location...', value: team1.location, onChange: handleTeam1LocationChange, className: 'flex-1' },
              { label: 'ID', placeholder: 'Search by ID...', value: team1.id || '', onChange: handleTeam1IdChange, className: 'w-20' }
            ]}
            suggestions={team1Suggestions}
            showDropdown={showTeam1Dropdown}
            onSelect={handleTeam1Select}
            renderSuggestion={(team) => `${team.name} - ${team.location} - (${team.id})`}
            actions={
              <>
                <Button variant="secondary" onClick={handleClearTeam1}>Clear</Button>
                <Button variant="primary">Save</Button>
              </>
            }
          />

          <MultiFieldSearch
            fields={[
              { label: 'Player Name', placeholder: 'Search by name...', value: team1PlayerName, onChange: handleTeam1PlayerNameChange, className: 'flex-1' },
              { label: 'Player ID', placeholder: 'Search by ID...', value: team1PlayerId, onChange: handleTeam1PlayerIdChange, className: 'w-20' }
            ]}
            suggestions={team1PlayerSuggestions}
            showDropdown={showTeam1PlayerDropdown}
            onSelect={handleTeam1PlayerSelect}
            renderSuggestion={(player) => `${player.name} - (${player.id})`}
            className="z-20"
            actions={
              <>
                <Button variant="secondary" onClick={handleClearTeam1Player}>Clear</Button>
                <Button variant="primary">Save</Button>
              </>
            }
          />

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

          <MultiFieldSearch
            fields={[
              { label: 'Name', placeholder: 'Search by name...', value: team2.name, onChange: handleTeam2NameChange, className: 'flex-1' },
              { label: 'Location', placeholder: 'Search by location...', value: team2.location, onChange: handleTeam2LocationChange, className: 'flex-1' },
              { label: 'ID', placeholder: 'Search by ID...', value: team2.id || '', onChange: handleTeam2IdChange, className: 'w-20' }
            ]}
            suggestions={team2Suggestions}
            showDropdown={showTeam2Dropdown}
            onSelect={handleTeam2Select}
            renderSuggestion={(team) => `${team.name} - ${team.location} - (${team.id})`}
            actions={
              <>
                <Button variant="secondary" onClick={handleClearTeam2}>Clear</Button>
                <Button variant="primary">Save</Button>
              </>
            }
          />

          <MultiFieldSearch
            fields={[
              { label: 'Player Name', placeholder: 'Search by name...', value: team2PlayerName, onChange: handleTeam2PlayerNameChange, className: 'flex-1' },
              { label: 'Player ID', placeholder: 'Search by ID...', value: team2PlayerId, onChange: handleTeam2PlayerIdChange, className: 'w-20' }
            ]}
            suggestions={team2PlayerSuggestions}
            showDropdown={showTeam2PlayerDropdown}
            onSelect={handleTeam2PlayerSelect}
            renderSuggestion={(player) => `${player.name} - (${player.id})`}
            className="z-20"
            actions={
              <>
                <Button variant="secondary" onClick={handleClearTeam2Player}>Clear</Button>
                <Button variant="primary">Save</Button>
              </>
            }
          />

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