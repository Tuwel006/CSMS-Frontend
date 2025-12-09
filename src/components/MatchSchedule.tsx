import { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import { ChevronDown, ChevronUp, UserCheck } from 'lucide-react';

// Reusing interfaces from TeamManagement to keep consistency
interface Player {
    id: string | null;
    name: string;
    role: string;
}

interface TeamData {
    id: string;
    name: string;
    location: string;
    teamId: string | null;
    players: Player[];
}

interface MatchScheduleProps {
    availableTeams: TeamData[];
}

const MatchSchedule = ({ availableTeams }: MatchScheduleProps) => {
    // Match Details State
    const [venue, setVenue] = useState('');
    const [overs, setOvers] = useState<string>('');
    const [tossWinner, setTossWinner] = useState<'team1' | 'team2' | ''>('');
    const [tossDecision, setTossDecision] = useState<'bat' | 'bowl' | ''>('');

    // Team Selection State
    const [selectedTeam1Id, setSelectedTeam1Id] = useState<string>('');
    const [selectedTeam2Id, setSelectedTeam2Id] = useState<string>('');

    // Playing 11 State
    const [team1Playing11, setTeam1Playing11] = useState<Player[]>([]);
    const [team2Playing11, setTeam2Playing11] = useState<Player[]>([]);

    // Collapsible state for playing 11 selection
    const [showTeam1Players, setShowTeam1Players] = useState(true);
    const [showTeam2Players, setShowTeam2Players] = useState(true);

    // Derived teams
    const team1 = availableTeams.find(t => t.id === selectedTeam1Id);
    const team2 = availableTeams.find(t => t.id === selectedTeam2Id);

    // Filter available teams for dropdowns
    const teamsForSelection = availableTeams;

    // Handlers
    const handleTeam1Select = (id: string) => {
        setSelectedTeam1Id(id);
        setTeam1Playing11([]); // Reset playing 11 when team changes
    };

    const handleTeam2Select = (id: string) => {
        setSelectedTeam2Id(id);
        setTeam2Playing11([]); // Reset playing 11 when team changes
    };

    const togglePlayerTeam1 = (player: Player) => {
        const isSelected = team1Playing11.some(p => p.id === player.id && p.name === player.name);
        if (isSelected) {
            setTeam1Playing11(team1Playing11.filter(p => !(p.id === player.id && p.name === player.name)));
        } else {
            setTeam1Playing11([...team1Playing11, player]);
        }
    };

    const togglePlayerTeam2 = (player: Player) => {
        const isSelected = team2Playing11.some(p => p.id === player.id && p.name === player.name);
        if (isSelected) {
            setTeam2Playing11(team2Playing11.filter(p => !(p.id === player.id && p.name === player.name)));
        } else {
            setTeam2Playing11([...team2Playing11, player]);
        }
    };

    const handleScheduleMatch = () => {
        if (!selectedTeam1Id || !selectedTeam2Id) {
            alert('Please select both teams');
            return;
        }
        if (!venue || !overs) {
            alert('Please fill in match details');
            return;
        }
        // TODO: Submit logic
        console.log({
            team1: { ...team1, playing11: team1Playing11 },
            team2: { ...team2, playing11: team2Playing11 },
            venue,
            overs,
            tossWinner: tossWinner === 'team1' ? team1?.name : team2?.name,
            tossDecision
        });
        alert('Match Scheduled (Concept Only)');
    };

    return (
        <div className="space-y-6">
            {/* Common Match Details Header */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-[var(--text)]">Match Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <Input
                            type="text"
                            label="Venue"
                            placeholder="Enter stadium/ground name"
                            value={venue}
                            onChange={(val: string) => setVenue(val)}
                        />
                    </div>
                    <div>
                        <Input
                            type="number"
                            label="Overs"
                            placeholder="e.g. 20"
                            value={overs}
                            onChange={(val: string) => setOvers(val)}
                        />
                    </div>
                </div>
            </div>

            {/* Teams Setup Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Team 1 Section */}
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-5 flex flex-col h-full shadow-sm">
                    <h3 className="text-md font-semibold mb-3 text-[var(--text)] flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                        Team 1
                    </h3>

                    <div className="mb-4">
                        <Input
                            type="select"
                            label="Select Team"
                            placeholder="Choose Team 1"
                            value={selectedTeam1Id}
                            onChange={(val: string) => handleTeam1Select(val)}
                            options={teamsForSelection.map(team => ({
                                value: team.id,
                                label: `${team.name} (${team.location})`
                            }))}
                        />
                    </div>

                    {team1 && (
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Playing 11 ({team1Playing11.length})
                                </span>
                                <button
                                    onClick={() => setShowTeam1Players(!showTeam1Players)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-colors text-gray-500"
                                >
                                    {showTeam1Players ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                            </div>

                            {showTeam1Players && (
                                <div className="border border-[var(--card-border)] rounded-lg overflow-hidden max-h-[350px] overflow-y-auto bg-[var(--hover-bg)]">
                                    {team1.players.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500 text-sm">No players allowed in this team yet.</div>
                                    ) : (
                                        team1.players.map(player => {
                                            const isSelected = team1Playing11.some(p => p.id === player.id && p.name === player.name);
                                            return (
                                                <div
                                                    key={player.id || player.name}
                                                    className={`px-3 py-2.5 flex items-center justify-between cursor-pointer border-b border-[var(--card-border)] last:border-0 hover:bg-white dark:hover:bg-white/5 transition-all
                                                        ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                                    onClick={() => togglePlayerTeam1(player)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                                                            ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 dark:border-gray-600 text-transparent'}`}>
                                                            <UserCheck size={12} strokeWidth={3} />
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm ${isSelected ? 'font-semibold text-blue-700 dark:text-blue-300' : 'font-medium text-[var(--text)]'}`}>{player.name}</p>
                                                            <p className="text-[10px] text-gray-500 uppercase tracking-wide">{player.role}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Team 2 Section */}
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-5 flex flex-col h-full shadow-sm">
                    <h3 className="text-md font-semibold mb-3 text-[var(--text)] flex items-center gap-2">
                        <span className="w-1 h-4 bg-red-500 rounded-full"></span>
                        Team 2
                    </h3>

                    <div className="mb-4">
                        <Input
                            type="select"
                            label="Select Team"
                            placeholder="Choose Team 2"
                            value={selectedTeam2Id}
                            onChange={(val: string) => handleTeam2Select(val)}
                            options={teamsForSelection.map(team => ({
                                value: team.id,
                                label: `${team.name} (${team.location})`
                            }))}
                        />
                    </div>

                    {team2 && (
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Playing 11 ({team2Playing11.length})
                                </span>
                                <button
                                    onClick={() => setShowTeam2Players(!showTeam2Players)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-colors text-gray-500"
                                >
                                    {showTeam2Players ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                            </div>

                            {showTeam2Players && (
                                <div className="border border-[var(--card-border)] rounded-lg overflow-hidden max-h-[350px] overflow-y-auto bg-[var(--hover-bg)]">
                                    {team2.players.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500 text-sm">No players allowed in this team yet.</div>
                                    ) : (
                                        team2.players.map(player => {
                                            const isSelected = team2Playing11.some(p => p.id === player.id && p.name === player.name);
                                            return (
                                                <div
                                                    key={player.id || player.name}
                                                    className={`px-3 py-2.5 flex items-center justify-between cursor-pointer border-b border-[var(--card-border)] last:border-0 hover:bg-white dark:hover:bg-white/5 transition-all
                                                        ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                                    onClick={() => togglePlayerTeam2(player)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                                                            ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 dark:border-gray-600 text-transparent'}`}>
                                                            <UserCheck size={12} strokeWidth={3} />
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm ${isSelected ? 'font-semibold text-blue-700 dark:text-blue-300' : 'font-medium text-[var(--text)]'}`}>{player.name}</p>
                                                            <p className="text-[10px] text-gray-500 uppercase tracking-wide">{player.role}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Compact Toss Details & Submit */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        {/* Toss Winner */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">Toss Winner:</span>
                            <div className="flex bg-gray-100 dark:bg-black/20 rounded-lg p-1">
                                <button
                                    onClick={() => setTossWinner('team1')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 
                                        ${tossWinner === 'team1'
                                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    {team1 ? team1.name.substring(0, 15) + (team1.name.length > 15 ? '...' : '') : 'Team 1'}
                                </button>
                                <button
                                    onClick={() => setTossWinner('team2')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 
                                        ${tossWinner === 'team2'
                                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    {team2 ? team2.name.substring(0, 15) + (team2.name.length > 15 ? '...' : '') : 'Team 2'}
                                </button>
                            </div>
                        </div>

                        {/* Toss Decision */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">Decision:</span>
                            <div className="flex bg-gray-100 dark:bg-black/20 rounded-lg p-1">
                                <button
                                    onClick={() => setTossDecision('bat')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 
                                        ${tossDecision === 'bat'
                                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    Batting
                                </button>
                                <button
                                    onClick={() => setTossDecision('bowl')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 
                                        ${tossDecision === 'bowl'
                                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    Bowling
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-[var(--card-border)]">
                        <Button variant="primary" size="md" onClick={handleScheduleMatch} className="px-6">
                            Schedule Match
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchSchedule;
