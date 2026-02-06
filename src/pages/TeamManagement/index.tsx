import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Settings,
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
  Trophy,
  Shield
} from 'lucide-react';
import { MatchService } from '../../services/matchService';
import { showToast } from '../../utils/toast';
import { RootState } from '../../store';
import {
  setTeam1, setTeam2,
  setTeam1Players, setTeam2Players,
  resetTeam1, resetTeam2,
  resetTeam1Players, resetTeam2Players,
  setCurrentMatch
} from '../../store/slices/teamManagementSlice';
import TeamSetup from '../../components/TeamSetup';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import MatchStartTab from './MatchStartTab';
import { useBreadcrumbs } from '../../context/BreadcrumbContext';

type Step = 'team-a' | 'team-b' | 'match-details' | 'match-start';

const TeamManagement = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setPageMeta } = useBreadcrumbs();

  const [currentStep, setCurrentStep] = useState<Step>('team-a');
  const [loading, setLoading] = useState(true);
  const [matchDetails, setMatchDetails] = useState({
    venue: '', date: '', time: '', format: '20', umpire_1: '', umpire_2: '', status: ''
  });

  const { team1, team2, team1Players, team2Players, currentMatch } = useSelector(
    (state: RootState) => state.teamManagement
  );

  // Set Page Meta
  useEffect(() => {
    setPageMeta({
      description: `Setup teams and match logistics for session: ${matchId?.substring(0, 8).toUpperCase()}`,
      actions: (
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-sm bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm flex items-center gap-2">
            <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Session</span>
            <span className="text-xs font-mono font-bold text-cyan-600 tracking-wider">{matchId?.substring(0, 8).toUpperCase()}</span>
          </div>
          <div className={`px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest border ${currentMatch?.status === 'LIVE'
            ? 'bg-red-500/5 border-red-500/20 text-red-500'
            : 'bg-cyan-500/5 border-cyan-500/20 text-cyan-500'
            }`}>
            {currentMatch?.status || 'INIT'}
          </div>
        </div>
      )
    });
  }, [setPageMeta, matchId, currentMatch?.status]);

  const steps: { key: Step; label: string; icon: any }[] = [
    { key: 'team-a', label: 'Team A Setup', icon: Shield },
    { key: 'team-b', label: 'Team B Setup', icon: Shield },
    { key: 'match-details', label: 'Match Details', icon: Settings },
    { key: 'match-start', label: 'Start Match', icon: PlayCircle },
  ];

  const fetchMatchData = async () => {
    if (!matchId) {
      navigate('/admin/match-setup');
      return;
    }
    setLoading(true);
    try {
      const response = await MatchService.getCurrentMatch(matchId);
      if (response.data) {
        dispatch(setCurrentMatch(response.data));
        const { teamA, teamB, match_date, venue, format, umpire_1, umpire_2, status } = response.data;

        if (teamA) {
          dispatch(setTeam1({ id: teamA.id, name: teamA.name, location: '', short_name: teamA.short_name }));
          dispatch(setTeam1Players(teamA.players || []));
        } else {
          dispatch(resetTeam1());
          dispatch(resetTeam1Players());
        }

        if (teamB) {
          dispatch(setTeam2({ id: teamB.id, name: teamB.name, location: '', short_name: teamB.short_name }));
          dispatch(setTeam2Players(teamB.players || []));
        } else {
          dispatch(resetTeam2());
          dispatch(resetTeam2Players());
        }

        if (match_date) {
          const dateObj = new Date(match_date);
          setMatchDetails({
            venue: venue || '',
            date: dateObj.toISOString().split('T')[0],
            time: dateObj.toTimeString().slice(0, 5),
            format: format || '20',
            umpire_1: umpire_1 || '',
            umpire_2: umpire_2 || '',
            status: status || ''
          });
        }

        // Auto-navigate to correct step if already submitted
        if (status === 'SCHEDULED' || status === 'LIVE') {
          setCurrentStep('match-start');
        } else if (teamA && teamB) {
          setCurrentStep('match-details');
        } else if (teamA) {
          setCurrentStep('team-b');
        } else {
          setCurrentStep('team-a');
        }
      }
    } catch (error: any) {
      console.error('Error fetching match:', error);
      showToast.error(error?.response?.data?.message || 'Failed to load match data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchData();
    return () => {
      dispatch(setCurrentMatch(null));
      dispatch(resetTeam1());
      dispatch(resetTeam2());
      dispatch(resetTeam1Players());
      dispatch(resetTeam2Players());
    };
  }, [matchId]);

  const handleTeamSubmit = async (teamNum: 1 | 2) => {
    const team = teamNum === 1 ? team1 : team2;
    const players = teamNum === 1 ? team1Players : team2Players;
    const existingTeam = teamNum === 1 ? currentMatch?.teamA : currentMatch?.teamB;

    if (!team.name) {
      showToast.error('Please fill team details');
      return;
    }

    const toastId = showToast.loading(`${existingTeam?.id ? 'Updating' : 'Saving'} Team ${teamNum === 1 ? 'A' : 'B'}...`);
    try {
      let response;
      if (existingTeam?.id) {
        // Update existing team
        const payload = {
          team: { id: team.id, name: team.name, location: team.location },
          players
        };
        response = await MatchService.updateTeam(matchId!, existingTeam.id, payload);
      } else {
        // New team setup
        const payload = {
          matchId: matchId!,
          team: { name: team.name, location: team.location, id: team.id },
          players: players.map(p => ({ name: p.name, id: p.id, role: p.role }))
        };
        response = await MatchService.teamSetup(payload);
      }

      showToast.handleResponse(toastId, response);
      if (response.status >= 200 && response.status < 300) {
        await fetchMatchData();
        setCurrentStep(teamNum === 1 ? 'team-b' : 'match-details');
      }
    } catch (error) {
      showToast.handleResponse(toastId, error);
    } finally {
    }
  };

  const handleScheduleMatch = async () => {
    if (!matchDetails.venue || !matchDetails.date || !matchDetails.time) {
      showToast.error('Please fill all match details');
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
      const response = await MatchService.scheduleMatch(matchId!, payload);
      showToast.handleResponse(toastId, response);
      if (response.status >= 200 && response.status < 300) {
        await fetchMatchData();
        setCurrentStep('match-start');
      }
    } catch (error) {
      showToast.handleResponse(toastId, error);
    } finally {
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-1.5 sm:p-3 space-y-2 animate-in fade-in duration-500 bg-transparent">
      {/* Advanced Slim Stepper - Minimal Vertical Gap */}
      <div className="py-2">
        <div className="relative flex justify-between items-start max-w-2xl mx-auto px-4 z-0">
          {/* Progress Line Background */}
          <div className="absolute left-[30px] right-[30px] top-[13px] h-[2px] bg-gray-200 dark:bg-gray-800" />

          {/* Active Progress Line */}
          <div className="absolute left-[30px] right-[30px] top-[13px] h-[2px] overflow-hidden">
            <div
              className={`h-full bg-cyan-500 transition-all duration-700 ease-out`}
              style={{ width: `${(steps.findIndex(s => s.key === currentStep) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step, idx) => {
            const isCompleted = steps.findIndex(s => s.key === currentStep) > idx;
            const isActive = currentStep === step.key;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center gap-1.5 group cursor-default relative z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-110 ring-4 ring-white dark:ring-gray-900' :
                    isCompleted ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' :
                      'bg-white dark:bg-gray-800 text-gray-300 border border-gray-200 dark:border-gray-700'
                    }`}
                >
                  {isCompleted ? <CheckCircle2 size={14} /> : <Icon size={14} />}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-cyan-600' : isCompleted ? 'text-emerald-500' : 'text-gray-400'
                  }`}>
                  {step.label.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-sm p-4 sm:p-5 shadow-sm min-h-[400px]">
        {currentStep === 'team-a' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-bold tracking-tight">TEAM A <span className="text-cyan-600 uppercase font-black">SETUP</span></h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Configure first team roster</p>
              </div>
              {currentMatch?.teamA && (
                <CheckCircle2 className="text-green-500" size={24} />
              )}
            </div>

            <TeamSetup
              teamNumber={1}
              savedTeam={team1}
              players={team1Players}
              onSaveTeam={(t) => dispatch(setTeam1(t))}
              onSavePlayer={(p, idx) => {
                const newPlayers = [...team1Players];
                if (idx !== null) newPlayers[idx] = p;
                else newPlayers.push(p);
                dispatch(setTeam1Players(newPlayers));
              }}
              onDeletePlayer={(idx) => {
                const newPlayers = team1Players.filter((_, i) => i !== idx);
                dispatch(setTeam1Players(newPlayers));
              }}
              onEditTeam={() => { }}
              onDeleteTeam={() => dispatch(resetTeam1())}
              onEditPlayer={() => { }}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50 dark:border-gray-800">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleTeamSubmit(1)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 text-xs font-bold tracking-widest uppercase"
              >
                SAVE & CONTINUE <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'team-b' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-bold tracking-tight">TEAM B <span className="text-cyan-600 uppercase font-black">SETUP</span></h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Configure rival team roster</p>
              </div>
              {currentMatch?.teamB && (
                <CheckCircle2 className="text-green-500" size={24} />
              )}
            </div>

            <TeamSetup
              teamNumber={2}
              savedTeam={team2}
              players={team2Players}
              onSaveTeam={(t) => dispatch(setTeam2(t))}
              onSavePlayer={(p, idx) => {
                const newPlayers = [...team2Players];
                if (idx !== null) newPlayers[idx] = p;
                else newPlayers.push(p);
                dispatch(setTeam2Players(newPlayers));
              }}
              onDeletePlayer={(idx) => {
                const newPlayers = team2Players.filter((_, i) => i !== idx);
                dispatch(setTeam2Players(newPlayers));
              }}
              onEditTeam={() => { }}
              onDeleteTeam={() => dispatch(resetTeam2())}
              onEditPlayer={() => { }}
            />

            <div className="flex justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep('team-a')}
                className="text-xs font-bold tracking-widest uppercase"
              >
                <ChevronLeft size={14} className="mr-1" /> PREVIOUS
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleTeamSubmit(2)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 text-xs font-bold tracking-widest uppercase"
              >
                SAVE & CONTINUE <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'match-details' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-gray-50 dark:border-gray-800">
              <h2 className="text-lg font-black tracking-tight">MATCH <span className="text-cyan-600">LOGISTICS</span></h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Venue, timing and conditions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Input
                  label="Match Venue"
                  placeholder="e.g. Lord's Cricket Ground"
                  value={matchDetails.venue}
                  onChange={(v: string) => setMatchDetails({ ...matchDetails, venue: v })}
                  icon={MapPin}
                  size="sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="date"
                    label="Match Date"
                    value={matchDetails.date}
                    onChange={(v: string) => setMatchDetails({ ...matchDetails, date: v })}
                    icon={Calendar}
                    size="sm"
                  />
                  <Input
                    type="time"
                    label="Start Time"
                    value={matchDetails.time}
                    onChange={(v: string) => setMatchDetails({ ...matchDetails, time: v })}
                    size="sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Input
                  label="Match Format (Overs)"
                  placeholder="e.g. 20"
                  value={matchDetails.format}
                  onChange={(v: string) => setMatchDetails({ ...matchDetails, format: v })}
                  icon={Trophy}
                  size="sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Head Umpire"
                    placeholder="Name"
                    value={matchDetails.umpire_1}
                    onChange={(v: string) => setMatchDetails({ ...matchDetails, umpire_1: v })}
                    size="sm"
                  />
                  <Input
                    label="Square Leg Umpire"
                    placeholder="Name"
                    value={matchDetails.umpire_2}
                    onChange={(v: string) => setMatchDetails({ ...matchDetails, umpire_2: v })}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep('team-b')}
                className="text-xs font-bold tracking-widest uppercase"
              >
                <ChevronLeft size={14} className="mr-1" /> PREVIOUS
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleScheduleMatch}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 text-xs font-bold tracking-widest uppercase"
              >
                SCHEDULE MATCH <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'match-start' && (
          <MatchStartTab
            matchData={{
              ...currentMatch,
              matchToken: matchId,
              matchDetails: matchDetails,
              teamA: currentMatch?.teamA,
              teamB: currentMatch?.teamB
            }}
            onRefresh={fetchMatchData}
            onMatchStart={() => navigate(`/admin/score-edit/${matchId}`)}
          />
        )}
      </div>

      <style>{`
        .rounded-full { border-radius: 9999px !important; }
        .rounded-sm { border-radius: 2px !important; }
        .rounded-xl { border-radius: 4px !important; }
        input, select, button { border-radius: 2px !important; }
      `}</style>
    </div>
  );
};

export default TeamManagement;
