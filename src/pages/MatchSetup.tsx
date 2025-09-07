import { useState, useEffect } from 'react';
import { useMatch } from '../context/MatchContext';
import { type Team } from '../types/match';
import { Users, Play } from 'lucide-react';

// Stateless components
const TeamSelector = ({ 
  teams, 
  selectedTeam, 
  onTeamSelect, 
  label 
}: {
  teams: Team[];
  selectedTeam: string;
  onTeamSelect: (teamId: string) => void;
  label: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-[var(--text)] mb-2">{label}</label>
    <select
      value={selectedTeam}
      onChange={(e) => onTeamSelect(e.target.value)}
      className="w-full px-3 py-2 border border-[var(--card-border)] rounded-lg bg-[var(--card-bg)] text-[var(--text)]"
    >
      <option value="">Select team</option>
      {teams.map((team) => (
        <option key={team.id} value={team.id}>
          {team.name} ({team.playing11.length}/11 players)
        </option>
      ))}
    </select>
  </div>
);

const TeamPreview = ({ team }: { team: Team | null }) => {
  if (!team) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <h4 className="font-medium text-[var(--text)] mb-2 flex items-center gap-2">
        <Users size={16} />
        {team.name}
      </h4>
      <div className="text-sm text-[var(--text-secondary)] mb-2">
        Playing 11: {team.playing11.length}/11
      </div>
      <div className="space-y-1">
        {team.battingOrder.slice(0, 11).map((playerId, index) => {
          const player = team.players.find(p => p.id === playerId);
          return (
            <div key={playerId} className="flex justify-between text-sm">
              <span className="text-[var(--text)]">
                {index + 1}. {player?.name}
              </span>
              <span className="text-xs text-[var(--text-secondary)] bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                {player?.role}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MatchSetup = () => {
  const { createMatch } = useMatch();
  
  // All state managed in the page
  const [teams, setTeams] = useState<Team[]>([]);
  const [team1Id, setTeam1Id] = useState('');
  const [team2Id, setTeam2Id] = useState('');
  const [overs, setOvers] = useState(20);
  const [tossWinner, setTossWinner] = useState('');
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl'>('bat');

  // Local storage functions
  const loadTeamsFromStorage = (): Team[] => {
    const data = localStorage.getItem('cricket_teams');
    return data ? JSON.parse(data) : [];
  };

  // Load teams on component mount
  useEffect(() => {
    const savedTeams = loadTeamsFromStorage();
    setTeams(savedTeams);
  }, []);

  const getSelectedTeam1 = () => teams.find(t => t.id === team1Id) || null;
  const getSelectedTeam2 = () => teams.find(t => t.id === team2Id) || null;

  const handleStartMatch = async () => {
    const team1 = getSelectedTeam1();
    const team2 = getSelectedTeam2();

    if (!team1 || !team2) {
      alert('Please select both teams');
      return;
    }

    if (team1.playing11.length !== 11 || team2.playing11.length !== 11) {
      alert('Both teams must have exactly 11 players selected');
      return;
    }

    if (!tossWinner) {
      alert('Please select toss winner');
      return;
    }

    const battingTeam = tossDecision === 'bat' ? tossWinner : (tossWinner === team1.id ? team2.id : team1.id);
    const bowlingTeam = battingTeam === team1.id ? team2.id : team1.id;

    await createMatch({
      team1,
      team2,
      tossWinner,
      tossDecision,
      battingTeam,
      bowlingTeam,
      overs,
      currentInnings: 1,
      status: 'live'
    });

    alert('Match started successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--text)]">Match Setup</h1>
        <a 
          href="/team-management"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          Manage Teams
        </a>
      </div>

      {teams.length === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            No teams found. Please create teams first using the Team Management page.
          </p>
        </div>
      )}

      {/* Team Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Team 1</h3>
          <TeamSelector
            teams={teams}
            selectedTeam={team1Id}
            onTeamSelect={setTeam1Id}
            label="Select Team 1"
          />
          {getSelectedTeam1() && (
            <div className="mt-4">
              <TeamPreview team={getSelectedTeam1()} />
            </div>
          )}
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Team 2</h3>
          <TeamSelector
            teams={teams}
            selectedTeam={team2Id}
            onTeamSelect={setTeam2Id}
            label="Select Team 2"
          />
          {getSelectedTeam2() && (
            <div className="mt-4">
              <TeamPreview team={getSelectedTeam2()} />
            </div>
          )}
        </div>
      </div>

      {/* Match Settings */}
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
              {getSelectedTeam1() && (
                <option value={getSelectedTeam1()!.id}>{getSelectedTeam1()!.name}</option>
              )}
              {getSelectedTeam2() && (
                <option value={getSelectedTeam2()!.id}>{getSelectedTeam2()!.name}</option>
              )}
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

      {/* Match Summary */}
      {getSelectedTeam1() && getSelectedTeam2() && tossWinner && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Match Summary</h4>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p><strong>Teams:</strong> {getSelectedTeam1()!.name} vs {getSelectedTeam2()!.name}</p>
            <p><strong>Format:</strong> {overs} Overs</p>
            <p><strong>Toss:</strong> {teams.find(t => t.id === tossWinner)?.name} won and chose to {tossDecision} first</p>
            <p><strong>Batting First:</strong> {
              tossDecision === 'bat' 
                ? teams.find(t => t.id === tossWinner)?.name
                : teams.find(t => t.id !== tossWinner && (t.id === team1Id || t.id === team2Id))?.name
            }</p>
          </div>
        </div>
      )}

      {/* Start Match Button */}
      <button
        onClick={handleStartMatch}
        disabled={!getSelectedTeam1() || !getSelectedTeam2() || !tossWinner}
        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <Play size={16} />
        Start Match
      </button>
    </div>
  );
};

export default MatchSetup;