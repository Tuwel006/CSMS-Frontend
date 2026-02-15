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
    Share2,
    ClipboardList,
    UserPlus,
    Calendar,
    MapPin,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    Settings
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
        maxTeams: 8
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
        const newTournament: Tournament = {
            id: Math.random().toString(36).substr(2, 9),
            ...tournamentForm,
            teams: [],
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
            maxTeams: 8
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
        // You can add a toast notification here
    };

    return (
        <main className={`min-h-screen ${isDark ? 'bg-[var(--bg)]' : 'bg-[var(--bg)]'} transition-colors duration-200`}>
            {/* Header */}
            <header className={`sticky top-0 z-40 backdrop-blur-md ${isDark ? 'bg-[var(--header-bg)]/90 border-b border-[var(--card-border)]' : 'bg-[var(--header-bg)]/90 border-b border-[var(--card-border)]'}`}>
                <Stack direction="row" align="center" justify="between" className="px-3 sm:px-4 py-2 sm:py-2.5 max-w-7xl mx-auto">
                    <Stack direction="row" align="center" gap="xs">
                        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-xs sm:text-sm sm:text-base font-bold text-[var(--text)]">Tournament Management</h1>
                    </Stack>

                    {activeView === 'list' && (
                        <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Plus className="w-3 h-3" />}
                            onClick={() => setShowCreateModal(true)}
                        >
                            <span className="hidden sm:inline">Create Tournament</span>
                            <span className="sm:hidden">Create</span>
                        </Button>
                    )}

                    {activeView === 'details' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setActiveView('list');
                                setSelectedTournament(null);
                            }}
                        >
                            <span className="hidden sm:inline">Back to Tournaments</span>
                            <span className="sm:hidden">Back</span>
                        </Button>
                    )}
                </Stack>
            </header>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
                {activeView === 'list' ? (
                    <Stack gap="sm">
                        {/* Tournament Statistics */}
                        <Stack direction="row" gap="sm" className="grid grid-cols-2 lg:grid-cols-4">
                            <Card p="sm" className="hover:shadow-lg transition-shadow duration-200">
                                <Stack gap="xs">
                                    <Stack direction="row" align="center" justify="between">
                                        <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Total</span>
                                        <ClipboardList className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                                    </Stack>
                                    <p className="text-sm sm:text-base font-bold text-[var(--text)]">{tournaments.length}</p>
                                    <span className="text-[9px] sm:text-[10px] text-[var(--text-secondary)]">Active &amp; Upcoming</span>
                                </Stack>
                            </Card>

                            <Card p="sm" className="hover:shadow-lg transition-shadow duration-200">
                                <Stack gap="xs">
                                    <Stack direction="row" align="center" justify="between">
                                        <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Teams</span>
                                        <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
                                    </Stack>
                                    <p className="text-sm sm:text-base font-bold text-[var(--text)]">
                                        {tournaments.reduce((sum, t) => sum + t.teams.length, 0)}
                                    </p>
                                    <span className="text-[9px] sm:text-[10px] text-[var(--text-secondary)]">All tournaments</span>
                                </Stack>
                            </Card>

                            <Card p="sm" className="hover:shadow-lg transition-shadow duration-200">
                                <Stack gap="xs">
                                    <Stack direction="row" align="center" justify="between">
                                        <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Players</span>
                                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                                    </Stack>
                                    <p className="text-sm sm:text-base font-bold text-[var(--text)]">
                                        {tournaments.reduce((sum, t) => sum + t.teams.reduce((tSum, team) => tSum + team.players.length, 0), 0)}
                                    </p>
                                    <span className="text-[9px] sm:text-[10px] text-[var(--text-secondary)]">Registered</span>
                                </Stack>
                            </Card>

                            <Card p="sm" className="hover:shadow-lg transition-shadow duration-200">
                                <Stack gap="xs">
                                    <Stack direction="row" align="center" justify="between">
                                        <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Active</span>
                                        <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                                    </Stack>
                                    <p className="text-sm sm:text-base font-bold text-[var(--text)]">
                                        {tournaments.filter(t => t.status === 'active').length}
                                    </p>
                                    <span className="text-[9px] sm:text-[10px] text-[var(--text-secondary)]">Ongoing now</span>
                                </Stack>
                            </Card>
                        </Stack>

                        {/* Tournaments List */}
                        <Stack gap="sm">
                            <h2 className="text-xs sm:text-sm font-bold text-[var(--text)] uppercase tracking-wide">All Tournaments</h2>

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
                                                {/* Tournament Header with Gradient */}
                                                <Box
                                                    className={`px-3 sm:px-4 py-2 sm:py-3 ${isDark ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40' : 'bg-gradient-to-r from-blue-50 to-purple-50'} border-b border-[var(--card-border)]`}
                                                >
                                                    <Stack direction="row" align="center" justify="between">
                                                        <Stack gap="xs">
                                                            <Stack direction="row" align="center" gap="xs">
                                                                <h3 className="text-xs sm:text-sm sm:text-base font-bold text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                    {tournament.name}
                                                                </h3>
                                                                <span className={`px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold rounded-full ${tournament.status === 'active'
                                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                                    : tournament.status === 'draft'
                                                                        ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                                    }`}>
                                                                    {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                                                                </span>
                                                            </Stack>
                                                            <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] line-clamp-2">{tournament.description}</p>
                                                        </Stack>
                                                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                                    </Stack>
                                                </Box>

                                                {/* Tournament Details */}
                                                <Stack direction="row" gap="sm" className="px-3 sm:px-4 py-2 sm:py-3 grid grid-cols-2 lg:grid-cols-4">
                                                    <Stack gap="xs">
                                                        <Stack direction="row" align="center" gap="xs">
                                                            <Calendar className="w-3 h-3 text-[var(--text-secondary)]" />
                                                            <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--text-secondary)] uppercase">Date</span>
                                                        </Stack>
                                                        <p className="text-[10px] sm:text-xs font-medium text-[var(--text)]">
                                                            {new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(tournament.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </Stack>

                                                    <Stack gap="xs">
                                                        <Stack direction="row" align="center" gap="xs">
                                                            <MapPin className="w-3 h-3 text-[var(--text-secondary)]" />
                                                            <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--text-secondary)] uppercase">Location</span>
                                                        </Stack>
                                                        <p className="text-[10px] sm:text-xs font-medium text-[var(--text)]">{tournament.location}</p>
                                                    </Stack>

                                                    <Stack gap="xs">
                                                        <Stack direction="row" align="center" gap="xs">
                                                            <UserPlus className="w-3 h-3 text-[var(--text-secondary)]" />
                                                            <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--text-secondary)] uppercase">Teams</span>
                                                        </Stack>
                                                        <p className="text-[10px] sm:text-xs font-medium text-[var(--text)]">
                                                            {tournament.teams.length} / {tournament.maxTeams}
                                                        </p>
                                                    </Stack>

                                                    <Stack gap="xs">
                                                        <Stack direction="row" align="center" gap="xs">
                                                            <Trophy className="w-3 h-3 text-[var(--text-secondary)]" />
                                                            <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--text-secondary)] uppercase">Format</span>
                                                        </Stack>
                                                        <p className="text-[10px] sm:text-xs font-medium text-[var(--text)]">{tournament.format}</p>
                                                    </Stack>
                                                </Stack>
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
                            {/* Tournament Header */}
                            <Card p="none" className="overflow-hidden">
                                <Box className={`px-3 sm:px-4 py-2 sm:py-3 ${isDark ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}>
                                    <Stack gap="md">
                                        <Stack direction="row" align="center" justify="between">
                                            <Stack gap="xs">
                                                <h2 className="text-sm sm:text-base font-bold text-[var(--text)]">{selectedTournament.name}</h2>
                                                <p className="text-[9px] sm:text-[10px] text-[var(--text-secondary)]">{selectedTournament.description}</p>
                                            </Stack>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                leftIcon={<Plus className="w-3 h-3" />}
                                                onClick={() => {
                                                    setTeamModalMode('add');
                                                    setTeamForm({ name: '', captain: '', captainEmail: '' });
                                                    setShowTeamModal(true);
                                                }}
                                                disabled={selectedTournament.teams.length >= selectedTournament.maxTeams}
                                            >
                                                Add Team
                                            </Button>
                                        </Stack>

                                        <Stack direction="row" gap="md" className="grid grid-cols-2 sm:grid-cols-4">
                                            <Stack gap="xs">
                                                <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--text-secondary)] uppercase">Format</span>
                                                <p className="text-[10px] sm:text-xs font-medium text-[var(--text)]">{selectedTournament.format}</p>
                                            </Stack>
                                            <Stack gap="xs">
                                                <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--text-secondary)] uppercase">Teams</span>
                                                <p className="text-[10px] sm:text-xs font-medium text-[var(--text)]">{selectedTournament.teams.length}/{selectedTournament.maxTeams}</p>
                                            </Stack>
                                            <Stack gap="xs">
                                                <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--text-secondary)] uppercase">Start Date</span>
                                                <p className="text-[10px] sm:text-xs font-medium text-[var(--text)]">
                                                    {new Date(selectedTournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </Stack>
                                            <Stack gap="xs">
                                                <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--text-secondary)] uppercase">Location</span>
                                                <p className="text-[10px] sm:text-xs font-medium text-[var(--text)]">{selectedTournament.location}</p>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Card>

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
                                                    {/* Team Header */}
                                                    <Box
                                                        className={`px-3 sm:px-4 py-2.5 cursor-pointer select-none ${isDark ? 'bg-gradient-to-r from-emerald-900/20 to-teal-900/20' : 'bg-gradient-to-r from-emerald-50/50 to-teal-50/50'} border-b border-[var(--card-border)] hover:${isDark ? 'bg-emerald-900/30' : 'bg-emerald-100/50'} transition-all`}
                                                        onClick={() => toggleTeamExpansion(team.id)}
                                                    >
                                                        <Stack direction="row" align="center" justify="between">
                                                            <Stack direction="row" align="center" gap="sm">
                                                                <div className={`p-1.5 rounded-lg ${isDark ? (team.status === 'draft' ? 'bg-amber-500/10' : 'bg-emerald-500/10') : (team.status === 'draft' ? 'bg-amber-50' : 'bg-emerald-50')} border ${team.status === 'draft' ? 'border-amber-500/20' : 'border-emerald-500/20'}`}>
                                                                    <UserPlus className={`w-3.5 h-3.5 ${team.status === 'draft' ? 'text-amber-500' : 'text-emerald-500'}`} />
                                                                </div>
                                                                <Stack gap="none">
                                                                    <Stack direction="row" align="center" gap="sm">
                                                                        <h4 className={`text-[11px] sm:text-xs font-bold tracking-tight ${team.status === 'draft' ? 'text-[var(--text-secondary)] italic' : 'text-[var(--text)]'}`}>
                                                                            {team.name}
                                                                        </h4>
                                                                        <span className={`px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold rounded uppercase tracking-wider ${team.status === 'active'
                                                                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                                                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                                                            }`}>
                                                                            {team.status === 'draft' ? 'Pending' : 'Active'}
                                                                        </span>
                                                                    </Stack>
                                                                    <Stack direction="row" align="center" gap="xs">
                                                                        <ShieldCheck className={`w-2.5 h-2.5 ${team.captain === 'TBD' ? 'text-[var(--text-secondary)] opacity-30' : 'text-blue-500'}`} />
                                                                        <span className="text-[9px] sm:text-[10px] text-[var(--text-secondary)]">
                                                                            Captain: <span className={`font-bold ${team.captain === 'TBD' ? 'italic' : 'text-[var(--text)]'}`}>{team.captain}</span>
                                                                        </span>
                                                                    </Stack>
                                                                </Stack>
                                                            </Stack>

                                                            <Stack direction="row" align="center" gap="md">
                                                                <Stack gap="xs" align="end" className="hidden sm:flex">
                                                                    <div className="w-20 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                                                        <div
                                                                            className="h-full bg-emerald-500 transition-all duration-500"
                                                                            style={{ width: `${(team.players.length / 16) * 100}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter">
                                                                        {team.players.length} / 16 Players
                                                                    </span>
                                                                </Stack>

                                                                <Stack direction="row" gap="xs">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-7 w-7 p-0"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleShareLink('team', team.captainLink);
                                                                        }}
                                                                        title="Share Team Link"
                                                                    >
                                                                        <Share2 className="w-3 h-3" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-7 w-7 p-0"
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
                                                                        title="Edit Team Details"
                                                                    >
                                                                        <Settings className="w-3.5 h-3.5 text-blue-500" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-7 w-7 p-0"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedTeam(team);
                                                                            setShowPlayerModal(true);
                                                                        }}
                                                                        title="Add Player"
                                                                    >
                                                                        <Plus className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                    <div className={`p-1 rounded-md transition-colors ${expandedTeams[team.id] ? (isDark ? 'bg-gray-800' : 'bg-gray-100') : ''}`}>
                                                                        {expandedTeams[team.id] ? <ChevronUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" /> : <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />}
                                                                    </div>
                                                                </Stack>
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

                        <Stack direction="row" gap="md" className="grid grid-cols-2">
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
                        </Stack>

                        <Input
                            label="Location"
                            placeholder="e.g., Central Cricket Stadium"
                            value={tournamentForm.location}
                            onChange={(value: string) => setTournamentForm({ ...tournamentForm, location: value })}
                            required
                        />

                        <Stack direction="row" gap="md" className="grid grid-cols-2">
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
                        </Stack>

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
                    title={linkType === 'team' ? 'Team Captain Registration Link' : 'Player Registration Link'}
                >
                    <Stack gap="md">
                        <Box p="md" className={`rounded ${isDark ? 'bg-blue-900/20 border border-blue-700/30' : 'bg-blue-50 border border-blue-200'}`}>
                            <Stack gap="sm">
                                <span className="text-xs sm:text-sm font-semibold text-[var(--text)]">
                                    {linkType === 'team' ? 'Share this link with the team captain:' : 'Share this link with the player:'}
                                </span>
                                <Stack direction="row" gap="sm" align="center">
                                    <input
                                        type="text"
                                        value={shareLink}
                                        readOnly
                                        className={`flex-1 px-3 py-2 rounded text-sm font-mono ${isDark ? 'bg-gray-800 text-gray-300 border border-gray-600' : 'bg-white text-gray-700 border border-gray-300'}`}
                                    />
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        leftIcon={<ClipboardList className="w-4 h-4" />}
                                        onClick={() => copyToClipboard(shareLink)}
                                    >
                                        Copy
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>

                        <Box p="md" className={`rounded ${isDark ? 'bg-gray-800/40' : 'bg-gray-50'}`}>
                            <Stack gap="sm">
                                <h5 className="text-xs sm:text-sm font-semibold text-[var(--text)]">
                                    {linkType === 'team' ? 'Captain Instructions:' : 'Player Instructions:'}
                                </h5>
                                <ul className="text-[10px] sm:text-xs text-[var(--text-secondary)] space-y-1 list-disc list-inside">
                                    {linkType === 'team' ? (
                                        <>
                                            <li>Captain can use this link to access team management</li>
                                            <li>Captain can add players directly or share individual player links</li>
                                            <li>Each player link allows registration and auto-addition to the team</li>
                                            <li>Link is valid until the tournament starts</li>
                                        </>
                                    ) : (
                                        <>
                                            <li>Player can use this link to register for the team</li>
                                            <li>Player will be automatically added after registration</li>
                                            <li>Link is single-use and expires after registration</li>
                                            <li>Player can update their profile after registration</li>
                                        </>
                                    )}
                                </ul>
                            </Stack>
                        </Box>

                        <Stack direction="row" gap="sm" justify="end">
                            <Button
                                variant="outline"
                                onClick={() => setShowLinkShareModal(false)}
                            >
                                Close
                            </Button>
                        </Stack>
                    </Stack>
                </Modal>
            )}
        </main>
    );
};

export default TournamentManagement;
