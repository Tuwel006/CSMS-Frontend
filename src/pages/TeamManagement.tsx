import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TeamSetup from '../components/TeamSetup';
import { RootState } from '../store';
import {
  setTeam1,
  setTeam2,
  resetTeam1,
  resetTeam2,
  addTeam1Player,
  addTeam2Player,
  updateTeam1Player,
  updateTeam2Player,
  deleteTeam1Player,
  deleteTeam2Player,
} from '../store/slices/teamManagementSlice';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import TeamCard from '../components/TeamCard';
import { TeamService } from '../services/teamService';

type Tab = 'match-setup' | 'team-management';

interface TeamData {
  id: string;
  name: string;
  location: string;
  teamId: string | null;
  players: Array<{ id: string | null; name: string; role: string }>;
}

const TeamManagement = () => {
  const dispatch = useDispatch();
  const { team1, team2, team1Players, team2Players } = useSelector(
    (state: RootState) => state.teamManagement
  );

  const [activeTab, setActiveTab] = useState<Tab>('match-setup');
  const [managedTeams, setManagedTeams] = useState<TeamData[]>([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  // Current team being created/edited in Team Management tab
  const [currentTeam, setCurrentTeam] = useState<{ name: string; location: string; id: string | null }>({
    name: '',
    location: '',
    id: null
  });
  const [currentPlayers, setCurrentPlayers] = useState<Array<{ id: string | null; name: string; role: string }>>([]);

  // Load teams from API on mount
  useEffect(() => {
    if (activeTab === 'team-management') {
      fetchTeams();
    }
  }, [activeTab]);

  // Sync Match Setup teams with localStorage
  useEffect(() => {
    const team1Data = {
      team: team1,
      players: team1Players
    };
    localStorage.setItem('matchSetup_team1', JSON.stringify(team1Data));
  }, [team1, team1Players]);

  useEffect(() => {
    const team2Data = {
      team: team2,
      players: team2Players
    };
    localStorage.setItem('matchSetup_team2', JSON.stringify(team2Data));
  }, [team2, team2Players]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTeam1 = localStorage.getItem('matchSetup_team1');
    const savedTeam2 = localStorage.getItem('matchSetup_team2');

    if (savedTeam1) {
      try {
        const data = JSON.parse(savedTeam1);
        if (data.team?.name) {
          dispatch(setTeam1(data.team));
          data.players?.forEach((player: any) => {
            dispatch(addTeam1Player(player));
          });
        }
      } catch (e) {
        console.error('Error loading team1 from localStorage', e);
      }
    }

    if (savedTeam2) {
      try {
        const data = JSON.parse(savedTeam2);
        if (data.team?.name) {
          dispatch(setTeam2(data.team));
          data.players?.forEach((player: any) => {
            dispatch(addTeam2Player(player));
          });
        }
      } catch (e) {
        console.error('Error loading team2 from localStorage', e);
      }
    }
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await TeamService.getAll({ limit: 100 });
      const teams: TeamData[] = response?.data?.data?.map((team: any) => ({
        id: team.id.toString(),
        name: team.name,
        location: team.location || '',
        teamId: team.id.toString(),
        players: [] // Players would need to be fetched separately if needed
      }))!;
      setManagedTeams(teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  // Team 1 handlers
  const handleSaveTeam1 = (team: { name: string; location: string; id: string | null }) => {
    dispatch(setTeam1(team));
  };

  const handleEditTeam1 = () => {
    // Edit logic is handled within TeamSetup component
  };

  const handleDeleteTeam1 = () => {
    dispatch(resetTeam1());
  };

  const handleSaveTeam1Player = (
    player: { id: string | null; name: string; role: string },
    editingIndex: number | null
  ) => {
    if (editingIndex !== null) {
      dispatch(updateTeam1Player({ index: editingIndex, player }));
    } else {
      dispatch(addTeam1Player(player));
    }
  };

  const handleEditTeam1Player = () => {
    // Edit logic is handled within TeamSetup component
  };

  const handleDeleteTeam1Player = (index: number) => {
    dispatch(deleteTeam1Player(index));
  };

  // Team 2 handlers
  const handleSaveTeam2 = (team: { name: string; location: string; id: string | null }) => {
    dispatch(setTeam2(team));
  };

  const handleEditTeam2 = () => {
    // Edit logic is handled within TeamSetup component
  };

  const handleDeleteTeam2 = () => {
    dispatch(resetTeam2());
  };

  const handleSaveTeam2Player = (
    player: { id: string | null; name: string; role: string },
    editingIndex: number | null
  ) => {
    if (editingIndex !== null) {
      dispatch(updateTeam2Player({ index: editingIndex, player }));
    } else {
      dispatch(addTeam2Player(player));
    }
  };

  const handleEditTeam2Player = () => {
    // Edit logic is handled within TeamSetup component
  };

  const handleDeleteTeam2Player = (index: number) => {
    dispatch(deleteTeam2Player(index));
  };

  // Team Management Tab handlers
  const handleSaveCurrentTeam = (team: { name: string; location: string; id: string | null }) => {
    setCurrentTeam(team);
  };

  const handleSaveCurrentPlayer = (
    player: { id: string | null; name: string; role: string },
    editingIndex: number | null
  ) => {
    if (editingIndex !== null) {
      const updatedPlayers = [...currentPlayers];
      updatedPlayers[editingIndex] = player;
      setCurrentPlayers(updatedPlayers);
    } else {
      setCurrentPlayers([...currentPlayers, player]);
    }
  };

  const handleDeleteCurrentPlayer = (index: number) => {
    setCurrentPlayers(currentPlayers.filter((_, i) => i !== index));
  };

  const handleSubmitTeam = async () => {
    if (!currentTeam.name) {
      alert('Please enter a team name');
      return;
    }

    try {
      if (editingTeamId) {
        // Update existing team
        await TeamService.update(parseInt(editingTeamId), {
          name: currentTeam.name,
          short_name: currentTeam.name.substring(0, 3).toUpperCase(),
          location: currentTeam.location,
        });
      } else {
        // Create new team
        await TeamService.create({
          name: currentTeam.name,
          short_name: currentTeam.name.substring(0, 3).toUpperCase(),
          location: currentTeam.location,
        });
      }

      // Refresh teams list
      await fetchTeams();

      // Reset form
      setCurrentTeam({ name: '', location: '', id: null });
      setCurrentPlayers([]);
      setShowTeamForm(false);
      setEditingTeamId(null);
    } catch (error) {
      console.error('Error submitting team:', error);
      alert('Failed to save team. Please try again.');
    }
  };

  const handleEditManagedTeam = (id: string) => {
    const team = managedTeams.find(t => t.id === id);
    if (team) {
      setCurrentTeam({
        name: team.name,
        location: team.location,
        id: team.teamId
      });
      setCurrentPlayers(team.players);
      setEditingTeamId(id);
      setShowTeamForm(true);
    }
  };

  const handleDeleteManagedTeam = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team?')) {
      return;
    }

    try {
      await TeamService.delete(parseInt(id));
      await fetchTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Failed to delete team. Please try again.');
    }
  };

  const handleCancelForm = () => {
    setCurrentTeam({ name: '', location: '', id: null });
    setCurrentPlayers([]);
    setShowTeamForm(false);
    setEditingTeamId(null);
  };

  return (
    <div className="p-2 md:p-6">
      <h1 className="text-2xl font-bold text-[var(--text)] mb-6">Team Management</h1>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-[var(--card-border)]">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('match-setup')}
            className={`px-4 py-2.5 font-medium text-sm transition-colors relative ${activeTab === 'match-setup'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            Match Setup
            {activeTab === 'match-setup' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('team-management')}
            className={`px-4 py-2.5 font-medium text-sm transition-colors relative ${activeTab === 'team-management'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            Team Management
            {activeTab === 'team-management' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'match-setup' ? (
        // Match Setup Tab - Uses localStorage
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TeamSetup
            teamNumber={1}
            savedTeam={team1}
            players={team1Players}
            onSaveTeam={handleSaveTeam1}
            onEditTeam={handleEditTeam1}
            onDeleteTeam={handleDeleteTeam1}
            onSavePlayer={handleSaveTeam1Player}
            onEditPlayer={handleEditTeam1Player}
            onDeletePlayer={handleDeleteTeam1Player}
          />

          <TeamSetup
            teamNumber={2}
            savedTeam={team2}
            players={team2Players}
            onSaveTeam={handleSaveTeam2}
            onEditTeam={handleEditTeam2}
            onDeleteTeam={handleDeleteTeam2}
            onSavePlayer={handleSaveTeam2Player}
            onEditPlayer={handleEditTeam2Player}
            onDeletePlayer={handleDeleteTeam2Player}
          />
        </div>
      ) : (
        // Team Management Tab - Uses API and shows cards
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage all your teams in one place. Add, edit, or remove teams as needed.
            </p>
            {!showTeamForm && (
              <Button
                variant="primary"
                onClick={() => setShowTeamForm(true)}
              >
                <Plus size={16} className="mr-1" />
                Add Team
              </Button>
            )}
          </div>

          {/* Add/Edit Team Form */}
          {showTeamForm && (
            <div className="mb-6">
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingTeamId ? 'Edit Team' : 'Add New Team'}
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={handleCancelForm}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmitTeam}>
                      {editingTeamId ? 'Update' : 'Submit'}
                    </Button>
                  </div>
                </div>

                <TeamSetup
                  teamNumber={managedTeams.length + 1}
                  savedTeam={currentTeam}
                  players={currentPlayers}
                  onSaveTeam={handleSaveCurrentTeam}
                  onEditTeam={() => { }}
                  onDeleteTeam={handleCancelForm}
                  onSavePlayer={handleSaveCurrentPlayer}
                  onEditPlayer={() => { }}
                  onDeletePlayer={handleDeleteCurrentPlayer}
                />
              </div>
            </div>
          )}

          {/* Teams List as Cards */}
          {managedTeams.length === 0 && !showTeamForm ? (
            <div className="text-center py-12 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No teams added yet</p>
              <Button variant="primary" onClick={() => setShowTeamForm(true)}>
                <Plus size={16} className="mr-1" />
                Add Your First Team
              </Button>
            </div>
          ) : !showTeamForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {managedTeams.map((team, index) => (
                <TeamCard
                  key={team.id}
                  teamNumber={index + 1}
                  name={team.name}
                  location={team.location}
                  teamId={team.teamId}
                  players={team.players}
                  onEdit={() => handleEditManagedTeam(team.id)}
                  onDelete={() => handleDeleteManagedTeam(team.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamManagement;