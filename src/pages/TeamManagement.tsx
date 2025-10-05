import { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Save } from 'lucide-react';
import { type Team, type Player } from '../types/match';
import Input from '../components/ui/Input';
import Form from '../components/ui/Form';

// Stateless components
const PlayerForm = ({ 
  onAddPlayer, 
  playerName, 
  setPlayerName, 
  playerRole, 
  setPlayerRole 
}: {
  onAddPlayer: (e: React.FormEvent) => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  playerRole: Player['role'];
  setPlayerRole: (role: Player['role']) => void;
}) => (
  <Form onSubmit={onAddPlayer} variant="minimal" layout="single" containerClassName="mb-4">
    <div className="flex gap-2">
      <Input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Player name"
        className="flex-1"
        size="sm"
      />
      <select
        value={playerRole}
        onChange={(e) => setPlayerRole(e.target.value as Player['role'])}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="batsman">Batsman</option>
        <option value="bowler">Bowler</option>
        <option value="allrounder">All-rounder</option>
        <option value="wicketkeeper">Wicket Keeper</option>
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus size={16} />
        Add
      </button>
    </div>
  </Form>
);

const TeamCard = ({ 
  team, 
  onNameChange, 
  onRemovePlayer, 
  onTogglePlaying11,
  playerForm
}: {
  team: Omit<Team, 'id'>;
  onNameChange: (name: string) => void;
  onRemovePlayer: (playerId: string) => void;
  onTogglePlaying11: (playerId: string) => void;
  playerForm: React.ReactNode;
}) => (
  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
    <h3 className="text-lg font-semibold text-[var(--text)] mb-4">{team.name || 'New Team'}</h3>
    
    <Input
      type="text"
      value={team.name}
      onChange={(e) => onNameChange(e.target.value)}
      placeholder="Team name"
      containerClassName="mb-4"
    />

    {playerForm}

    <div className="space-y-2">
      <h4 className="font-medium text-[var(--text)] flex items-center gap-2">
        <Users size={16} />
        Players ({team.players.length}) - Playing 11: {team.playing11.length}/11
      </h4>
      
      {team.players.map((player) => (
        <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={team.playing11.includes(player.id)}
              onChange={() => onTogglePlaying11(player.id)}
              disabled={!team.playing11.includes(player.id) && team.playing11.length >= 11}
              className="w-4 h-4"
            />
            <span className="text-[var(--text)]">{player.name}</span>
            <span className="text-xs text-[var(--text-secondary)] bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
              {player.role}
            </span>
            {team.playing11.includes(player.id) && (
              <span className="text-xs text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                Batting #{team.battingOrder.indexOf(player.id) + 1}
              </span>
            )}
          </div>
          <button
            onClick={() => onRemovePlayer(player.id)}
            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

const TeamManagement = () => {
  // All state managed in the page
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [currentTeam, setCurrentTeam] = useState<Omit<Team, 'id'>>({
    name: '',
    players: [],
    playing11: [],
    battingOrder: []
  });
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState<Player['role']>('batsman');

  // Local storage functions
  const saveTeamsToStorage = (teamsData: Team[]) => {
    localStorage.setItem('cricket_teams', JSON.stringify(teamsData));
  };

  const loadTeamsFromStorage = (): Team[] => {
    const data = localStorage.getItem('cricket_teams');
    return data ? JSON.parse(data) : [];
  };

  // Load teams on component mount
  useEffect(() => {
    const savedTeams = loadTeamsFromStorage();
    setTeams(savedTeams);
  }, []);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      const newPlayer: Player = {
        id: Date.now().toString() + Math.random(),
        name: playerName.trim(),
        role: playerRole
      };
      
      setCurrentTeam(prev => ({
        ...prev,
        players: [...prev.players, newPlayer]
      }));
      setPlayerName('');
    }
  };

  const handleRemovePlayer = (playerId: string) => {
    setCurrentTeam(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== playerId),
      playing11: prev.playing11.filter(id => id !== playerId),
      battingOrder: prev.battingOrder.filter(id => id !== playerId)
    }));
  };

  const handleTogglePlaying11 = (playerId: string) => {
    if (currentTeam.playing11.includes(playerId)) {
      setCurrentTeam(prev => ({
        ...prev,
        playing11: prev.playing11.filter(id => id !== playerId),
        battingOrder: prev.battingOrder.filter(id => id !== playerId)
      }));
    } else if (currentTeam.playing11.length < 11) {
      setCurrentTeam(prev => ({
        ...prev,
        playing11: [...prev.playing11, playerId],
        battingOrder: [...prev.battingOrder, playerId]
      }));
    }
  };

  const handleSaveTeam = () => {
    if (!currentTeam.name.trim()) {
      alert('Please enter a team name');
      return;
    }

    const newTeam: Team = {
      ...currentTeam,
      id: selectedTeam || Date.now().toString(),
      name: currentTeam.name.trim()
    };

    let updatedTeams;
    if (selectedTeam) {
      // Update existing team
      updatedTeams = teams.map(team => 
        team.id === selectedTeam ? newTeam : team
      );
    } else {
      // Add new team
      updatedTeams = [...teams, newTeam];
    }

    setTeams(updatedTeams);
    saveTeamsToStorage(updatedTeams);
    
    // Reset form
    setCurrentTeam({
      name: '',
      players: [],
      playing11: [],
      battingOrder: []
    });
    setSelectedTeam('');
    alert('Team saved successfully!');
  };

  const handleLoadTeam = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setCurrentTeam({
        name: team.name,
        players: team.players,
        playing11: team.playing11,
        battingOrder: team.battingOrder
      });
      setSelectedTeam(teamId);
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      const updatedTeams = teams.filter(team => team.id !== teamId);
      setTeams(updatedTeams);
      saveTeamsToStorage(updatedTeams);
      
      if (selectedTeam === teamId) {
        setCurrentTeam({
          name: '',
          players: [],
          playing11: [],
          battingOrder: []
        });
        setSelectedTeam('');
      }
    }
  };

  const handleNewTeam = () => {
    setCurrentTeam({
      name: '',
      players: [],
      playing11: [],
      battingOrder: []
    });
    setSelectedTeam('');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--text)]">Team Management</h1>
        <button
          onClick={handleNewTeam}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus size={16} />
          New Team
        </button>
      </div>

      {/* Saved Teams */}
      {teams.length > 0 && (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Saved Teams</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div key={team.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-[var(--text)] mb-2">{team.name}</h4>
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                  {team.players.length} players • {team.playing11.length}/11 playing
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoadTeam(team.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Editor */}
      <div className="grid grid-cols-1 gap-6">
        <TeamCard
          team={currentTeam}
          onNameChange={(name) => setCurrentTeam(prev => ({ ...prev, name }))}
          onRemovePlayer={handleRemovePlayer}
          onTogglePlaying11={handleTogglePlaying11}
          playerForm={
            <PlayerForm
              onAddPlayer={handleAddPlayer}
              playerName={playerName}
              setPlayerName={setPlayerName}
              playerRole={playerRole}
              setPlayerRole={setPlayerRole}
            />
          }
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveTeam}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
      >
        <Save size={16} />
        {selectedTeam ? 'Update Team' : 'Save Team'}
      </button>
    </div>
  );
};

export default TeamManagement;