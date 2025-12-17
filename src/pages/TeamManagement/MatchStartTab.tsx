import { useState } from 'react';
import { Crown, Users } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface Player {
  id: number;
  name: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  players: Player[];
}

const MatchStartTab = () => {
  const teams: Team[] = [
    { id: '1', name: 'Mumbai Indians', players: [{ id: 1, name: 'Rohit Sharma', role: 'Batsman' }, { id: 2, name: 'Jasprit Bumrah', role: 'Bowler' }, { id: 3, name: 'Hardik Pandya', role: 'All-rounder' }] },
    { id: '2', name: 'Chennai Super Kings', players: [{ id: 4, name: 'MS Dhoni', role: 'Wicketkeeper' }, { id: 5, name: 'Ravindra Jadeja', role: 'All-rounder' }] },
  ];

  const [selectedTeam1, setSelectedTeam1] = useState<string>('');
  const [selectedTeam2, setSelectedTeam2] = useState<string>('');
  const [team1Playing11, setTeam1Playing11] = useState<number[]>([]);
  const [team2Playing11, setTeam2Playing11] = useState<number[]>([]);
  const [team1Captain, setTeam1Captain] = useState<number | null>(null);
  const [team2Captain, setTeam2Captain] = useState<number | null>(null);
  const [tossWinner, setTossWinner] = useState<'team1' | 'team2' | ''>('');
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl' | ''>('');
  const [overs, setOvers] = useState<string>('20');

  const team1 = teams.find(t => t.id === selectedTeam1);
  const team2 = teams.find(t => t.id === selectedTeam2);

  const togglePlayer = (teamNum: 1 | 2, playerId: number) => {
    if (teamNum === 1) {
      setTeam1Playing11(prev => prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]);
    } else {
      setTeam2Playing11(prev => prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]);
    }
  };

  const handleStartMatch = () => {
    console.log({ team1: selectedTeam1, team2: selectedTeam2, team1Playing11, team2Playing11, team1Captain, team2Captain, tossWinner, tossDecision, overs });
  };

  return (
    <div className="space-y-4">
      <Card className="p-3 bg-[var(--card-bg)]">
        <h3 className="text-sm font-bold mb-2 text-[var(--text)] flex items-center gap-2">
          <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
          Match Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <Input type="number" label="Overs" value={overs} onChange={setOvers} placeholder="20" size="sm" />
          <div>
            <label className="block text-xs font-medium mb-1 text-[var(--text-secondary)]">Toss Winner</label>
            <div className="flex gap-1">
              <Button variant={tossWinner === 'team1' ? 'primary' : 'outline'} size="sm" onClick={() => setTossWinner('team1')} className="flex-1 text-xs">Team 1</Button>
              <Button variant={tossWinner === 'team2' ? 'primary' : 'outline'} size="sm" onClick={() => setTossWinner('team2')} className="flex-1 text-xs">Team 2</Button>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-medium mb-1 text-[var(--text-secondary)]">Toss Decision</label>
            <div className="flex gap-1">
              <Button variant={tossDecision === 'bat' ? 'primary' : 'outline'} size="sm" onClick={() => setTossDecision('bat')} className="flex-1 text-xs">Bat</Button>
              <Button variant={tossDecision === 'bowl' ? 'primary' : 'outline'} size="sm" onClick={() => setTossDecision('bowl')} className="flex-1 text-xs">Bowl</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-base font-semibold mb-3 text-[var(--text)] flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
            Team 1
          </h3>
          <Input type="select" label="Select Team" value={selectedTeam1} onChange={setSelectedTeam1} options={teams.map(t => ({ value: t.id, label: t.name }))} placeholder="Choose Team 1" size="sm" />
          
          {team1 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[var(--text-secondary)]">Players ({team1Playing11.length}/11)</span>
                {team1Captain && <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400"><Crown size={12} /> Captain</div>}
              </div>
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
                {team1.players.map(player => (
                  <div key={player.id} className={`flex items-center justify-between p-2 rounded border transition-colors ${team1Playing11.includes(player.id) ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' : 'border-[var(--card-border)]'}`}>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={team1Playing11.includes(player.id)} onChange={() => togglePlayer(1, player.id)} className="w-3.5 h-3.5" />
                      <div>
                        <p className="text-xs font-medium text-[var(--text)]">{player.name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{player.role}</p>
                      </div>
                    </div>
                    {team1Playing11.includes(player.id) && (
                      <Button variant="ghost" size="sm" onClick={() => setTeam1Captain(player.id)} className={`p-1 ${team1Captain === player.id ? 'text-yellow-600' : 'text-gray-400'}`}>
                        <Crown size={14} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="text-base font-semibold mb-3 text-[var(--text)] flex items-center gap-2">
            <span className="w-1 h-4 bg-red-500 rounded-full"></span>
            Team 2
          </h3>
          <Input type="select" label="Select Team" value={selectedTeam2} onChange={setSelectedTeam2} options={teams.map(t => ({ value: t.id, label: t.name }))} placeholder="Choose Team 2" size="sm" />
          
          {team2 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[var(--text-secondary)]">Players ({team2Playing11.length}/11)</span>
                {team2Captain && <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400"><Crown size={12} /> Captain</div>}
              </div>
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
                {team2.players.map(player => (
                  <div key={player.id} className={`flex items-center justify-between p-2 rounded border transition-colors ${team2Playing11.includes(player.id) ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' : 'border-[var(--card-border)]'}`}>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={team2Playing11.includes(player.id)} onChange={() => togglePlayer(2, player.id)} className="w-3.5 h-3.5" />
                      <div>
                        <p className="text-xs font-medium text-[var(--text)]">{player.name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{player.role}</p>
                      </div>
                    </div>
                    {team2Playing11.includes(player.id) && (
                      <Button variant="ghost" size="sm" onClick={() => setTeam2Captain(player.id)} className={`p-1 ${team2Captain === player.id ? 'text-yellow-600' : 'text-gray-400'}`}>
                        <Crown size={14} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <Button variant="primary" size="md" className="w-full" onClick={handleStartMatch} disabled={!selectedTeam1 || !selectedTeam2 || team1Playing11.length !== 11 || team2Playing11.length !== 11 || !team1Captain || !team2Captain || !tossWinner || !tossDecision}>
        <Users size={16} className="mr-2" />
        Start Match
      </Button>
    </div>
  );
};

export default MatchStartTab;
