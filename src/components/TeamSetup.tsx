import { useState, useCallback, useRef } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import MultiFieldSearch from './ui/MultiFieldSearch';
import { TeamService, Team } from '../services/teamService';
import { PlayerService } from '../services/playerService';
import { Trash2, Edit2, Eraser, Check, UserPlus, Save } from 'lucide-react';
import { Player } from '../types/player';
import { TeamData } from '../types/team';

interface TeamSetupProps {
    teamNumber: number;
    savedTeam: TeamData;
    players: Player[];
    onSaveTeam: (team: TeamData) => void;
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
            onSaveTeam({ name: teamName, location: teamLocation, id: teamId ? Number(teamId) : null });
            setTeamName('');
            setTeamLocation('');
            setTeamId('');
            setIsEditingTeam(false);
        }
    };

    const handleEditTeamClick = () => {
        setTeamName(savedTeam.name);
        setTeamLocation(savedTeam.location);
        setTeamId(savedTeam.id ? savedTeam.id.toString() : '');
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
                { id: playerId ? Number(playerId) : null, name: playerName, role: playerRole },
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
        setPlayerId(player.id ? player.id.toString() : '');
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
        <Card size="sm" className="border-none shadow-none bg-transparent !p-0">
            {/* Team Input or Saved Team Display */}
            {!savedTeam.name || isEditingTeam ? (
                // Show input form if team not saved
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <MultiFieldSearch
                        fields={[
                            {
                                label: 'TEAM NAME',
                                placeholder: 'Search by name...',
                                value: teamName,
                                onChange: handleTeamNameChange,
                                className: 'col-span-12 md:col-span-4',
                                inputClassName: '!text-[13px] h-9'
                            },
                            {
                                label: 'LOCATION',
                                placeholder: 'Search by location...',
                                value: teamLocation,
                                onChange: handleTeamLocationChange,
                                className: 'col-span-8 md:col-span-4',
                                inputClassName: '!text-[13px] h-9'
                            },
                            {
                                label: 'ID',
                                placeholder: 'ID',
                                value: teamId,
                                onChange: handleTeamIdChange,
                                className: 'col-span-4 md:col-span-2',
                                inputClassName: '!text-[13px] h-9'
                            },
                        ]}
                        suggestions={teamSuggestions}
                        showDropdown={showTeamDropdown}
                        onSelect={handleTeamSelect}
                        renderSuggestion={(team) => `${team.name} - ${team.location} - (${team.id})`}
                        actions={
                            <div className="flex gap-1.5 self-end">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleClearTeam}
                                    className="h-9 px-3"
                                    title="Clear team details"
                                >
                                    <Eraser size={16} />
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleSaveTeam}
                                    className="text-[11px] uppercase font-bold px-5 h-9 bg-cyan-600 gap-2"
                                    title="Save Team"
                                >
                                    <Save size={16} /> Confirm
                                </Button>
                            </div>
                        }
                    />
                </div>
            ) : (
                // Show saved team with Edit/Delete - Premium Slim Look
                <div className="rounded-sm border border-cyan-500/10 mb-3 bg-cyan-500/5 overflow-hidden animate-in fade-in duration-300">
                    <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm shadow-cyan-500/40">
                                {teamNumber}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-xs text-[var(--text)] tracking-tight uppercase">{savedTeam.name}</h4>
                                <div className="flex items-center gap-2 text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest leading-none mt-0.5">
                                    <span className="truncate">{savedTeam.location}</span>
                                    {savedTeam.id && <span className="text-cyan-600/50">#{savedTeam.id}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={handleEditTeamClick}
                                className="p-1.5 text-gray-400 hover:text-cyan-500 hover:bg-white/50 dark:hover:bg-white/5 rounded transition-colors"
                            >
                                <Edit2 size={12} />
                            </button>
                            <button
                                onClick={onDeleteTeam}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white/50 dark:hover:bg-white/5 rounded transition-colors"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Player Section - Compact */}
            <div className="space-y-2 pt-1">
                <div className="p-2 border border-[var(--card-border)] rounded-sm bg-[var(--card-bg)]">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                            {editingPlayerIndex !== null ? 'Modify Player' : 'Join Roster'}
                        </h4>
                        <div className="h-[1px] flex-1 mx-3 bg-[var(--card-border)]" />
                        <span className="text-[10px] font-bold text-cyan-500">{players.length}/11</span>
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-8 md:col-span-5">
                                    <Input
                                        type="text"
                                        label="NAME"
                                        placeholder="Full Name"
                                        value={playerName}
                                        onChange={handlePlayerNameChange}
                                        size="sm"
                                        className="!text-[13px] h-9"
                                    />
                                </div>
                                <div className="col-span-4 md:col-span-2">
                                    <Input
                                        type="text"
                                        label="ID"
                                        placeholder="ID"
                                        value={playerId}
                                        onChange={handlePlayerIdChange}
                                        size="sm"
                                        className="!text-[13px] h-9"
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-5">
                                    <Input
                                        type="select"
                                        label="ROLE"
                                        value={playerRole}
                                        onChange={handlePlayerRoleChange}
                                        size="sm"
                                        className="!text-[13px] h-9"
                                        placeholder="Select Role"
                                        options={[
                                            { value: 'batsman', label: 'Batsman' },
                                            { value: 'bowler', label: 'Bowler' },
                                            { value: 'allrounder', label: 'All-rounder' },
                                            { value: 'wicketkeeper', label: 'Wicket Keeper' },
                                        ]}
                                    />
                                </div>
                            </div>

                            {showPlayerDropdown && playerSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 z-50 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-sm shadow-xl mt-1 max-h-40 overflow-y-auto">
                                    {playerSuggestions.map((player: any, index: number) => (
                                        <div
                                            key={index}
                                            className="px-3 py-1.5 hover:bg-cyan-500/5 cursor-pointer text-[11px] text-[var(--text)] border-b last:border-0 border-gray-50 dark:border-gray-800"
                                            onClick={() => handlePlayerSelect(player)}
                                        >
                                            <span className="font-bold">{player.full_name}</span>
                                            <span className="text-[var(--text-secondary)] ml-2 text-[9px]">#{player.id}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-1.5 justify-end mt-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleClearPlayer}
                                className="h-9 px-3"
                                title="Clear form"
                            >
                                <Eraser size={16} />
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSavePlayer}
                                className="text-[11px] uppercase font-bold px-5 h-9 bg-gray-800 dark:bg-cyan-600 gap-2"
                                title={editingPlayerIndex !== null ? 'Update player details' : 'Add player to team'}
                            >
                                {editingPlayerIndex !== null ? (
                                    <>
                                        <Check size={16} /> Update
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={16} /> Add Player
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Players List - High-End Mini List */}
                {players.length > 0 && (
                    <div className="pt-1">
                        <div className="flex items-center gap-2 mb-2 px-1">
                            <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Roster List</span>
                            <div className="h-[1px] flex-1 bg-[var(--card-border)]" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {players.map((player, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between pl-2.5 pr-1.5 py-1.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-sm hover:border-cyan-500/30 hover:bg-cyan-500/[0.02] transition-all group"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-5 h-5 rounded-full bg-[var(--hover-bg)] flex items-center justify-center text-[9px] font-bold text-[var(--text-secondary)]">
                                            {index + 1}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-bold text-[11px] text-[var(--text)] truncate leading-none uppercase tracking-tight">{player.name}</span>
                                            <span className="text-[8px] font-bold text-cyan-500 uppercase mt-0.5 tracking-wider">{player.role}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditPlayerClick(index)}
                                            className="p-1 text-gray-400 hover:text-cyan-500 rounded transition-colors"
                                        >
                                            <Edit2 size={10} />
                                        </button>
                                        <button
                                            onClick={() => onDeletePlayer(index)}
                                            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                                        >
                                            <Trash2 size={10} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default TeamSetup;
