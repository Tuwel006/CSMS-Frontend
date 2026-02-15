import { useState } from 'react';
import { Stack } from '../components/ui/lib/Stack';
import { Box } from '../components/ui/lib/Box';
import Card from '../components/ui/lib/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import {
    Trophy,
    Plus,
    Users,
    Link,
    ClipboardList,
    UserPlus,
    Calendar,
    MapPin,
    ChevronDown,
    ShieldCheck,
    Settings
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { showToast } from '../utils/toast';

// Types
interface Player {
    id: string;
    name: string;
    email: string;
    role?: string;
    status: 'pending' | 'registered';
}

interface Team {
    id: string;
    name: string;
    captain: string;
    captainEmail: string;
    captainLink: string;
    players: Player[];
    logo?: string;
    status: 'draft' | 'active';
}

interface Tournament {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    format: string;
    teams: Team[];
    maxTeams: number;
    status: 'draft' | 'active' | 'completed';
}

const TournamentManagement = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // State
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [activeView, setActiveView] = useState<'list' | 'details'>('list');
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});

    // Modal States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [showLinkShareModal, setShowLinkShareModal] = useState(false);
    const [teamModalMode, setTeamModalMode] = useState<'add' | 'edit'>('add');

    // Link Share State
    const [linkType, setLinkType] = useState<'team' | 'player'>('team');
    const [shareLink, setShareLink] = useState('');

    // Form States
    const [tournamentForm, setTournamentForm] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        format: 'T20',
        maxTeams: 8,
        autoGenerateTeams: true
    });

    const [teamForm, setTeamForm] = useState({
        name: '',
        captain: '',
        captainEmail: ''
    });

    const [playerForm, setPlayerForm] = useState({
        name: '',
        email: '',
        role: ''
    });

    const toggleTeamExpansion = (teamId: string) => {
        setExpandedTeams(prev => ({
            ...prev,
            [teamId]: !prev[teamId]
        }));
    };

    // Handlers
    const handleCreateTournament = () => {
        const teams: Team[] = [];

        if (tournamentForm.autoGenerateTeams) {
            for (let i = 1; i <= tournamentForm.maxTeams; i++) {
                teams.push({
                    id: Math.random().toString(36).substr(2, 9),
                    name: `Team ${i}`,
                    captain: 'TBD',
                    captainEmail: '',
                    captainLink: `https://csms.app/join/team/${Math.random().toString(36).substr(2, 9)}`,
                    players: [],
                    status: 'draft'
                });
            }
        }

        const newTournament: Tournament = {
            id: Math.random().toString(36).substr(2, 9),
            ...tournamentForm,
            teams: teams,
            status: 'draft'
        };

        setTournaments([...tournaments, newTournament]);
        setShowCreateModal(false);
        setTournamentForm({
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            location: '',
            format: 'T20',
            maxTeams: 8,
            autoGenerateTeams: true
        });
    };

    const handleAddTeam = () => {
        if (!selectedTournament) return;

        if (teamModalMode === 'add') {
            const newTeam: Team = {
                id: Math.random().toString(36).substr(2, 9),
                ...teamForm,
                captainLink: `https://csms.app/join/team/${Math.random().toString(36).substr(2, 9)}`,
                players: [],
                status: 'draft'
            };

            setTournaments(tournaments.map(t =>
                t.id === selectedTournament.id
                    ? { ...t, teams: [...t.teams, newTeam] }
                    : t
            ));

            // Update selected tournament for details view
            setSelectedTournament({
                ...selectedTournament,
                teams: [...selectedTournament.teams, newTeam]
            });
        } else if (selectedTeam) {
            setTournaments(tournaments.map(t =>
                t.id === selectedTournament.id
                    ? {
                        ...t,
                        teams: t.teams.map(team =>
                            team.id === selectedTeam.id
                                ? { ...team, ...teamForm, status: 'active' }
                                : team
                        )
                    }
                    : t
            ));

            setSelectedTournament({
                ...selectedTournament,
                teams: selectedTournament.teams.map(team =>
                    team.id === selectedTeam.id
                        ? { ...team, ...teamForm, status: 'active' }
                        : team
                )
            });
        }

        setShowTeamModal(false);
        setTeamForm({ name: '', captain: '', captainEmail: '' });
    };

    const handleAddPlayer = () => {
        if (!selectedTournament || !selectedTeam) return;

        const newPlayer: Player = {
            id: Math.random().toString(36).substr(2, 9),
            ...playerForm,
            status: 'pending'
        };

        setTournaments(tournaments.map(t =>
            t.id === selectedTournament.id
                ? {
                    ...t,
                    teams: t.teams.map(team =>
                        team.id === selectedTeam.id
                            ? { ...team, players: [...team.players, newPlayer] }
                            : team
                    )
                }
                : t
        ));

        setSelectedTournament(prev => (
            prev ? {
                ...prev,
                teams: prev.teams.map(team =>
                    team.id === selectedTeam.id
                        ? { ...team, players: [...team.players, newPlayer] }
                        : team
                )
            } : null
        ));

        setShowPlayerModal(false);
        setPlayerForm({ name: '', email: '', role: '' });
    };

    const generatePlayerLink = (player: Player) => {
        return `https://csms.app/register/${player.id}/${Math.random().toString(36).substr(2, 9)}`;
    };

    const handleShareLink = (type: 'team' | 'player', link: string) => {
        setLinkType(type);
        setShareLink(link);
        setShowLinkShareModal(true);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast.success("Link copied to clipboard!");
    };

    return (
        <main className={`min-h-screen bg-[var(--bg)] transition-colors duration-200`}>
            {/* Header */}
            <header className={`sticky top-0 z-40 backdrop-blur-md bg-[var(--header-bg)]/80 border-b border-[var(--card-border)]`}>
                <Stack direction="row" align="center" justify="between" className="px-3 sm:px-4 py-2.5 max-w-7xl mx-auto">
                    <Stack direction="row" align="center" gap="sm">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-cyan-600/10 flex items-center justify-center border border-cyan-600/20">
                            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600" />
                        </div>
                        <Stack gap="none">
                            <h1 className="text-[11px] sm:text-sm font-black text-[var(--text)] uppercase tracking-wider">Tournament Management</h1>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Live Portal</span>
                            </div>
                        </Stack>
                    </Stack>

                    <Stack direction="row" gap="xs">
                        {activeView === 'details' && (
                            <button
                                onClick={() => {
                                    setActiveView('list');
                                    setSelectedTournament(null);
                                }}
                                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-cyan-600 border border-[var(--card-border)] rounded-sm transition-all"
                            >
                                <ChevronDown size={14} className="rotate-90" />
                                Back to List
                            </button>
                        )}
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-3 py-1.5 sm:py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] rounded-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
                        >
                            <Plus size={14} strokeWidth={3} />
                            <span className="hidden sm:inline">New Tournament</span>
                            <span className="sm:hidden">New</span>
                        </button>
                    </Stack>
                </Stack>
            </header>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
                {activeView === 'list' ? (
                    <Stack gap="md">
                        {/* Tournament Statistics */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                            <Box className="p-4 border border-[var(--card-border)] bg-[var(--card-bg)] rounded-sm relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <ClipboardList size={32} className="text-cyan-600" />
                                </div>
                                <Stack gap="xs">
                                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Total Events</span>
                                    <p className="text-2xl font-black text-[var(--text)] tracking-tight">{tournaments.length}</p>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-cyan-600" />
                                        <span className="text-[8px] font-bold text-[var(--text-secondary)] uppercase">System Records</span>
                                    </div>
                                </Stack>
                            </Box>

                            <Box className="p-4 border border-[var(--card-border)] bg-[var(--card-bg)] rounded-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <UserPlus size={16} className="text-emerald-600" />
                                </div>
                                <Stack gap="xs">
                                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Active Teams</span>
                                    <p className="text-2xl font-black text-[var(--text)] tracking-tight">
                                        {tournaments.reduce((sum, t) => sum + t.teams.length, 0)}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-emerald-600" />
                                        <span className="text-[8px] font-bold text-[var(--text-secondary)] uppercase">Verified Rosters</span>
                                    </div>
                                </Stack>
                            </Box>

                            <Box className="p-4 border border-[var(--card-border)] bg-[var(--card-bg)] rounded-sm relative overflow-hidden group hover:border-purple-500/30 transition-all">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Users size={32} className="text-purple-600" />
                                </div>
                                <Stack gap="xs">
                                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Total Players</span>
                                    <p className="text-2xl font-black text-[var(--text)] tracking-tight">
                                        {tournaments.reduce((sum, t) => sum + t.teams.reduce((tSum, team) => tSum + team.players.length, 0), 0)}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-purple-600" />
                                        <span className="text-[8px] font-bold text-[var(--text-secondary)] uppercase">Registered</span>
                                    </div>
                                </Stack>
                            </Box>

                            <Box className="p-4 border border-[var(--card-border)] bg-[var(--card-bg)] rounded-sm relative overflow-hidden group hover:border-amber-500/30 transition-all">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Trophy size={32} className="text-amber-600" />
                                </div>
                                <Stack gap="xs">
                                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Live Events</span>
                                    <p className="text-2xl font-black text-[var(--text)] tracking-tight">
                                        {tournaments.filter(t => t.status === 'active').length}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />
                                        <span className="text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-widest leading-none">Scoring Now</span>
                                    </div>
                                </Stack>
                            </Box>
                        </div>

                        {/* Tournaments List Content */}
                        <Stack gap="sm">
                            <Stack direction="row" align="center" justify="between">
                                <Stack gap="none">
                                    <h2 className="text-[11px] sm:text-xs font-black text-[var(--text)] uppercase tracking-widest">Tournament Registry</h2>
                                    <span className="text-[8px] sm:text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter opacity-60">Master Record of all events</span>
                                </Stack>
                                <div className="flex gap-1.5 backdrop-blur-sm bg-slate-500/5 p-1 rounded-sm border border-[var(--card-border)]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                                </div>
                            </Stack>

                            {tournaments.length === 0 ? (
                                <Card p="md">
                                    <Stack align="center" gap="sm" className="py-5 sm:py-6">
                                        <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--text-secondary)] opacity-50" />
                                        <Stack align="center" gap="xs">
                                            <h3 className="text-[10px] sm:text-xs font-semibold text-[var(--text)]">No Tournaments Yet</h3>
                                            <p className="text-xs sm:text-[10px] sm:text-xs text-[var(--text-secondary)]">Create your first tournament to get started</p>
                                        </Stack>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            leftIcon={<Plus className="w-3 h-3" />}
                                            onClick={() => setShowCreateModal(true)}
                                        >
                                            Create Tournament
                                        </Button>
                                    </Stack>
                                </Card>
                            ) : (
                                <Stack gap="sm">
                                    {tournaments.map((tournament) => (
                                        <Card
                                            key={tournament.id}
                                            p="none"
                                            className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                            onClick={() => {
                                                setSelectedTournament(tournament);
                                                setActiveView('details');
                                            }}
                                        >
                                            <Stack gap="none">
                                                {/* Tournament Header with Premium Look */}
                                                <Box
                                                    className={`px-3 sm:px-4 py-3 sm:py-4 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/20' : 'bg-gradient-to-br from-white via-white to-blue-50/30'} border-b border-[var(--card-border)] relative overflow-hidden`}
                                                >
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                                                    <Stack direction="row" align="center" justify="between">
                                                        <Stack gap="xs">
                                                            <Stack direction="row" align="center" gap="sm">
                                                                <div className={`p-2 rounded-sm ${tournament.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'} border border-current/10 shadow-sm`}>
                                                                    <Trophy size={14} className={tournament.status === 'active' ? 'animate-pulse' : ''} />
                                                                </div>
                                                                <Stack gap="none">
                                                                    <h3 className="text-[13px] sm:text-sm font-black text-[var(--text)] tracking-tight group-hover:text-cyan-600 transition-colors uppercase">
                                                                        {tournament.name}
                                                                    </h3>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`px-1.5 py-0.5 text-[7px] font-black rounded uppercase tracking-[0.2em] border ${tournament.status === 'active'
                                                                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                                                                            : 'bg-slate-500/10 text-slate-500 border-slate-500/20 shadow-none'
                                                                            }`}>
                                                                            {tournament.status}
                                                                        </span>
                                                                        <span className="text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter opacity-40">ID: {tournament.id.toUpperCase()}</span>
                                                                    </div>
                                                                </Stack>
                                                            </Stack>
                                                        </Stack>
                                                        <div className="flex items-center gap-2">
                                                            <div className="hidden sm:flex flex-col items-end mr-2">
                                                                <span className="text-[7px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-60">Series Progress</span>
                                                                <div className="flex gap-1 mt-1">
                                                                    <div className="w-4 h-1 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.4)]" />
                                                                    <div className="w-4 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                                                                    <div className="w-4 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                                                                </div>
                                                            </div>
                                                            <ChevronDown size={16} className="-rotate-90 text-slate-400 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                        </div>
                                                    </Stack>
                                                </Box>

                                                {/* Tournament Details */}
                                                <div className="px-3 sm:px-4 py-2.5 sm:py-3 grid grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-2">
                                                    <Stack gap="xs">
                                                        <Stack direction="row" align="center" gap="xs">
                                                            <Calendar className="w-2.5 h-2.5 text-[var(--text-secondary)] opacity-50" />
                                                            <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Date Range</span>
                                                        </Stack>
                                                        <p className="text-[10px] font-bold text-[var(--text)] truncate">
                                                            {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                                                        </p>
                                                    </Stack>

                                                    <Stack gap="xs">
                                                        <Stack direction="row" align="center" gap="xs">
                                                            <MapPin className="w-2.5 h-2.5 text-[var(--text-secondary)] opacity-50" />
                                                            <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Arena</span>
                                                        </Stack>
                                                        <p className="text-[10px] font-bold text-[var(--text)] truncate">{tournament.location}</p>
                                                    </Stack>

                                                    <Stack gap="xs">
                                                        <Stack direction="row" align="center" gap="xs">
                                                            <UserPlus className="w-2.5 h-2.5 text-[var(--text-secondary)] opacity-50" />
                                                            <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Squads</span>
                                                        </Stack>
                                                        <p className="text-[10px] font-bold text-[var(--text)]">
                                                            {tournament.teams.length} / {tournament.maxTeams} Active
                                                        </p>
                                                    </Stack>

                                                    <Stack gap="xs">
                                                        <Stack direction="row" align="center" gap="xs">
                                                            <Trophy className="w-2.5 h-2.5 text-[var(--text-secondary)] opacity-50" />
                                                            <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Mode</span>
                                                        </Stack>
                                                        <p className="text-[10px] font-bold text-[var(--text)]">{tournament.format}</p>
                                                    </Stack>
                                                </div>
                                            </Stack>
                                        </Card>
                                    ))}
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                ) : (
                    // Tournament Details View
                    selectedTournament && (
                        <Stack gap="md">
                            {/* Tournament Detail Header */}
                            <Box className="p-3 sm:p-4 border border-[var(--card-border)] bg-[var(--card-bg)] rounded-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent pointer-events-none" />
                                <Stack gap="md">
                                    <Stack direction="row" align="center" justify="between">
                                        <Stack gap="none">
                                            <h2 className="text-[14px] sm:text-base font-black text-[var(--text)] uppercase tracking-tight">{selectedTournament.name}</h2>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                                                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-cyan-600/80">Active Management Console</span>
                                            </div>
                                        </Stack>
                                        <button
                                            onClick={() => {
                                                setTeamModalMode('add');
                                                setTeamForm({ name: '', captain: '', captainEmail: '' });
                                                setShowTeamModal(true);
                                            }}
                                            disabled={selectedTournament.teams.length >= selectedTournament.maxTeams}
                                            className="px-3.5 py-1.5 sm:py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] rounded-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 group disabled:opacity-50 active:scale-95"
                                        >
                                            <Plus size={14} strokeWidth={3} />
                                            <span>New Team</span>
                                        </button>
                                    </Stack>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-2.5 sm:p-3 bg-slate-500/5 rounded-sm border border-[var(--card-border)]">
                                        <Stack gap="none">
                                            <span className="text-[7px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">Format</span>
                                            <p className="text-[10px] font-bold text-[var(--text)]">{selectedTournament.format}</p>
                                        </Stack>
                                        <Stack gap="none">
                                            <span className="text-[7px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">Squad Slots</span>
                                            <div className="flex items-end gap-1.5 text-[10px]">
                                                <p className="font-bold text-[var(--text)] leading-none">{selectedTournament.teams.length}/{selectedTournament.maxTeams}</p>
                                                <div className="w-12 sm:w-16 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mb-0.5">
                                                    <div className="h-full bg-cyan-600 rounded-full" style={{ width: `${(selectedTournament.teams.length / selectedTournament.maxTeams) * 100}%` }} />
                                                </div>
                                            </div>
                                        </Stack>
                                        <Stack gap="none">
                                            <span className="text-[7px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">Date</span>
                                            <p className="text-[10px] font-bold text-[var(--text)]">
                                                {new Date(selectedTournament.startDate).toLocaleDateString()}
                                            </p>
                                        </Stack>
                                        <Stack gap="none">
                                            <span className="text-[7px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">Arena</span>
                                            <p className="text-[10px] font-bold text-[var(--text)] uppercase tracking-tight truncate">{selectedTournament.location}</p>
                                        </Stack>
                                    </div>
                                </Stack>
                            </Box>

                            {/* Teams Section */}
                            <Stack gap="sm">
                                <Stack direction="row" align="center" justify="between">
                                    <h3 className="text-[10px] sm:text-xs font-bold text-[var(--text)] uppercase tracking-wider">Teams ({selectedTournament.teams.length})</h3>
                                    {selectedTournament.teams.length > 0 && (
                                        <Stack direction="row" gap="xs">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-[9px] uppercase font-bold tracking-tighter px-2"
                                                onClick={() => {
                                                    const allExpanded: Record<string, boolean> = {};
                                                    selectedTournament.teams.forEach(t => allExpanded[t.id] = true);
                                                    setExpandedTeams(allExpanded);
                                                }}
                                            >
                                                Expand All
                                            </Button>
                                            <span className="text-[var(--text-secondary)] opacity-30 text-[10px]">|</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-[9px] uppercase font-bold tracking-tighter px-2"
                                                onClick={() => setExpandedTeams({})}
                                            >
                                                Collapse All
                                            </Button>
                                        </Stack>
                                    )}
                                </Stack>

                                {selectedTournament.teams.length === 0 ? (
                                    <Card p="xl">
                                        <Stack align="center" gap="md" className="py-5 sm:py-6">
                                            <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--text-secondary)] opacity-50" />
                                            <Stack align="center" gap="xs">
                                                <h4 className="text-[10px] sm:text-xs font-semibold text-[var(--text)]">No Teams Added</h4>
                                                <p className="text-[9px] sm:text-[10px] text-[var(--text-secondary)]">Add teams to this tournament</p>
                                            </Stack>
                                            <Button
                                                variant="primary"
                                                leftIcon={<Plus className="w-4 h-4" />}
                                                onClick={() => setShowTeamModal(true)}
                                            >
                                                Add First Team
                                            </Button>
                                        </Stack>
                                    </Card>
                                ) : (
                                    <Stack gap="md">
                                        {selectedTournament.teams.map((team) => (
                                            <Card key={team.id} p="none" className="overflow-hidden hover:shadow-lg transition-shadow">
                                                <Stack gap="none">
                                                    {/* Team Header - Refined Premium */}
                                                    <Box
                                                        className={`px-3 sm:px-4 py-3 sm:py-3.5 cursor-pointer select-none bg-[var(--card-bg)] border-b border-[var(--card-border)] hover:bg-slate-500/5 transition-all outline-none relative overflow-hidden`}
                                                        onClick={() => toggleTeamExpansion(team.id)}
                                                    >
                                                        <div className={`absolute top-0 left-0 w-1 h-full ${team.status === 'draft' ? 'bg-amber-500/30' : 'bg-emerald-500/30'}`} />
                                                        <Stack direction="row" align="center" justify="between">
                                                            <Stack direction="row" align="center" gap="sm" className="sm:gap-4">
                                                                <div className={`p-2 rounded-sm ${team.status === 'draft' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'} border border-current/10 shadow-sm transition-transform group-hover:scale-105`}>
                                                                    {team.status === 'draft' ? <ClipboardList size={14} /> : <ShieldCheck size={14} className="animate-in zoom-in-50" />}
                                                                </div>
                                                                <Stack gap="none">
                                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                                        <h4 className={`text-[12px] sm:text-[13px] font-black uppercase tracking-tight ${team.status === 'draft' ? 'text-[var(--text-secondary)] opacity-40' : 'text-[var(--text)]'}`}>
                                                                            {team.name}
                                                                        </h4>
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className={`px-1.5 py-0.5 text-[6px] sm:text-[7px] font-black rounded uppercase tracking-[0.2em] border ${team.status === 'active'
                                                                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                                                                                : 'bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                                                                                }`}>
                                                                                {team.status === 'draft' ? 'Reserved' : 'Certified'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                                        <span className="text-[7px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-50">Captain:</span>
                                                                        <span className="text-[9px] font-black text-[var(--text)] uppercase tracking-tight">{team.captain}</span>
                                                                    </div>
                                                                </Stack>
                                                            </Stack>

                                                            <Stack direction="row" align="center" gap="md">
                                                                <div className="hidden sm:flex flex-col items-end gap-1 mr-2">
                                                                    <span className="text-[7px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Roster Strength</span>
                                                                    <div className="flex items-center gap-1">
                                                                        {[1, 2, 3, 4, 5].map((i) => (
                                                                            <div key={i} className={`w-3 h-1 rounded-full ${i <= (team.players.length / 3) ? 'bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.4)]' : 'bg-slate-200 dark:bg-slate-800'}`} />
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleShareLink('team', team.captainLink);
                                                                        }}
                                                                        className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-500/10 rounded-sm transition-all"
                                                                        title="Share Link"
                                                                    >
                                                                        <Link size={12} />
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedTeam(team);
                                                                            setTeamForm({
                                                                                name: team.name,
                                                                                captain: team.captain,
                                                                                captainEmail: team.captainEmail
                                                                            });
                                                                            setTeamModalMode('edit');
                                                                            setShowTeamModal(true);
                                                                        }}
                                                                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-sm transition-all"
                                                                        title="Settings"
                                                                    >
                                                                        <Settings size={12} />
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedTeam(team);
                                                                            setShowPlayerModal(true);
                                                                        }}
                                                                        className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-sm transition-all"
                                                                        title="Add Member"
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
                                                                    <div className="w-[1px] h-4 bg-[var(--card-border)] mx-1" />
                                                                    <div className={`p-1 transition-transform duration-300 ${expandedTeams[team.id] ? 'rotate-180 text-cyan-500' : 'text-slate-400'}`}>
                                                                        <ChevronDown size={14} />
                                                                    </div>
                                                                </div>
                                                            </Stack>
                                                        </Stack>
                                                    </Box>

                                                    {/* Players List - Collapsible */}
                                                    {expandedTeams[team.id] && (
                                                        <Box p="sm" className={`border-t border-[var(--card-border)] animate-in slide-in-from-top-2 duration-200 ${isDark ? 'bg-gray-900/20' : 'bg-gray-50/30'}`}>
                                                            {team.players.length === 0 ? (
                                                                <Stack align="center" gap="xs" className="py-4">
                                                                    <Users className="w-5 h-5 text-[var(--text-secondary)] opacity-30" />
                                                                    <p className="text-[9px] sm:text-[10px] text-[var(--text-secondary)] uppercase tracking-tight">No players added to roster</p>
                                                                </Stack>
                                                            ) : (
                                                                <Stack gap="xs">
                                                                    <Stack direction="row" align="center" justify="between" className="px-1 mb-1">
                                                                        <h5 className="text-[9px] sm:text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Roster ({team.players.length}/16)</h5>
                                                                        <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Registration Open</span>
                                                                    </Stack>
                                                                    <Stack gap="xs">
                                                                        {team.players.map((player, index) => {
                                                                            const isCaptainInList = player.name === team.captain;
                                                                            return (
                                                                                <Box
                                                                                    key={player.id}
                                                                                    p="xs"
                                                                                    className={`rounded-lg border ${isDark ? (isCaptainInList ? 'bg-blue-900/20 border-blue-500/30' : 'bg-gray-800/40 border-gray-700/50') : (isCaptainInList ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200')} hover:scale-[1.005] transition-all`}
                                                                                >
                                                                                    <Stack direction="row" align="center" justify="between">
                                                                                        <Stack direction="row" align="center" gap="sm">
                                                                                            <span className={`flex items-center justify-center w-5 h-5 rounded text-[8px] font-black ${isCaptainInList
                                                                                                ? 'bg-blue-500 text-white'
                                                                                                : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500')
                                                                                                }`}>
                                                                                                {index + 1}
                                                                                            </span>
                                                                                            <Stack gap="none">
                                                                                                <Stack direction="row" align="center" gap="xs">
                                                                                                    <span className={`text-[10px] sm:text-xs font-bold ${isCaptainInList ? 'text-blue-600 dark:text-blue-400' : 'text-[var(--text)]'}`}>
                                                                                                        {player.name}
                                                                                                    </span>
                                                                                                    {isCaptainInList && (
                                                                                                        <Stack direction="row" align="center" gap="none" className="bg-blue-500/10 text-blue-500 px-1 rounded border border-blue-500/20">
                                                                                                            <ShieldCheck className="w-2.5 h-2.5" />
                                                                                                            <span className="text-[8px] font-black uppercase tracking-tighter ml-0.5">Capt</span>
                                                                                                        </Stack>
                                                                                                    )}
                                                                                                    {player.role && !isCaptainInList && (
                                                                                                        <span className="text-[9px] text-[var(--text-secondary)] font-medium">/ {player.role}</span>
                                                                                                    )}
                                                                                                </Stack>
                                                                                                <span className="text-[9px] sm:text-[10px] text-[var(--text-secondary)] font-mono opacity-80">{player.email}</span>
                                                                                            </Stack>
                                                                                        </Stack>

                                                                                        <Stack direction="row" align="center" gap="sm">
                                                                                            <span className={`px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black uppercase rounded tracking-tighter border ${player.status === 'registered'
                                                                                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                                                                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                                                                                }`}>
                                                                                                {player.status}
                                                                                            </span>

                                                                                            {player.status === 'pending' && (
                                                                                                <Button
                                                                                                    variant="ghost"
                                                                                                    size="sm"
                                                                                                    className="h-6 w-6 p-0"
                                                                                                    onClick={() => handleShareLink('player', generatePlayerLink(player))}
                                                                                                >
                                                                                                    <Link className="w-3 h-3 text-blue-500" />
                                                                                                </Button>
                                                                                            )}
                                                                                        </Stack>
                                                                                    </Stack>
                                                                                </Box>
                                                                            );
                                                                        })}
                                                                    </Stack>
                                                                </Stack>
                                                            )}
                                                        </Box>
                                                    )}
                                                </Stack>
                                            </Card>
                                        ))}
                                    </Stack>
                                )}
                            </Stack>
                        </Stack>
                    )
                )}
            </section>

            {/* Modals */}

            {/* Create Tournament Modal */}
            {showCreateModal && (
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    title="Create New Tournament"
                >
                    <Stack gap="md">
                        <Input
                            label="Tournament Name"
                            placeholder="e.g., Summer Championship 2026"
                            value={tournamentForm.name}
                            onChange={(value: string) => setTournamentForm({ ...tournamentForm, name: value })}
                            required
                        />

                        <Input
                            label="Description"
                            type="textarea"
                            placeholder="Brief description of the tournament"
                            value={tournamentForm.description}
                            onChange={(value: string) => setTournamentForm({ ...tournamentForm, description: value })}
                            rows={3}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <Input
                                label="Start Date"
                                type="date"
                                value={tournamentForm.startDate}
                                onChange={(value: string) => setTournamentForm({ ...tournamentForm, startDate: value })}
                                required
                            />

                            <Input
                                label="End Date"
                                type="date"
                                value={tournamentForm.endDate}
                                onChange={(value: string) => setTournamentForm({ ...tournamentForm, endDate: value })}
                                required
                            />
                        </div>

                        <Input
                            label="Location"
                            placeholder="e.g., Central Cricket Stadium"
                            value={tournamentForm.location}
                            onChange={(value: string) => setTournamentForm({ ...tournamentForm, location: value })}
                            required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <Input
                                label="Format"
                                type="select"
                                value={tournamentForm.format}
                                onChange={(value: string) => setTournamentForm({ ...tournamentForm, format: value })}
                                options={[
                                    { value: 'T20', label: 'T20' },
                                    { value: 'ODI', label: 'ODI' },
                                    { value: 'Test', label: 'Test' }
                                ]}
                            />

                            <Input
                                label="Max Teams"
                                type="number"
                                value={tournamentForm.maxTeams}
                                onChange={(value: string) => setTournamentForm({ ...tournamentForm, maxTeams: parseInt(value) })}
                                required
                            />
                        </div>

                        <label className="flex items-center gap-3 p-3 border border-[var(--card-border)] bg-cyan-600/5 rounded-sm cursor-pointer group hover:bg-cyan-600/10 transition-colors">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-[var(--card-border)] text-cyan-600 focus:ring-cyan-600"
                                checked={tournamentForm.autoGenerateTeams}
                                onChange={(e) => setTournamentForm({ ...tournamentForm, autoGenerateTeams: e.target.checked })}
                            />
                            <Stack gap="none">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text)]">Auto-generate Default Teams</span>
                                <span className="text-[8px] font-bold uppercase tracking-tighter text-[var(--text-secondary)] opacity-60">Creates Team 1 to Team {tournamentForm.maxTeams} automatically</span>
                            </Stack>
                        </label>

                        <Stack direction="row" gap="sm" justify="end" className="pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowCreateModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleCreateTournament}
                                disabled={!tournamentForm.name || !tournamentForm.startDate || !tournamentForm.endDate}
                            >
                                Create Tournament
                            </Button>
                        </Stack>
                    </Stack>
                </Modal>
            )}

            {/* Add Team Modal */}
            {showTeamModal && (
                <Modal
                    isOpen={showTeamModal}
                    onClose={() => setShowTeamModal(false)}
                    title={teamModalMode === 'edit' ? `Edit Team: ${selectedTeam?.name}` : "Add New Team"}
                >
                    <Stack gap="md">
                        <Input
                            label="Team Name"
                            placeholder="e.g., Warriors XI"
                            value={teamForm.name}
                            onChange={(value: string) => setTeamForm({ ...teamForm, name: value })}
                            required
                            helperText={teamModalMode === 'edit' ? "Updating the team name will activate this slot" : ""}
                        />

                        <Input
                            label="Captain Name"
                            placeholder="e.g., John Smith"
                            value={teamForm.captain}
                            onChange={(value: string) => setTeamForm({ ...teamForm, captain: value })}
                            required
                        />

                        <Input
                            label="Captain Email"
                            type="email"
                            placeholder="captain@example.com"
                            value={teamForm.captainEmail}
                            onChange={(value: string) => setTeamForm({ ...teamForm, captainEmail: value })}
                            required
                            helperText="This email will be used for team management access"
                        />

                        <Stack direction="row" gap="sm" justify="end" className="pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowTeamModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleAddTeam}
                                disabled={!teamForm.name || !teamForm.captain || !teamForm.captainEmail}
                            >
                                {teamModalMode === 'edit' ? 'Update & Activate' : 'Add Team'}
                            </Button>
                        </Stack>
                    </Stack>
                </Modal>
            )}

            {/* Add Player Modal */}
            {showPlayerModal && (
                <Modal
                    isOpen={showPlayerModal}
                    onClose={() => setShowPlayerModal(false)}
                    title={`Add Player to ${selectedTeam?.name}`}
                >
                    <Stack gap="md">
                        <Input
                            label="Player Name"
                            placeholder="e.g., Mike Johnson"
                            value={playerForm.name}
                            onChange={(value: string) => setPlayerForm({ ...playerForm, name: value })}
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="player@example.com"
                            value={playerForm.email}
                            onChange={(value: string) => setPlayerForm({ ...playerForm, email: value })}
                            required
                        />

                        <Input
                            label="Role"
                            type="select"
                            placeholder="Select role"
                            value={playerForm.role}
                            onChange={(value: string) => setPlayerForm({ ...playerForm, role: value })}
                            options={[
                                { value: '', label: 'Select role' },
                                { value: 'Batsman', label: 'Batsman' },
                                { value: 'Bowler', label: 'Bowler' },
                                { value: 'All-rounder', label: 'All-rounder' },
                                { value: 'Wicket Keeper', label: 'Wicket Keeper' }
                            ]}
                        />

                        <Stack direction="row" gap="sm" justify="end" className="pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowPlayerModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleAddPlayer}
                                disabled={!playerForm.name || !playerForm.email}
                            >
                                Add Player
                            </Button>
                        </Stack>
                    </Stack>
                </Modal>
            )}

            {/* Link Share Modal */}
            {showLinkShareModal && (
                <Modal
                    isOpen={showLinkShareModal}
                    onClose={() => setShowLinkShareModal(false)}
                    title="Share Access Link"
                    maxWidth="md"
                >
                    <Stack gap="xl">
                        <div className="flex flex-col items-center text-center py-6 border-b border-[var(--card-border)] bg-slate-500/5 rounded-sm">
                            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative">
                                <Link className="w-8 h-8 text-cyan-600 animate-pulse" />
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                                    <ShieldCheck className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-[0.2em]">Secure Access Token</h3>
                            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-1 opacity-60">
                                {linkType === 'team' ? 'Captain Registration & Management' : 'Individual Player Enrollment'}
                            </p>
                        </div>

                        <Stack gap="md">
                            <Stack gap="xs">
                                <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Universal Portal Link</span>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="flex-1 px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-sm text-[11px] font-mono text-cyan-600 truncate focus-within:border-cyan-500/50 transition-all select-all">
                                        {shareLink}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(shareLink)}
                                        className="sm:px-6 py-3 sm:py-0 bg-cyan-600 hover:bg-cyan-700 text-white text-[9px] font-black uppercase tracking-widest rounded-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <ClipboardList size={14} />
                                        Copy Link
                                    </button>
                                </div>
                            </Stack>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="p-3 sm:p-4 bg-slate-500/5 border border-[var(--card-border)] rounded-sm">
                                    <Stack gap="sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                            <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Protocol</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-[var(--text)] leading-relaxed">
                                            {linkType === 'team'
                                                ? 'Allows full team management including roster editing and match readiness status.'
                                                : 'Single-use registration token for verified player identity verification.'}
                                        </p>
                                    </Stack>
                                </div>
                                <div className="p-3 sm:p-4 bg-slate-500/5 border border-[var(--card-border)] rounded-sm">
                                    <Stack gap="sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Security</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-[var(--text)] leading-relaxed text-amber-600/80">
                                            This link grants sensitive access. Do not share in public forums or unsecured channels.
                                        </p>
                                    </Stack>
                                </div>
                            </div>
                        </Stack>

                        <div className="flex justify-center pb-2">
                            <button
                                onClick={() => setShowLinkShareModal(false)}
                                className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] hover:text-cyan-600 transition-colors"
                            >
                                [ Close Console ]
                            </button>
                        </div>
                    </Stack>
                </Modal>
            )}
        </main>
    );
};

export default TournamentManagement;
