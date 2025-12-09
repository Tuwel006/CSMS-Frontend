import { useState, useCallback, useRef } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import MultiFieldSearch from './ui/MultiFieldSearch';
import { TeamService, Team } from '../services/teamService';
import { PlayerService } from '../services/playerService';
import { Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';

interface Player {
    id: string | null;
    name: string;
    role: string;
}

interface SavedTeam {
    name: string;
    location: string;
    id: string | null;
}

interface TeamSetupProps {
    teamNumber: number;
    savedTeam: SavedTeam;
    players: Player[];
    onSaveTeam: (team: SavedTeam) => void;
    onEditTeam: () => void;
    onDeleteTeam: () => void;
    onSavePlayer: (player: Player, editingIndex: number | null) => void;
    onEditPlayer: (index: number) => void;
    onDeletePlayer: (index: number) => void;
}

const TeamSetup = ({
    teamNumber,
    savedTeam,
    players,
    onSaveTeam,
    onEditTeam,
    onDeleteTeam,
    onSavePlayer,
    onEditPlayer,
    onDeletePlayer,
}: TeamSetupProps) => {
    // Team local inputs
    const [teamName, setTeamName] = useState('');
    const [teamLocation, setTeamLocation] = useState('');
    const [teamId, setTeamId] = useState('');
    const [teamSuggestions, setTeamSuggestions] = useState<Team[] | []>([]);
    const [showTeamDropdown, setShowTeamDropdown] = useState(false);

    // Player inputs
    const [playerName, setPlayerName] = useState('');
    const [playerId, setPlayerId] = useState('');
    const [playerRole, setPlayerRole] = useState('');
    const [playerSuggestions, setPlayerSuggestions] = useState<any[]>([]);
    const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);
    const [editingPlayerIndex, setEditingPlayerIndex] = useState<number | null>(null);

    // Collapsible states
    const [showPlayerInput, setShowPlayerInput] = useState(true);
    const [showPlayerList, setShowPlayerList] = useState(true);

    const [isEditingTeam, setIsEditingTeam] = useState(false);
    const searchTeamTimeout = useRef<number | null>(null);
    const searchPlayerTimeout = useRef<number | null>(null);

    // Team search handlers
    const debouncedSearchTeam = useCallback(
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
                        setTeamSuggestions(teams);
                        setShowTeamDropdown(teams.length > 0);
                    } catch (error) {
                        console.error('Search error:', error);
                        setShowTeamDropdown(false);
                    }
                } else {
                    setShowTeamDropdown(false);
                }
            };

            if (searchTeamTimeout.current) window.clearTimeout(searchTeamTimeout.current);
            searchTeamTimeout.current = window.setTimeout(searchFunction, 300);
        },
        []
    );

    const handleTeamNameChange = (value: string) => {
        setTeamName(value);
        setTeamId('');
        debouncedSearchTeam(value, teamLocation, '');
    };

    const handleTeamLocationChange = (value: string) => {
        setTeamLocation(value);
        debouncedSearchTeam(teamName, value, teamId);
    };

    const handleTeamIdChange = (value: string) => {
        setTeamId(value);
        debouncedSearchTeam(teamName, teamLocation, value);
    };

    const handleTeamSelect = (team: Team) => {
        setTeamName(team.name);
        setTeamLocation(team.location || '');
        setTeamId(team.id.toString());
        setShowTeamDropdown(false);
    };

    const handleSaveTeam = () => {
        if (teamName) {
            onSaveTeam({ name: teamName, location: teamLocation, id: teamId || null });
            setTeamName('');
            setTeamLocation('');
            setTeamId('');
            setIsEditingTeam(false);
        }
    };

    const handleEditTeamClick = () => {
        setTeamName(savedTeam.name);
        setTeamLocation(savedTeam.location);
        setTeamId(savedTeam.id || '');
        setIsEditingTeam(true);
        onEditTeam();
    };

    const handleClearTeam = () => {
        setTeamName('');
        setTeamLocation('');
        setTeamId('');
    };

    // Player search handlers
    const debouncedSearchPlayer = useCallback(
        (name: string, id: string) => {
            const searchFunction = async () => {
                if (name || id) {
                    try {
                        const params: Record<string, string> = {};
                        if (name) params.name = name;
                        if (id) params.id = id;

                        const response = await PlayerService.search(params);
                        const players = response?.data?.data || [];
                        setPlayerSuggestions(players);
                        setShowPlayerDropdown(players.length > 0);
                    } catch (error) {
                        console.error('Player search error:', error);
                        setShowPlayerDropdown(false);
                    }
                } else {
                    setShowPlayerDropdown(false);
                }
            };

            if (searchPlayerTimeout.current) window.clearTimeout(searchPlayerTimeout.current);
            searchPlayerTimeout.current = window.setTimeout(searchFunction, 300);
        },
        []
    );

    const handlePlayerNameChange = (value: string) => {
        setPlayerName(value);
        setPlayerId('');
        debouncedSearchPlayer(value, '');
    };

    const handlePlayerIdChange = (value: string) => {
        setPlayerId(value);
        debouncedSearchPlayer(playerName, value);
    };

    const handlePlayerSelect = (player: any) => {
        setPlayerName(player.full_name);
        setPlayerId(player.id.toString());
        setShowPlayerDropdown(false);
    };

    const handlePlayerRoleChange = (value: string) => {
        setPlayerRole(value);
    };

    const handleSavePlayer = () => {
        if (playerName && playerRole) {
            onSavePlayer(
                { id: playerId || null, name: playerName, role: playerRole },
                editingPlayerIndex
            );
            setPlayerName('');
            setPlayerId('');
            setPlayerRole('');
            setEditingPlayerIndex(null);
        }
    };

    const handleEditPlayerClick = (index: number) => {
        const player = players[index];
        setPlayerName(player.name);
        setPlayerId(player.id || '');
        setPlayerRole(player.role);
        setEditingPlayerIndex(index);
        onEditPlayer(index);
    };

    const handleClearPlayer = () => {
        setPlayerName('');
        setPlayerId('');
        setPlayerRole('');
        setEditingPlayerIndex(null);
    };

    return (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Team {teamNumber}</h3>
            <p className="text-sm text-gray-600 mb-4">
                Build your {teamNumber === 1 ? 'first' : 'second'} team
            </p>

            {/* Team Input or Saved Team Display */}
            {!savedTeam.name || isEditingTeam ? (
                // Show input form if team not saved
                <MultiFieldSearch
                    fields={[
                        {
                            label: 'Name',
                            placeholder: 'Search by name...',
                            value: teamName,
                            onChange: handleTeamNameChange,
                            className: 'flex-1',
                        },
                        {
                            label: 'Location',
                            placeholder: 'Search by location...',
                            value: teamLocation,
                            onChange: handleTeamLocationChange,
                            className: 'flex-1',
                        },
                        {
                            label: 'ID',
                            placeholder: 'Search by ID...',
                            value: teamId,
                            onChange: handleTeamIdChange,
                            className: 'w-20',
                        },
                    ]}
                    suggestions={teamSuggestions}
                    showDropdown={showTeamDropdown}
                    onSelect={handleTeamSelect}
                    renderSuggestion={(team) => `${team.name} - ${team.location} - (${team.id})`}
                    actions={
                        <>
                            <Button variant="secondary" onClick={handleClearTeam}>
                                Clear
                            </Button>
                            <Button variant="primary" onClick={handleSaveTeam}>
                                Save
                            </Button>
                        </>
                    }
                />
            ) : (
                // Show saved team with Edit/Delete
                <div className="rounded-md border border-[var(--card-border)] mb-4 bg-[var(--card-bg)] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between p-3.5">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 w-8 h-8 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm">
                                T{teamNumber}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-base text-[var(--text)] truncate">{savedTeam.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                                    <span className="truncate">{savedTeam.location}</span>
                                    {savedTeam.id && (
                                        <>
                                            <span className="text-gray-400">•</span>
                                            <span>ID: {savedTeam.id}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                            <button
                                onClick={handleEditTeamClick}
                                className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                title="Edit team"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={onDeleteTeam}
                                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                title="Delete team"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Player Section - Collapsible */}
            <div className="space-y-4 mt-4 border-t border-[var(--card-border)] pt-4">
                {/* Player Input Section */}
                <div>
                    <button
                        onClick={() => setShowPlayerInput(!showPlayerInput)}
                        className="flex items-center justify-between w-full text-left mb-3 hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded transition-colors"
                    >
                        <h4 className="text-md font-semibold text-[var(--text)]">
                            {editingPlayerIndex !== null ? 'Edit Player' : 'Add Player'}
                        </h4>
                        {showPlayerInput ? (
                            <ChevronUp size={20} className="text-gray-500" />
                        ) : (
                            <ChevronDown size={20} className="text-gray-500" />
                        )}
                    </button>

                    {showPlayerInput && (
                        <div className="space-y-3">
                            {/* Player Name, ID, and Role in one row */}
                            <div className="relative">
                                <div className="flex flex-col md:flex-row gap-2 mb-2">
                                    <Input
                                        type="text"
                                        label="Player Name"
                                        placeholder="Search by name..."
                                        value={playerName}
                                        onChange={handlePlayerNameChange}
                                        size="md"
                                        containerClassName="flex-1"
                                    />
                                    <Input
                                        type="text"
                                        label="Player ID"
                                        placeholder="Search by ID..."
                                        value={playerId}
                                        onChange={handlePlayerIdChange}
                                        size="md"
                                        containerClassName="w-24"
                                    />
                                    <Input
                                        type="select"
                                        label="Player Role"
                                        placeholder="Select role..."
                                        value={playerRole}
                                        onChange={handlePlayerRoleChange}
                                        size="md"
                                        containerClassName="flex-1"
                                        options={[
                                            { value: 'batsman', label: 'Batsman' },
                                            { value: 'bowler', label: 'Bowler' },
                                            { value: 'allrounder', label: 'All-rounder' },
                                            { value: 'wicketkeeper', label: 'Wicket Keeper' },
                                        ]}
                                    />
                                </div>

                                {/* Suggestions Dropdown */}
                                {showPlayerDropdown && playerSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 z-50 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md shadow-lg max-h-48 overflow-y-auto">
                                        {playerSuggestions.map((player: any, index: number) => (
                                            <div
                                                key={index}
                                                className="px-3 py-2 hover:bg-[var(--hover-bg)] cursor-pointer text-sm text-[var(--text)]"
                                                onClick={() => handlePlayerSelect(player)}
                                            >
                                                {player.full_name} - ({player.id})
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Buttons at bottom right */}
                            <div className="flex gap-2 justify-end">
                                <Button variant="secondary" onClick={handleClearPlayer}>
                                    Clear
                                </Button>
                                <Button variant="primary" onClick={handleSavePlayer}>
                                    {editingPlayerIndex !== null ? 'Update' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Players List - Collapsible */}
                {players.length > 0 && (
                    <div className="border-t border-[var(--card-border)] pt-3">
                        <button
                            onClick={() => setShowPlayerList(!showPlayerList)}
                            className="flex items-center justify-between w-full text-left mb-2 hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded transition-colors"
                        >
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Team {teamNumber} Players ({players.length})
                            </h4>
                            {showPlayerList ? (
                                <ChevronUp size={18} className="text-gray-500" />
                            ) : (
                                <ChevronDown size={18} className="text-gray-500" />
                            )}
                        </button>

                        {showPlayerList && (
                            <div className="space-y-1.5">
                                {players.map((player, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between px-3 py-2 bg-[var(--hover-bg)] rounded-md border border-[var(--card-border)] hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <span className="font-medium text-sm text-[var(--text)] truncate">{player.name}</span>
                                            {player.id && (
                                                <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                                    #{player.id}
                                                </span>
                                            )}
                                            <span className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full capitalize">
                                                {player.role}
                                            </span>
                                        </div>
                                        <div className="flex gap-1 ml-2">
                                            <button
                                                onClick={() => handleEditPlayerClick(index)}
                                                className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors opacity-70 group-hover:opacity-100"
                                                title="Edit player"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => onDeletePlayer(index)}
                                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors opacity-70 group-hover:opacity-100"
                                                title="Delete player"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamSetup;
