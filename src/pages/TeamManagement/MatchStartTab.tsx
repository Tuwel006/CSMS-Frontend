import { useState } from 'react';
import { Crown, Users } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { MatchService } from '../../services/matchService';
import { showToast } from '../../utils/toast';

interface Player {
  id: number;
  name: string;
  role: string;
}

interface Team {
  id: number;
  name: string;
  short_name?: string;
  players: Player[];
}

interface MatchStartTabProps {
  matchData?: any;
}

const MatchStartTab = ({ matchData }: MatchStartTabProps) => {
  const isScheduled = matchData?.matchDetails?.status === 'SCHEDULED';
  console.log('Match Data in MatchStartTab:', matchData, isScheduled);
  
  const teams: Team[] = matchData ? [
    { id: matchData.teamA.id, name: matchData.teamA.name, short_name: matchData.teamA.short_name, players: matchData.teamA.players || [] },
    { id: matchData.teamB.id, name: matchData.teamB.name, short_name: matchData.teamB.short_name, players: matchData.teamB.players || [] },
  ] : [];

  const [selectedTeam1, setSelectedTeam1] = useState<string>(matchData?.teamA?.id?.toString() || '');
  const [selectedTeam2, setSelectedTeam2] = useState<string>(matchData?.teamB?.id?.toString() || '');
  const [team1Playing11, setTeam1Playing11] = useState<number[]>([]);
  const [team2Playing11, setTeam2Playing11] = useState<number[]>([]);
  const [team1Captain, setTeam1Captain] = useState<number | null>(null);
  const [team2Captain, setTeam2Captain] = useState<number | null>(null);
  const [tossWinner, setTossWinner] = useState<'team1' | 'team2' | ''>('');
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl' | ''>('');
  const [overs, setOvers] = useState<string>(matchData?.matchDetails?.format || '20');

  const team1 = teams.find(t => t.id.toString() === selectedTeam1);
  const team2 = teams.find(t => t.id.toString() === selectedTeam2);

  const togglePlayer = (teamNum: 1 | 2, playerId: number) => {
    if (teamNum === 1) {
      setTeam1Playing11(prev => prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]);
    } else {
      setTeam2Playing11(prev => prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]);
    }
  };

  const isValidTeamSelection = () => {
    if (!team1 || !team2) return false;
    const team1Count = team1.players.length;
    const team2Count = team2.players.length;
    
    if (team1Count < 9 && team2Count < 9) {
      return team1Playing11.length === team1Count && team2Playing11.length === team2Count && team1Playing11.length === team2Playing11.length;
    }
    if (team1Count < 9) {
      return team1Playing11.length === team1Count && team2Playing11.length === team1Count;
    }
    if (team2Count < 9) {
      return team2Playing11.length === team2Count && team1Playing11.length === team2Count;
    }
    return team1Playing11.length >= 9 && team1Playing11.length <= 11 && team2Playing11.length >= 9 && team2Playing11.length <= 11 && team1Playing11.length === team2Playing11.length;
  };

  const handleStartMatch = async () => {
    const tossWinnerTeamId = tossWinner === 'team1' ? parseInt(selectedTeam1) : parseInt(selectedTeam2);
    const battingFirstTeamId = tossDecision === 'bat' ? tossWinnerTeamId : (tossWinner === 'team1' ? parseInt(selectedTeam2) : parseInt(selectedTeam1));

    const payload = {
      toss_winner_team_id: tossWinnerTeamId,
      batting_first_team_id: battingFirstTeamId,
      over: parseInt(overs),
      teamA: {
        id: parseInt(selectedTeam1),
        playing_11_id: team1Playing11,
        captain_id: team1Captain!
      },
      teamB: {
        id: parseInt(selectedTeam2),
        playing_11_id: team2Playing11,
        captain_id: team2Captain!
      }
    };

    const toastId = showToast.loading('Starting match...');
    try {
      const response = await MatchService.startMatch(matchData?.matchToken, payload);
      showToast.handleResponse(toastId, response);
    } catch (error) {
      showToast.handleResponse(toastId, error);
    }
  };

  if (!isScheduled) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card size="sm" variant="default" className="text-center p-6">
          <p className="text-gray-500 dark:text-gray-400">Match must be scheduled before starting</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Card size="sm" variant="default">
        <h3 className="text-sm font-bold mb-2 text-[var(--text)]">Match Configuration</h3>
        <div className="grid grid-cols-3 gap-2 items-end">
          <Input type="number" label="Overs" value={overs} onChange={setOvers} placeholder="20" size="md" />
          <div>
            <label className="block text-xs font-medium mb-1.5 text-gray-500 dark:text-gray-400">Toss Winner</label>
            <div className="flex gap-1">
              <Button variant={tossWinner === 'team1' ? 'primary' : 'outline'} size="md" onClick={() => setTossWinner('team1')} className="flex-1 text-xs px-2">T1</Button>
              <Button variant={tossWinner === 'team2' ? 'primary' : 'outline'} size="md" onClick={() => setTossWinner('team2')} className="flex-1 text-xs px-2">T2</Button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 text-gray-500 dark:text-gray-400">Decision</label>
            <div className="flex gap-1">
              <Button variant={tossDecision === 'bat' ? 'primary' : 'outline'} size="md" onClick={() => setTossDecision('bat')} className="flex-1 text-xs px-2">Bat</Button>
              <Button variant={tossDecision === 'bowl' ? 'primary' : 'outline'} size="md" onClick={() => setTossDecision('bowl')} className="flex-1 text-xs px-2">Bowl</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card size="sm" variant="default">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[var(--text)]">Team 1</h3>
            <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded">Home</span>
          </div>
          <Input type="select" label="Select Team" value={selectedTeam1} onChange={setSelectedTeam1} options={teams.map(t => ({ value: t.id.toString(), label: t.name }))} placeholder="Choose Team 1" size="md" />
          
          {team1 && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Playing XI ({team1Playing11.length}/11)</span>
                {team1Captain && <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400"><Crown size={11} /> Captain</div>}
              </div>
              <div className="space-y-1 max-h-[350px] overflow-y-auto">
                {team1.players.map(player => (
                  <div key={player.id} className={`flex items-center justify-between p-1.5 rounded transition-all ${team1Playing11.includes(player.id) ? 'bg-blue-500/10 border border-blue-500' : 'border border-transparent'}`} style={{ backgroundColor: team1Playing11.includes(player.id) ? undefined : 'var(--hover-bg)' }}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input type="checkbox" checked={team1Playing11.includes(player.id)} onChange={() => togglePlayer(1, player.id)} className="w-3 h-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{player.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{player.role}</p>
                      </div>
                    </div>
                    {team1Playing11.includes(player.id) && (
                      <button onClick={() => setTeam1Captain(player.id)} className={`p-1 flex-shrink-0 ${team1Captain === player.id ? 'text-yellow-500' : 'text-gray-400'}`}>
                        <Crown size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card size="sm" variant="default">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[var(--text)]">Team 2</h3>
            <span className="text-xs px-2 py-0.5 bg-red-500 text-white rounded">Away</span>
          </div>
          <Input type="select" label="Select Team" value={selectedTeam2} onChange={setSelectedTeam2} options={teams.map(t => ({ value: t.id.toString(), label: t.name }))} placeholder="Choose Team 2" size="md" />
          
          {team2 && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Playing XI ({team2Playing11.length}/11)</span>
                {team2Captain && <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400"><Crown size={11} /> Captain</div>}
              </div>
              <div className="space-y-1 max-h-[350px] overflow-y-auto">
                {team2.players.map(player => (
                  <div key={player.id} className={`flex items-center justify-between p-1.5 rounded transition-all ${team2Playing11.includes(player.id) ? 'bg-blue-500/10 border border-blue-500' : 'border border-transparent'}`} style={{ backgroundColor: team2Playing11.includes(player.id) ? undefined : 'var(--hover-bg)' }}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input type="checkbox" checked={team2Playing11.includes(player.id)} onChange={() => togglePlayer(2, player.id)} className="w-3 h-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{player.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{player.role}</p>
                      </div>
                    </div>
                    {team2Playing11.includes(player.id) && (
                      <button onClick={() => setTeam2Captain(player.id)} className={`p-1 flex-shrink-0 ${team2Captain === player.id ? 'text-yellow-500' : 'text-gray-400'}`}>
                        <Crown size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <button onClick={handleStartMatch} disabled={!selectedTeam1 || !selectedTeam2 || !isValidTeamSelection() || !team1Captain || !team2Captain || !tossWinner || !tossDecision} className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-base rounded shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] disabled:scale-100 transition-all duration-200 flex items-center justify-center gap-2">
        <Users size={16} />
        🏏 Start Match
      </button>
    </div>
  );
};

export default MatchStartTab;
