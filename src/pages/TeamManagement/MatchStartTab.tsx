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
  onMatchStart: () => void;
  onRefresh: () => void;
}

const MatchStartTab = ({ matchData, onMatchStart, onRefresh }: MatchStartTabProps) => {
  const isScheduled = matchData?.matchDetails?.status === 'SCHEDULED';
  console.log('Match Data in MatchStartTab:', matchData, isScheduled);

  const teams: Team[] = matchData ? [
    { id: matchData.teamA.id, name: matchData.teamA.name, short_name: matchData.teamA.short_name, players: matchData.teamA.players || [] },
    { id: matchData.teamB.id, name: matchData.teamB.name, short_name: matchData.teamB.short_name, players: matchData.teamB.players || [] },
  ] : [];

  const selectedTeam1 = matchData?.teamA?.id?.toString() || '';
  const selectedTeam2 = matchData?.teamB?.id?.toString() || '';
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
      onRefresh();
      onMatchStart();
    } catch (error) {
      showToast.handleResponse(toastId, error);
    }
  };

  if (matchData?.matchDetails?.status === 'LIVE') {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="absolute -inset-4 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
          <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full p-4 shadow-2xl shadow-cyan-500/30">
            <Crown size={48} className="text-white" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-[var(--text)] tracking-tight">MATCH IS <span className="text-cyan-500">LIVE</span></h2>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Scoreboard is active and running</p>
        </div>

        <Card size="sm" className="w-full max-w-md border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4 border-b border-cyan-500/10">
            <div className="text-center flex-1">
              <h3 className="font-black text-lg text-[var(--text)] uppercase leading-none">{team1?.short_name || 'TEAM A'}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">Batting First</p>
            </div>
            <div className="px-4 text-cyan-600 font-black text-xl">VS</div>
            <div className="text-center flex-1">
              <h3 className="font-black text-lg text-[var(--text)] uppercase leading-none">{team2?.short_name || 'TEAM B'}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">Bowling</p>
            </div>
          </div>
          <div className="p-3 flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider bg-black/5 dark:bg-white/5">
            <span>{overs} Overs</span>
            <span>{matchData?.matchDetails?.venue || 'Venue N/A'}</span>
          </div>
        </Card>

        <Button
          onClick={onMatchStart}
          className="w-full max-w-md py-4 text-sm font-black uppercase tracking-[0.2em] bg-cyan-600 hover:bg-cyan-500 shadow-xl hover:shadow-cyan-500/20 transition-all transform hover:-translate-y-1"
        >
          Enter Scoring Console <Users size={16} className="ml-2" />
        </Button>
      </div>
    );
  }

  if (!isScheduled) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card size="sm" variant="default" className="text-center p-6 border-dashed border-2 border-gray-200 dark:border-gray-800 bg-transparent shadow-none">
          <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-xs">Match must be scheduled before starting</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Card size="sm" variant="default" className="border-cyan-500/10 bg-cyan-500/[0.02]">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Match Configuration</h3>
          <div className="h-[1px] flex-1 mx-4 bg-gray-100 dark:bg-gray-800/50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input type="number" label="OVERS" value={overs} onChange={setOvers} placeholder="20" size="sm" className="!text-xs font-bold" />
          <div className="space-y-1.5">
            <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-0.5">Toss Winner</label>
            <div className="flex gap-1">
              <Button variant={tossWinner === 'team1' ? 'primary' : 'outline'} size="sm" onClick={() => setTossWinner('team1')} className="flex-1 text-[10px] font-black uppercase h-8 bg-cyan-600/10 border-cyan-600/20 text-cyan-600 hover:bg-cyan-600 hover:text-white transition-all">TEAM A</Button>
              <Button variant={tossWinner === 'team2' ? 'primary' : 'outline'} size="sm" onClick={() => setTossWinner('team2')} className="flex-1 text-[10px] font-black uppercase h-8 bg-cyan-600/10 border-cyan-600/20 text-cyan-600 hover:bg-cyan-600 hover:text-white transition-all">TEAM B</Button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-0.5">Decision</label>
            <div className="flex gap-1">
              <Button variant={tossDecision === 'bat' ? 'primary' : 'outline'} size="sm" onClick={() => setTossDecision('bat')} className="flex-1 text-[10px] font-black uppercase h-8 border-gray-200 dark:border-gray-800 hover:border-cyan-500 hover:text-cyan-500">Bat First</Button>
              <Button variant={tossDecision === 'bowl' ? 'primary' : 'outline'} size="sm" onClick={() => setTossDecision('bowl')} className="flex-1 text-[10px] font-black uppercase h-8 border-gray-200 dark:border-gray-800 hover:border-cyan-500 hover:text-cyan-500">Bowl First</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Team 1 Selection */}
        <Card size="sm" variant="default" className="border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest leading-none">PRIMARY ROSTER (A)</h3>
            <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter shadow-sm ${tossWinner === 'team1' ? 'bg-cyan-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}>
              {tossWinner === 'team1' ? 'Starts Toss' : 'TEAM A'}
            </div>
          </div>

          {team1 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Select Playing XI ({team1Playing11.length}/11)</span>
                {team1Captain && (
                  <div className="flex items-center gap-1 text-[9px] font-black text-yellow-500 uppercase animate-pulse">
                    <Crown size={10} /> Captain Set
                  </div>
                )}
              </div>

              <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scroll-thumb-gray-800">
                {team1.players.map(player => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-1.5 rounded-sm transition-all border ${team1Playing11.includes(player.id)
                      ? 'border-cyan-500/30 bg-cyan-500/5'
                      : 'border-transparent hover:bg-gray-50 dark:hover:bg-white/2'
                      }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={team1Playing11.includes(player.id)}
                        onChange={() => togglePlayer(1, player.id)}
                        className="w-3 h-3 rounded-sm border-gray-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold truncate uppercase tracking-tight" style={{ color: 'var(--text)' }}>{player.name}</p>
                        <p className="text-[9px] font-black text-gray-400 uppercase leading-none mt-0.5">{player.role}</p>
                      </div>
                    </div>
                    {team1Playing11.includes(player.id) && (
                      <button
                        onClick={() => setTeam1Captain(player.id)}
                        className={`p-1.5 rounded-full transition-colors ${team1Captain === player.id ? 'text-yellow-500 bg-yellow-500/10' : 'text-gray-300 hover:text-yellow-500'
                          }`}
                        title="Set as Captain"
                      >
                        <Crown size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Team 2 Selection */}
        <Card size="sm" variant="default" className="border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">RIVAL ROSTER (B)</h3>
            <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter shadow-sm ${tossWinner === 'team2' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}>
              {tossWinner === 'team2' ? 'Starts Toss' : 'TEAM B'}
            </div>
          </div>

          {team2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Select Playing XI ({team2Playing11.length}/11)</span>
                {team2Captain && (
                  <div className="flex items-center gap-1 text-[9px] font-black text-yellow-500 uppercase animate-pulse">
                    <Crown size={10} /> Captain Set
                  </div>
                )}
              </div>

              <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scroll-thumb-gray-800">
                {team2.players.map(player => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-1.5 rounded-sm transition-all border ${team2Playing11.includes(player.id)
                      ? 'border-red-500/30 bg-red-500/5'
                      : 'border-transparent hover:bg-gray-50 dark:hover:bg-white/2'
                      }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={team2Playing11.includes(player.id)}
                        onChange={() => togglePlayer(2, player.id)}
                        className="w-3 h-3 rounded-sm border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold truncate uppercase tracking-tight" style={{ color: 'var(--text)' }}>{player.name}</p>
                        <p className="text-[9px] font-black text-gray-400 uppercase leading-none mt-0.5">{player.role}</p>
                      </div>
                    </div>
                    {team2Playing11.includes(player.id) && (
                      <button
                        onClick={() => setTeam2Captain(player.id)}
                        className={`p-1.5 rounded-full transition-colors ${team2Captain === player.id ? 'text-yellow-500 bg-yellow-500/10' : 'text-gray-300 hover:text-yellow-500'
                          }`}
                        title="Set as Captain"
                      >
                        <Crown size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <button
        onClick={handleStartMatch}
        disabled={!selectedTeam1 || !selectedTeam2 || !isValidTeamSelection() || !team1Captain || !team2Captain || !tossWinner || !tossDecision}
        className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 text-white font-black text-xs uppercase tracking-[0.2em] rounded-sm shadow-xl hover:shadow-cyan-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3"
      >
        <Users size={16} />
        Initialize LIVE Scoreboard
      </button>
    </div>
  );
};

export default MatchStartTab;
