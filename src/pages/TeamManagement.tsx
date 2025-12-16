import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import TeamSetup from '../components/TeamSetup';
import MatchSchedule from '../components/MatchSchedule';
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
  resetTeam1Players,
  resetTeam2Players,
  setTeam1Players,
  setTeam2Players,
} from '../store/slices/teamManagementSlice';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import GenerateMatchToken from '../components/GenerateMatchToken';
import ActiveSessionHeader from '../components/ActiveSessionHeader';
import TeamCard from '../components/TeamCard';
import { TeamService } from '../services/teamService';
import { MatchService } from '../services/matchService';
import { showToast } from '../utils/toast';
import { Player } from '../types/player';
import { TeamData as BaseTeamData } from '../types/team';

type Tab = 'match-setup' | 'match-start';

interface TeamData extends BaseTeamData {
  short_name?: string;
  teamId?: number | null;
  tournamentId?: number | null;
  players?: Player[];
}



const TeamManagement = () => {
  const dispatch = useDispatch();
  const { team1, team2, team1Players, team2Players } = useSelector(
    (state: RootState) => state.teamManagement
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as Tab) || 'match-setup';

  const [managedTeams, setManagedTeams] = useState<TeamData[]>([]);

  const [matchTeamA, setMatchTeamA] = useState<TeamData | null>(null);
  const [matchTeamB, setMatchTeamB] = useState<TeamData | null>(null);

  // Match Initiation State
  const [matchToken, setMatchToken] = useState<string | null>(null);
  const [isMatchInitiated, setIsMatchInitiated] = useState(false);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [showCancelSessionConfirm, setShowCancelSessionConfirm] = useState(false);

  const handleCancelSession = async () => {
    setShowCancelSessionConfirm(false); // Close dialog immediately or wait? Better close first creates better UX, but loading toast appears.
    // If we want to show loading, we should keep dialog or just close it. I'll close it.

    if (!matchToken) {
      // Fallback cleanup if no token exists
      localStorage.removeItem('activeMatchToken');
      setIsMatchInitiated(false);
      setMatchToken(null);
      setActiveSlot(null);
      setIsTeam1Submitted(false);
      setIsTeam2Submitted(false);
      dispatch(resetTeam1());
      dispatch(resetTeam2());
      setMatchDetails({ venue: '', date: '', time: '', umpire: '' });
      setIsMatchScheduled(false);
      setCountdown('');
      return;
    }

    const toastId = showToast.loading("Cancelling Session...");

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay for effect
      const response = await MatchService.deleteToken(matchToken);

      // Check success (response logic similar to toast utils, typically 200-299)
      if (response.status >= 200 && response.status < 300) {
        showToast.handleResponse(toastId, response);

        // Perform Cleanup
        localStorage.removeItem('activeMatchToken');
        setIsMatchInitiated(false);
        setMatchToken(null);
        setActiveSlot(null);
        setIsTeam1Submitted(false);
        setIsTeam2Submitted(false);
        dispatch(resetTeam1());
        dispatch(resetTeam2());
        setMatchDetails({ venue: '', date: '', time: '', umpire: '' });
        setIsMatchScheduled(false);
        setCountdown('');
      } else {
        // Failed to delete on server
        showToast.handleResponse(toastId, response);
      }
    } catch (error) {
      console.error('Error cancelling session:', error);
      showToast.handleResponse(toastId, error);
    }
  };

  // Match Setup specific states
  const [activeSlot, setActiveSlot] = useState<1 | 2 | null>(null);
  const [isTeam1Submitted, setIsTeam1Submitted] = useState(false);
  const [isTeam2Submitted, setIsTeam2Submitted] = useState(false);
  const [isEditingTeam1, setIsEditingTeam1] = useState(false);
  const [isEditingTeam2, setIsEditingTeam2] = useState(false);

  // Match Schedule Form State
  const [matchDetails, setMatchDetails] = useState({
    venue: '',
    date: '',
    time: '',
    umpire: ''
  });
  const [isMatchScheduled, setIsMatchScheduled] = useState(false);
  const [countdown, setCountdown] = useState<string>('');

  // Load teams from API on mount
  // useEffect(() => {
  //   fetchTeams();
  // }, []);

  // Countdown timer effect
  useEffect(() => {
    let timer: number;
    if (isMatchScheduled && matchDetails.date && matchDetails.time) {
      const targetTime = new Date(`${matchDetails.date}T${matchDetails.time}`).getTime();

      const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        if (distance < 0) {
          setCountdown('Match Started');
        } else {
          const hours = Math.floor(distance / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          setCountdown(`${hours}h ${minutes}m left`);
        }
      };

      updateCountdown();
      timer = window.setInterval(updateCountdown, 60000); // Update every minute
    }
    return () => clearInterval(timer);
  }, [isMatchScheduled, matchDetails]);

  // One-time cleanup of deprecated localStorage keys
  useEffect(() => {
    localStorage.removeItem('teamManagementState');
    localStorage.removeItem('matchSetup_team1');
    localStorage.removeItem('matchSetup_team2');
  }, []);

  // Restore active match session if token exists
  useEffect(() => {
    const savedToken = localStorage.getItem('activeMatchToken');
    if (savedToken) {
      setMatchToken(savedToken);
      setIsMatchInitiated(true);
      fetchCurrentMatch(savedToken);
    }
  }, []);

  const fetchCurrentMatch = async (token: string) => {
    try {
      const response = await MatchService.getCurrentMatch(token);
      if (response.status >= 200 && response.status < 300 && response.data) {
        const { teamA, teamB } = response.data;
        
        if (teamA) {
          setMatchTeamA({ id: teamA.id.toString(), name: teamA.name, short_name: teamA?.short_name, players: teamA.players });
          setIsTeam1Submitted(true);
        }
        
        if (teamB) {
          setMatchTeamB({ id: teamB.id.toString(), name: teamB.name, short_name: teamB.short_name, players: teamB.players });
          setIsTeam2Submitted(true);
        }
      }
    } catch (error) {
      console.error('Error fetching current match:', error);
    }
  };





  // const fetchTeams = async () => {
  //   try {
  //     const response = await TeamService.getAll({ limit: 100 });
  //     if (response?.data?.data) {
  //       const allTeams: TeamData[] = response.data.data.map((team: { id: number; name: string; location?: string; tournamentId?: number }) => ({
  //         id: team.id.toString(),
  //         name: team.name,
  //         location: team.location || '',
  //         teamId: team.id.toString(),
  //         tournamentId: team.tournamentId?.toString() || null,
  //         players: []
  //       }));
  //       setManagedTeams(allTeams);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching teams:', error);
  //   }
  // };

  const generateMatchToken = async () => {
    setIsGeneratingToken(true);
    const toastId = showToast.loading("Generating Match Token...");

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await MatchService.generateToken();
      if (response.data && response.data.id) {
        const token = response.data.id;
        localStorage.setItem('activeMatchToken', token);
        setMatchToken(token);
        setIsMatchInitiated(true);
        showToast.handleResponse(toastId, response);
        fetchCurrentMatch(token);
      } else {
        showToast.handleResponse(toastId, { status: 500, message: "Failed to parse match token", code: "PARSE_ERROR" });
      }
    } catch (error) {
      console.error('Error generating token:', error);
      showToast.handleResponse(toastId, error);
    } finally {
      setIsGeneratingToken(false);
    }
  };

  // Team 1 handlers
  const handleSaveTeam1 = (team: BaseTeamData) => {
    dispatch(setTeam1(team));
  };

  const handleEditTeam1 = () => {
    if (!isTeam1Submitted || !matchTeamA) return;
    setIsEditingTeam1(true);
    dispatch(setTeam1(matchTeamA));
    dispatch(setTeam1Players(matchTeamA.players || []));
  };

  const handleDeleteTeam1 = () => {
    if (isTeam1Submitted) {
      if (!confirm('This team is already submitted. Do you want to remove it and reset?')) return;
      setIsTeam1Submitted(false);
    }
    dispatch(resetTeam1());
    if (activeSlot === 1) setActiveSlot(null);
  };

  const handleSaveTeam1Player = (
    player: Player,
    editingIndex: number | null
  ) => {
    if (editingIndex !== null) {
      dispatch(updateTeam1Player({ index: editingIndex, player }));
    } else {
      dispatch(addTeam1Player(player));
    }
  };

  const handleEditTeam1Player = () => { };
  const handleDeleteTeam1Player = (index: number) => {
    dispatch(deleteTeam1Player(index));
  };

  // Team 2 handlers
  const handleSaveTeam2 = (team: BaseTeamData) => {
    dispatch(setTeam2(team));
  };

  const handleEditTeam2 = () => {
    if (!isTeam2Submitted || !matchTeamB) return;
    setIsEditingTeam2(true);
    dispatch(setTeam2(matchTeamB));
    dispatch(setTeam2Players(matchTeamB.players || []));
  };

  const handleDeleteTeam2 = () => {
    if (isTeam2Submitted) {
      if (!confirm('This team is already submitted. Do you want to remove it and reset?')) return;
      setIsTeam2Submitted(false);
    }
    dispatch(resetTeam2());
    if (activeSlot === 2) setActiveSlot(null);
  };

  const handleSaveTeam2Player = (
    player: Player,
    editingIndex: number | null
  ) => {
    if (editingIndex !== null) {
      dispatch(updateTeam2Player({ index: editingIndex, player }));
    } else {
      dispatch(addTeam2Player(player));
    }
  };

  const handleEditTeam2Player = () => { };
  const handleDeleteTeam2Player = (index: number) => {
    dispatch(deleteTeam2Player(index));
  };



  // Submit Specific Team to Backend
  const handleSubmitTeamToBackend = async (teamNum: 1 | 2) => {
    const team = teamNum === 1 ? team1 : team2;
    const players = teamNum === 1 ? team1Players : team2Players;
    const isEditing = teamNum === 1 ? isEditingTeam1 : isEditingTeam2;
    const matchTeam = teamNum === 1 ? matchTeamA : matchTeamB;

    if (!team.name) {
      alert('Please save team details first');
      return;
    }

    const toastId = showToast.loading(isEditing ? `Updating Team ${teamNum}...` : `Submitting Team ${teamNum}...`);

    try {
      if (isEditing && matchTeam?.id) {
        // Update existing team
        const payload = {
          team: {
            id: team.id,
            name: team.name,
            location: team.location
          },
          players
        };
        const response = await MatchService.updateTeam(matchToken!, matchTeam.id as any, payload);
        
        if (response.status >= 200 && response.status < 300) {
          showToast.handleResponse(toastId, response);
          await fetchCurrentMatch(matchToken!);
          if (teamNum === 1) {
            setIsEditingTeam1(false);
            dispatch(resetTeam1());
          } else {
            setIsEditingTeam2(false);
            dispatch(resetTeam2());
          }
        } else {
          showToast.handleResponse(toastId, response);
        }
      } else {
        // Create new team
        const payload = {
          matchId: matchToken!,
          team: {
            name: team.name,
            location: team.location,
            id: team.id
          },
          players: players.map(p => ({
            name: p.name,
            id: p.id,
            role: p.role
          }))
        };
        const response = await MatchService.teamSetup(payload);
        
        if (response.status >= 200 && response.status < 300) {
          showToast.handleResponse(toastId, response);
          
          if (teamNum === 1) {
            dispatch(resetTeam1());
            setIsTeam1Submitted(true);
          } else {
            dispatch(resetTeam2());
            setIsTeam2Submitted(true);
          }

          setActiveSlot(null);
          await fetchCurrentMatch(matchToken!);
        } else {
          showToast.handleResponse(toastId, response);
        }
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'submitting'} team ${teamNum}:`, error);
      showToast.handleResponse(toastId, error);
    }
  };

  const handleScheduleMatch = async () => {
    if (!matchDetails.venue || !matchDetails.date || !matchDetails.time) {
      alert('Please fill in all required match details');
      return;
    }

    console.log('Scheduling Match:', {
      matchId: matchToken,
      team1: team1.name,
      team2: team2.name,
      ...matchDetails
    });

    setIsMatchScheduled(true);
  };

  const TeamPlaceholder = ({ onClick, label }: { onClick: () => void; label: string }) => (
    <div
      onClick={onClick}
      className="h-[300px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Plus size={32} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
      <h3 className="text-lg font-medium text-gray-500 group-hover:text-blue-500 transition-colors">{label}</h3>
      <p className="text-sm text-gray-400 mt-2">Click to select or create a team</p>
    </div>
  );

  return (
    <div>
      {/* Tab Navigation */}
      <div className="grid grid-cols-2 gap-0 border-b border-[var(--card-border)]">
        <Button
          variant="ghost"
          onClick={() => setSearchParams({ tab: 'match-setup' })}
          className={`rounded-none relative border-r border-gray-300 dark:border-gray-700 ${
            activeTab === 'match-setup'
              ? 'text-blue-600 dark:text-blue-400 !bg-transparent'
              : 'text-[var(--text-secondary)]'
          }`}
          style={{
            backgroundColor: activeTab === 'match-setup' ? 'transparent' : 'var(--hover-bg)'
          }}
          size='lg'
        >
          Single Match Setup
          {activeTab === 'match-setup' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400"></div>
          )}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setSearchParams({ tab: 'match-start' })}
          className={`rounded-none relative border-l border-gray-300 dark:border-gray-700 ${
            activeTab === 'match-start'
              ? 'text-blue-600 dark:text-blue-400 !bg-transparent'
              : 'text-[var(--text-secondary)]'
          }`}
          style={{
            backgroundColor: activeTab === 'match-start' ? 'transparent' : 'var(--hover-bg)'
          }}
        >
          Match Start
          {activeTab === 'match-start' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400"></div>
          )}
        </Button>
      </div>

      <div className="p-2 md:p-6">
        {activeTab === 'match-start' ? (
          <MatchSchedule availableTeams={managedTeams} />
        ) : activeTab === 'match-setup' ? (
        !isMatchInitiated ? (
          <GenerateMatchToken
            onGenerate={generateMatchToken}
            isGenerating={isGeneratingToken}
          />
        ) : (
          // Match Setup UI (Visible after token generation)
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500 fade-in">
            {/* Match Token Header (Active Session) */}
            <ActiveSessionHeader
              matchToken={matchToken}
              onCancel={() => setShowCancelSessionConfirm(true)}
            />

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">

              {/* Team 1 Slot */}
              <div className="w-full">
                {isTeam1Submitted && matchTeamA && !isEditingTeam1 ? (
                  <div className="relative">
                    <TeamCard
                      teamNumber={1}
                      name={matchTeamA?.name}
                      short_name={matchTeamA?.short_name}
                      teamId={matchTeamA?.id || 'Pending'}
                      players={matchTeamA?.players || []}
                      onEdit={handleEditTeam1}
                      onDelete={handleDeleteTeam1}
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
                      Ready
                    </div>
                  </div>
                ) : (team1.name || activeSlot === 1 || isEditingTeam1) ? (
                  <div className="flex flex-col gap-2">
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
                    {team1.name && (
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="md"
                          className="flex-1"
                          onClick={() => handleSubmitTeamToBackend(1)}
                        >
                          {isEditingTeam1 ? 'Update Team 1' : 'Submit Team 1'}
                        </Button>
                        {isEditingTeam1 && (
                          <Button
                            variant="outline"
                            size="md"
                            onClick={() => {
                              setIsEditingTeam1(false);
                              dispatch(resetTeam1());
                              dispatch(resetTeam1Players());
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <TeamPlaceholder onClick={() => setActiveSlot(1)} label="Select Team 1" />
                )}
              </div>

              {/* VS Indicator */}
              <div className="flex items-center justify-center py-4">
                <div className="flex flex-col items-center">
                  <span className="text-2xl md:text-3xl font-black text-gray-300 dark:text-gray-700 italic">VS</span>
                </div>
              </div>

              {/* Team 2 Slot */}
              <div className="w-full">
                {isTeam2Submitted && matchTeamB && !isEditingTeam2 ? (
                  <div className="relative">
                    <TeamCard
                      teamNumber={2}
                      name={matchTeamB.name}
                      short_name={matchTeamB.short_name}
                      teamId={matchTeamB.id || 'Pending'}
                      players={matchTeamB.players || []}
                      onEdit={handleEditTeam2}
                      onDelete={handleDeleteTeam2}
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
                      Ready
                    </div>
                  </div>
                ) : (team2.name || activeSlot === 2 || isEditingTeam2) ? (
                  <div className="flex flex-col gap-2">
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
                    {team2.name && (
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="md"
                          className="flex-1"
                          onClick={() => handleSubmitTeamToBackend(2)}
                        >
                          {isEditingTeam2 ? 'Update Team 2' : 'Submit Team 2'}
                        </Button>
                        {isEditingTeam2 && (
                          <Button
                            variant="outline"
                            size="md"
                            onClick={() => {
                              setIsEditingTeam2(false);
                              dispatch(resetTeam2());
                              dispatch(resetTeam2Players());
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <TeamPlaceholder onClick={() => setActiveSlot(2)} label="Select Team 2" />
                )}
              </div>
            </div>

            {/* Match Schedule Form & Countdown */}
            {isTeam1Submitted && isTeam2Submitted && (
              <div className="mt-8 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-lg font-bold mb-4 text-[var(--text)]">Match Schedule Details</h2>

                {!isMatchScheduled ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Venue</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Wankhede Stadium"
                        value={matchDetails.venue}
                        onChange={(e) => setMatchDetails({ ...matchDetails, venue: e.target.value })}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={matchDetails.date}
                        onChange={(e) => setMatchDetails({ ...matchDetails, date: e.target.value })}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Time</label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        value={matchDetails.time}
                        onChange={(e) => setMatchDetails({ ...matchDetails, time: e.target.value })}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Umpire (Optional)</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Simon Taufel"
                        value={matchDetails.umpire}
                        onChange={(e) => setMatchDetails({ ...matchDetails, umpire: e.target.value })}
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-4 flex justify-end mt-4">
                      <Button variant="primary" size="lg" onClick={handleScheduleMatch}>
                        Schedule Match
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-sm font-medium text-green-500 uppercase tracking-widest mb-1">Match Scheduled Successfully</div>
                    <div className="text-4xl md:text-5xl font-black text-[var(--text)] tracking-tight font-mono">
                      {countdown}
                    </div>
                    <p className="text-gray-500 mt-2">
                      {matchDetails.venue} • {new Date(matchDetails.date).toDateString()} at {matchDetails.time}
                    </p>
                  </div>
                )}
              </div>
            )}

            {showCancelSessionConfirm && (
              <ConfirmDialog
                message="Are you sure you want to cancel this match session? All progress will be lost."
                onConfirm={handleCancelSession}
                onCancel={() => setShowCancelSessionConfirm(false)}
              />
            )}
          </div>
        )
        ) : null}
      </div>
    </div>
  );
};

export default TeamManagement;