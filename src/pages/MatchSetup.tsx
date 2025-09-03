import { useState } from 'react';
import { useMatch } from '../context/MatchContext';
import { type Team, type Player } from '../types/match';
import { Plus, Trash2, Users } from 'lucide-react';

const MatchSetup = () => {
  const { createMatch } = useMatch();
  
  const [team1, setTeam1] = useState<Omit<Team, 'id'>>({
    name: '',
    players: [],
    playing11: [],
    battingOrder: []
  });
  
  const [team2, setTeam2] = useState<Omit<Team, 'id'>>({
    name: '',
    players: [],
    playing11: [],
    battingOrder: []
  });
  
  const [overs, setOvers] = useState(20);
  const [tossWinner, setTossWinner] = useState('');
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl'>('bat');

  const addPlayer = (teamNumber: 1 | 2, player: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...player,
      id: Date.now().toString() + Math.random(),
    };
    
    if (teamNumber === 1) {
      setTeam1(prev => ({
        ...prev,
        players: [...prev.players, newPlayer]
      }));
    } else {
      setTeam2(prev => ({
        ...prev,
        players: [...prev.players, newPlayer]
      }));
    }
  };

  const removePlayer = (teamNumber: 1 | 2, playerId: string) => {
    if (teamNumber === 1) {
      setTeam1(prev => ({
        ...prev,
        players: prev.players.filter(p => p.id !== playerId),
        playing11: prev.playing11.filter(id => id !== playerId),
        battingOrder: prev.battingOrder.filter(id => id !== playerId)
      }));
    } else {
      setTeam2(prev => ({
        ...prev,
        players: prev.players.filter(p => p.id !== playerId),
        playing11: prev.playing11.filter(id => id !== playerId),
        battingOrder: prev.battingOrder.filter(id => id !== playerId)
      }));
    }
  };

  const togglePlaying11 = (teamNumber: 1 | 2, playerId: string) => {
    const team = teamNumber === 1 ? team1 : team2;
    const setTeam = teamNumber === 1 ? setTeam1 : setTeam2;
    
    if (team.playing11.includes(playerId)) {
      setTeam(prev => ({
        ...prev,
        playing11: prev.playing11.filter(id => id !== playerId),
        battingOrder: prev.battingOrder.filter(id => id !== playerId)
      }));
    } else if (team.playing11.length < 11) {
      setTeam(prev => ({
        ...prev,
        playing11: [...prev.playing11, playerId],
        battingOrder: [...prev.battingOrder, playerId]
      }));
    }
  };

  const reorderBatting = (teamNumber: 1 | 2, fromIndex: number, toIndex: number) => {
    const team = teamNumber === 1 ? team1 : team2;
    const setTeam = teamNumber === 1 ? setTeam1 : setTeam2;
    
    const newOrder = [...team.battingOrder];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    
    setTeam(prev => ({
      ...prev,
      battingOrder: newOrder
    }));
  };

  const handleStartMatch = async () => {
    if (!team1.name || !team2.name || team1.playing11.length !== 11 || team2.playing11.length !== 11) {
      alert('Please complete team setup with 11 players each');
      return;
    }

    const battingTeam = tossDecision === 'bat' ? tossWinner : (tossWinner === 'team1' ? 'team2' : 'team1');
    const bowlingTeam = battingTeam === 'team1' ? 'team2' : 'team1';

    await createMatch({
      team1: { ...team1, id: 'team1' },
      team2: { ...team2, id: 'team2' },
      tossWinner,
      tossDecision,
      battingTeam,
      bowlingTeam,
      overs,
      currentInnings: 1,
      status: 'live'
    });
  };

  const [playerName1, setPlayerName1] = useState('');
  const [playerRole1, setPlayerRole1] = useState<Player['role']>('batsman');
  const [playerName2, setPlayerName2] = useState('');
  const [playerRole2, setPlayerRole2] = useState<Player['role']>('batsman');

  const handleAddPlayer1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName1.trim()) {
      addPlayer(1, { name: playerName1.trim(), role: playerRole1 });
      setPlayerName1('');
    }
  };

  const handleAddPlayer2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName2.trim()) {
      addPlayer(2, { name: playerName2.trim(), role: playerRole2 });
      setPlayerName2('');
    }
  };

  const PlayerForm1 = () => (
    <form onSubmit={handleAddPlayer1} className="flex gap-2 mb-4">
      <input
        type="text"
        value={playerName1}
        onChange={(e) => setPlayerName1(e.target.value)}
        placeholder="Player name"
        className="flex-1 px-3 py-2 border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] text-[var(--text)]"
      />
      <select
        value={playerRole1}
        onChange={(e) => setPlayerRole1(e.target.value as Player['role'])}
        className="px-3 py-2 border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] text-[var(--text)]"
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
    </form>
  );

  const PlayerForm2 = () => (
    <form onSubmit={handleAddPlayer2} className="flex gap-2 mb-4">
      <input
        type="text"
        value={playerName2}
        onChange={(e) => setPlayerName2(e.target.value)}
        placeholder="Player name"
        className="flex-1 px-3 py-2 border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] text-[var(--text)]"
      />
      <select
        value={playerRole2}
        onChange={(e) => setPlayerRole2(e.target.value as Player['role'])}
        className="px-3 py-2 border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] text-[var(--text)]"
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
    </form>
  );

  const TeamSetup = ({ 
    team, 
    teamNumber, 
    onNameChange, 
    onRemovePlayer, 
    onTogglePlaying11,
    onReorderBatting,
    playerForm
  }: {
    team: Omit<Team, 'id'>;
    teamNumber: 1 | 2;
    onNameChange: (name: string) => void;
    onRemovePlayer: (playerId: string) => void;
    onTogglePlaying11: (playerId: string) => void;
    onReorderBatting: (fromIndex: number, toIndex: number) => void;
    playerForm: React.ReactNode;
  }) => (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Team {teamNumber}</h3>
      
      <input
        type="text"
        value={team.name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Team name"
        className="w-full px-3 py-2 mb-4 border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] text-[var(--text)]"
      />

      {playerForm}

      <div className="space-y-2">
        <h4 className="font-medium text-[var(--text)] flex items-center gap-2">
          <Users size={16} />
          Players ({team.players.length}) - Playing 11: {team.playing11.length}/11
        </h4>
        
        {team.players.map((player, index) => (
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text)]">Match Setup</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamSetup
          team={team1}
          teamNumber={1}
          onNameChange={(name) => setTeam1(prev => ({ ...prev, name }))}
          onRemovePlayer={(playerId) => removePlayer(1, playerId)}
          onTogglePlaying11={(playerId) => togglePlaying11(1, playerId)}
          onReorderBatting={(from, to) => reorderBatting(1, from, to)}
          playerForm={<PlayerForm1 />}
        />

        <TeamSetup
          team={team2}
          teamNumber={2}
          onNameChange={(name) => setTeam2(prev => ({ ...prev, name }))}
          onRemovePlayer={(playerId) => removePlayer(2, playerId)}
          onTogglePlaying11={(playerId) => togglePlaying11(2, playerId)}
          onReorderBatting={(from, to) => reorderBatting(2, from, to)}
          playerForm={<PlayerForm2 />}
        />
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Match Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Overs</label>
            <input
              type="number"
              value={overs}
              onChange={(e) => setOvers(Number(e.target.value))}
              min="1"
              max="50"
              className="w-full px-3 py-2 border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] text-[var(--text)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Toss Winner</label>
            <select
              value={tossWinner}
              onChange={(e) => setTossWinner(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] text-[var(--text)]"
            >
              <option value="">Select team</option>
              <option value="team1">{team1.name || 'Team 1'}</option>
              <option value="team2">{team2.name || 'Team 2'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Toss Decision</label>
            <select
              value={tossDecision}
              onChange={(e) => setTossDecision(e.target.value as 'bat' | 'bowl')}
              className="w-full px-3 py-2 border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] text-[var(--text)]"
            >
              <option value="bat">Bat First</option>
              <option value="bowl">Bowl First</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleStartMatch}
        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
      >
        Start Match
      </button>
    </div>
  );
};

export default MatchSetup;