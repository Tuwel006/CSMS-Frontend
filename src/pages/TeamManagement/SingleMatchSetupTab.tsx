import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  setTeam1, setTeam2, resetTeam1, resetTeam2,
  addTeam1Player, addTeam2Player,
  updateTeam1Player, updateTeam2Player,
  deleteTeam1Player, deleteTeam2Player,
  resetTeam1Players, resetTeam2Players,
  setTeam1Players, setTeam2Players,
} from '../../store/slices/teamManagementSlice';
import { Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import GenerateMatchToken from '../../components/GenerateMatchToken';
import ActiveSessionHeader from '../../components/ActiveSessionHeader';
import TeamCard from '../../components/TeamCard';
import TeamSetup from '../../components/TeamSetup';
import { MatchService } from '../../services/matchService';
import { showToast } from '../../utils/toast';
import { Player } from '../../types/player';
import { TeamData as BaseTeamData } from '../../types/team';

interface TeamData extends BaseTeamData {
  short_name?: string;
  teamId?: string | null;
  tournamentId?: string | null;
  players?: Player[];
}

const SingleMatchSetupTab = () => {
  const dispatch = useDispatch();
  const { team1, team2, team1Players, team2Players } = useSelector(
    (state: RootState) => state.teamManagement
  );

  const [matchTeamA, setMatchTeamA] = useState<TeamData | null>(null);
  const [matchTeamB, setMatchTeamB] = useState<TeamData | null>(null);
  const [matchToken, setMatchToken] = useState<string | null>(null);
  const [isMatchInitiated, setIsMatchInitiated] = useState(false);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [showCancelSessionConfirm, setShowCancelSessionConfirm] = useState(false);
  const [showDeleteTeam1Confirm, setShowDeleteTeam1Confirm] = useState(false);
  const [showDeleteTeam2Confirm, setShowDeleteTeam2Confirm] = useState(false);
  const [activeSlot, setActiveSlot] = useState<1 | 2 | null>(null);
  const [isTeam1Submitted, setIsTeam1Submitted] = useState(false);
  const [isTeam2Submitted, setIsTeam2Submitted] = useState(false);
  const [isEditingTeam1, setIsEditingTeam1] = useState(false);
  const [isEditingTeam2, setIsEditingTeam2] = useState(false);
  const [matchDetails, setMatchDetails] = useState({
    venue: '', date: '', time: '', format: '0', umpire_1: '', umpire_2: ''
  });
  const [isMatchScheduled, setIsMatchScheduled] = useState(false);
  const [countdown, setCountdown] = useState<string>('');

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
      timer = window.setInterval(updateCountdown, 60000);
    }
    return () => clearInterval(timer);
  }, [isMatchScheduled, matchDetails]);

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
        const { teamA, teamB, status, match_date, venue, format, umpire_1, umpire_2 } = response.data;
        if (teamA) {
          setMatchTeamA({ id: typeof teamA.id === 'number' ? teamA.id : null, name: teamA.name, location: '', short_name: teamA?.short_name, players: teamA.players });
          setIsTeam1Submitted(true);
        }
        if (teamB) {
          setMatchTeamB({ id: typeof teamB.id === 'number' ? teamB.id : null, name: teamB.name, location: '', short_name: teamB.short_name, players: teamB.players });
          setIsTeam2Submitted(true);
        }
        if (status === 'SCHEDULED' && match_date) {
          const dateObj = new Date(match_date);
          const date = dateObj.toISOString().split('T')[0];
          const time = dateObj.toTimeString().slice(0, 5);
          setMatchDetails({ venue: venue || '', date, time, format: format || '', umpire_1: umpire_1 || '', umpire_2: umpire_2 || '' });
          setIsMatchScheduled(true);
        }
      }
    } catch (error) {
      console.error('Error fetching current match:', error);
    }
  };

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

  const handleCancelSession = async () => {
    setShowCancelSessionConfirm(false);
    if (!matchToken) {
      localStorage.removeItem('activeMatchToken');
      setIsMatchInitiated(false);
      setMatchToken(null);
      setActiveSlot(null);
      setIsTeam1Submitted(false);
      setIsTeam2Submitted(false);
      dispatch(resetTeam1());
      dispatch(resetTeam2());
      setMatchDetails({ venue: '', date: '', time: '', format: 'T20', umpire_1: '', umpire_2: '' });
      setIsMatchScheduled(false);
      setCountdown('');
      return;
    }
    const toastId = showToast.loading("Cancelling Session...");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await MatchService.deleteToken(matchToken);
      if (response.status >= 200 && response.status < 300) {
        showToast.handleResponse(toastId, response);
        localStorage.removeItem('activeMatchToken');
        setIsMatchInitiated(false);
        setMatchToken(null);
        setActiveSlot(null);
        setIsTeam1Submitted(false);
        setIsTeam2Submitted(false);
        dispatch(resetTeam1());
        dispatch(resetTeam2());
        setMatchDetails({ venue: '', date: '', time: '', format: 'T20', umpire_1: '', umpire_2: '' });
        setIsMatchScheduled(false);
        setCountdown('');
      } else {
        showToast.handleResponse(toastId, response);
      }
    } catch (error) {
      console.error('Error cancelling session:', error);
      showToast.handleResponse(toastId, error);
    }
  };

  const handleSaveTeam1 = (team: BaseTeamData) => dispatch(setTeam1(team));
  const handleSaveTeam2 = (team: BaseTeamData) => dispatch(setTeam2(team));

  const handleEditTeam1 = () => {
    if (!isTeam1Submitted || !matchTeamA) return;
    setIsEditingTeam1(true);
    dispatch(setTeam1(matchTeamA));
    dispatch(setTeam1Players(matchTeamA.players || []));
  };

  const handleEditTeam2 = () => {
    if (!isTeam2Submitted || !matchTeamB) return;
    setIsEditingTeam2(true);
    dispatch(setTeam2(matchTeamB));
    dispatch(setTeam2Players(matchTeamB.players || []));
  };

  const handleDeleteTeam1 = () => {
    if (isTeam1Submitted) {
      setShowDeleteTeam1Confirm(true);
      return;
    }
    dispatch(resetTeam1());
    if (activeSlot === 1) setActiveSlot(null);
  };

  const confirmDeleteTeam1 = () => {
    setShowDeleteTeam1Confirm(false);
    setIsTeam1Submitted(false);
    dispatch(resetTeam1());
    if (activeSlot === 1) setActiveSlot(null);
  };

  const handleDeleteTeam2 = () => {
    if (isTeam2Submitted) {
      setShowDeleteTeam2Confirm(true);
      return;
    }
    dispatch(resetTeam2());
    if (activeSlot === 2) setActiveSlot(null);
  };

  const confirmDeleteTeam2 = () => {
    setShowDeleteTeam2Confirm(false);
    setIsTeam2Submitted(false);
    dispatch(resetTeam2());
    if (activeSlot === 2) setActiveSlot(null);
  };

  const handleSaveTeam1Player = (player: Player, editingIndex: number | null) => {
    if (editingIndex !== null) {
      dispatch(updateTeam1Player({ index: editingIndex, player }));
    } else {
      dispatch(addTeam1Player(player));
    }
  };

  const handleSaveTeam2Player = (player: Player, editingIndex: number | null) => {
    if (editingIndex !== null) {
      dispatch(updateTeam2Player({ index: editingIndex, player }));
    } else {
      dispatch(addTeam2Player(player));
    }
  };

  const handleDeleteTeam1Player = (index: number) => dispatch(deleteTeam1Player(index));
  const handleDeleteTeam2Player = (index: number) => dispatch(deleteTeam2Player(index));

  const handleSubmitTeamToBackend = async (teamNum: 1 | 2) => {
    const team = teamNum === 1 ? team1 : team2;
    const players = teamNum === 1 ? team1Players : team2Players;
    const isEditing = teamNum === 1 ? isEditingTeam1 : isEditingTeam2;
    const matchTeam = teamNum === 1 ? matchTeamA : matchTeamB;

    if (!team.name) {
      showToast.error('Please save team details first');
      return;
    }

    const toastId = showToast.loading(isEditing ? `Updating Team ${teamNum}...` : `Submitting Team ${teamNum}...`);

    try {
      if (isEditing && matchTeam?.id) {
        const payload = { team: { id: team.id, name: team.name, location: team.location }, players };
        const response = await MatchService.updateTeam(matchToken!, matchTeam.id, payload);
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
        const payload = {
          matchId: matchToken!,
          team: { name: team.name, location: team.location, id: team.id },
          players: players.map(p => ({ name: p.name, id: p.id, role: p.role }))
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
      showToast.error('Please fill in all required match details');
      return;
    }

    const toastId = showToast.loading('Scheduling Match...');
    try {
      const payload = {
        venue: matchDetails.venue,
        match_date: `${matchDetails.date}T${matchDetails.time}:00`,
        format: matchDetails.format,
        umpire_1: matchDetails.umpire_1,
        umpire_2: matchDetails.umpire_2
      };
      const response = await MatchService.scheduleMatch(matchToken!, payload);
      if (response.status >= 200 && response.status < 300) {
        showToast.handleResponse(toastId, response);
        setIsMatchScheduled(true);
      } else {
        showToast.handleResponse(toastId, response);
      }
    } catch (error) {
      console.error('Error scheduling match:', error);
      showToast.handleResponse(toastId, error);
    }
  };

  const TeamPlaceholder = ({ onClick, label }: { onClick: () => void; label: string }) => (
    <div onClick={onClick} className="h-[300px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Plus size={32} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
      <h3 className="text-lg font-medium text-gray-500 group-hover:text-blue-500 transition-colors">{label}</h3>
      <p className="text-sm text-gray-400 mt-2">Click to select or create a team</p>
    </div>
  );

  if (!isMatchInitiated) {
    return <GenerateMatchToken onGenerate={generateMatchToken} isGenerating={isGeneratingToken} />;
  }

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-8 duration-500 fade-in">
      <ActiveSessionHeader matchToken={matchToken} onCancel={() => setShowCancelSessionConfirm(true)} />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-start">
        <div className="w-full">
          {isTeam1Submitted && matchTeamA && !isEditingTeam1 ? (
            <TeamCard teamNumber={1} name={matchTeamA?.name} short_name={matchTeamA?.short_name} teamId={matchTeamA?.id?.toString() || 'Pending'} players={matchTeamA?.players || []} onEdit={handleEditTeam1} onDelete={handleDeleteTeam1} showReady={true} />
          ) : (team1.name || activeSlot === 1 || isEditingTeam1) ? (
            <div className="flex flex-col gap-2">
              <TeamSetup teamNumber={1} savedTeam={team1} players={team1Players} onSaveTeam={handleSaveTeam1} onEditTeam={handleEditTeam1} onDeleteTeam={handleDeleteTeam1} onSavePlayer={handleSaveTeam1Player} onEditPlayer={() => {}} onDeletePlayer={handleDeleteTeam1Player} />
              {team1.name && (
                <div className="flex gap-2">
                  <Button variant="primary" size="md" className="flex-1" onClick={() => handleSubmitTeamToBackend(1)}>{isEditingTeam1 ? 'Update Team 1' : 'Submit Team 1'}</Button>
                  {isEditingTeam1 && <Button variant="outline" size="md" onClick={() => { setIsEditingTeam1(false); dispatch(resetTeam1()); dispatch(resetTeam1Players()); }}>Cancel</Button>}
                </div>
              )}
            </div>
          ) : !isTeam1Submitted && !matchTeamA ? (
            <TeamPlaceholder onClick={() => setActiveSlot(1)} label="Select Team 1" />
          ) : null}
        </div>

        <div className="flex items-center justify-center py-4">
          <span className="text-2xl md:text-3xl font-black text-gray-300 dark:text-gray-700 italic">VS</span>
        </div>

        <div className="w-full">
          {isTeam2Submitted && matchTeamB && !isEditingTeam2 ? (
            <TeamCard teamNumber={2} name={matchTeamB.name} short_name={matchTeamB.short_name} teamId={matchTeamB.id?.toString() || 'Pending'} players={matchTeamB.players || []} onEdit={handleEditTeam2} onDelete={handleDeleteTeam2} showReady={true} />
          ) : (team2.name || activeSlot === 2 || isEditingTeam2) ? (
            <div className="flex flex-col gap-2">
              <TeamSetup teamNumber={2} savedTeam={team2} players={team2Players} onSaveTeam={handleSaveTeam2} onEditTeam={handleEditTeam2} onDeleteTeam={handleDeleteTeam2} onSavePlayer={handleSaveTeam2Player} onEditPlayer={() => {}} onDeletePlayer={handleDeleteTeam2Player} />
              {team2.name && (
                <div className="flex gap-2">
                  <Button variant="primary" size="md" className="flex-1" onClick={() => handleSubmitTeamToBackend(2)}>{isEditingTeam2 ? 'Update Team 2' : 'Submit Team 2'}</Button>
                  {isEditingTeam2 && <Button variant="outline" size="md" onClick={() => { setIsEditingTeam2(false); dispatch(resetTeam2()); dispatch(resetTeam2Players()); }}>Cancel</Button>}
                </div>
              )}
            </div>
          ) : !isTeam2Submitted && !matchTeamB ? (
            <TeamPlaceholder onClick={() => setActiveSlot(2)} label="Select Team 2" />
          ) : null}
        </div>
      </div>

      {isTeam1Submitted && isTeam2Submitted && (
        <Card size="md" variant="default" className="animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-base font-bold mb-3 text-[var(--text)]">Match Schedule Details</h2>
          {!isMatchScheduled ? (
            <div className="flex flex-wrap gap-2 items-end">
              <div className="flex-1 min-w-[150px]">
                <Input type="text" label="Venue" placeholder="e.g. Wankhede Stadium" value={matchDetails.venue} onChange={(value: string) => setMatchDetails({ ...matchDetails, venue: value })} size="md" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <Input type="date" label="Date" value={matchDetails.date} onChange={(value: string) => setMatchDetails({ ...matchDetails, date: value })} size="md" />
              </div>
              <div className="flex-1 min-w-[100px]">
                <Input type="time" label="Time" value={matchDetails.time} onChange={(value: string) => setMatchDetails({ ...matchDetails, time: value })} size="md" />
              </div>
              <div className="flex-1 min-w-[100px]">
                <Input type="text" label="Format" placeholder="e.g 20 overs" value={matchDetails.format} onChange={(value: string) => setMatchDetails({ ...matchDetails, format: value })} size="md" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <Input type="text" label="Umpire 1" placeholder="Optional" value={matchDetails.umpire_1} onChange={(value: string) => setMatchDetails({ ...matchDetails, umpire_1: value })} size="md" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <Input type="text" label="Umpire 2" placeholder="Optional" value={matchDetails.umpire_2} onChange={(value: string) => setMatchDetails({ ...matchDetails, umpire_2: value })} size="md" />
              </div>
              <Button variant="primary" size="md" onClick={handleScheduleMatch}>Schedule Match</Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-xs font-medium text-green-500 uppercase tracking-widest mb-1">Match Scheduled Successfully</div>
              <div className="text-3xl font-black text-[var(--text)] tracking-tight font-mono mb-2">{countdown}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-0.5">
                <p>{matchDetails.venue} • {matchDetails.format}</p>
                <p>{new Date(matchDetails.date).toDateString()} at {matchDetails.time}</p>
                {(matchDetails.umpire_1 || matchDetails.umpire_2) && (
                  <p className="text-xs">Umpires: {[matchDetails.umpire_1, matchDetails.umpire_2].filter(Boolean).join(', ')}</p>
                )}
              </div>
              <Button variant="primary" size="md" className="mt-4">
                🏏 Let's Start the Match
              </Button>
            </div>
          )}
        </Card>
      )}

      {showCancelSessionConfirm && <ConfirmDialog message="Are you sure you want to cancel this match session? All progress will be lost." onConfirm={handleCancelSession} onCancel={() => setShowCancelSessionConfirm(false)} />}
      {showDeleteTeam1Confirm && <ConfirmDialog message="This team is already submitted. Do you want to remove it and reset?" onConfirm={confirmDeleteTeam1} onCancel={() => setShowDeleteTeam1Confirm(false)} />}
      {showDeleteTeam2Confirm && <ConfirmDialog message="This team is already submitted. Do you want to remove it and reset?" onConfirm={confirmDeleteTeam2} onCancel={() => setShowDeleteTeam2Confirm(false)} />}
    </div>
  );
};

export default SingleMatchSetupTab;
