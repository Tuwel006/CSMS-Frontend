import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Eye, ChevronUp, ChevronDown } from 'lucide-react';
import Button from '../../components/ui/Button';
import BallHistory from '../../components/ui/BallHistory';
import LivePreview from '../../components/ui/LivePreview';
import ActiveSessionHeader from '../../components/ActiveSessionHeader';
import PlayerSelectionModal from '../../components/ui/PlayerSelectionModal';
import WicketModal from '../../components/ui/WicketModal';
import { MatchService } from '../../services/matchService';
import { showToast } from '../../utils/toast';
import { MatchScoreResponse } from '../../types/scoreService';
import { Box, Stack, GridLayout, IconButton } from '../../components/ui/lib';
import MatchHeader from './components/MatchHeader';
import CurrentScoreCard from './components/CurrentScoreCard';
import RecentOversCard from './components/RecentOversCard';
import BallOutcomes from './components/BallOutcomes';
import BallConfirmModal from './components/BallConfirmModal';
import ExtrasWarningModal from './components/ExtrasWarningModal';

const ScoreEdit = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [matchData, setMatchData] = useState<MatchScoreResponse | null>(null);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scoreUpdating, setScoreUpdating] = useState(false);
  const [extrasEnabled, setExtrasEnabled] = useState(() => {
    const saved = localStorage.getItem('extrasEnabled');
    return saved !== null ? saved === 'true' : true;
  });

  const [showBatsmanModal, setShowBatsmanModal] = useState(false);
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showBallConfirmModal, setShowBallConfirmModal] = useState(false);
  const [pendingBallType, setPendingBallType] = useState<string>('');
  const [ballRuns, setBallRuns] = useState<string>('0');
  const [availableBatsmen, setAvailableBatsmen] = useState([]);
  const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [showExtrasWarning, setShowExtrasWarning] = useState(false);
  const [pendingExtrasValue, setPendingExtrasValue] = useState(false);

  const toggleExtras = useCallback(() => {
    const newValue = !extrasEnabled;
    setPendingExtrasValue(newValue);
    setShowExtrasWarning(true);
  }, [extrasEnabled]);

  const confirmExtrasChange = useCallback(() => {
    setExtrasEnabled(pendingExtrasValue);
    localStorage.setItem('extrasEnabled', String(pendingExtrasValue));
    setShowExtrasWarning(false);
    showToast.success(`Extra runs ${pendingExtrasValue ? 'enabled' : 'disabled'}`);
  }, [pendingExtrasValue]);

  const fetchMatchScore = useCallback(async () => {
    if (!matchId) {
      setLoading(false);
      setError('No match ID found in URL');
      return;
    }

    try {
      const response = await MatchService.getMatchScore(matchId);
      if (response?.data) {
        setMatchData(response.data);
        setError(null);
      } else {
        setError('No match data found');
      }
    } catch (error) {
      console.error('Error fetching match score:', error);
      setError('Failed to load match data');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMatchScore();
  }, [fetchMatchScore]);

  const fetchAvailableBatsmen = useCallback(async () => {
    if (!matchId || !matchData) return;
    try {
      setModalLoading(true);
      const response = await MatchService.getAvailableBatsmen(matchId);
      if (response.data) {
        setAvailableBatsmen(response.data);
      }
    } catch (error) {
      console.error('Error fetching batsmen:', error);
    } finally {
      setModalLoading(false);
    }
  }, [matchId, matchData]);

  const fetchBowlingTeam = useCallback(async () => {
    if (!matchId || !matchData) return;
    try {
      setModalLoading(true);
      const response = await MatchService.getBowlingTeam(matchId);
      if (response.data) {
        setBowlingTeamPlayers(response.data);
      }
    } catch (error) {
      console.error('Error fetching bowling team:', error);
    } finally {
      setModalLoading(false);
    }
  }, [matchId, matchData]);

  const currentInnings = useMemo(() => matchData?.innings?.[matchData?.innings?.length ? matchData.innings.length - 1 : 0], [matchData]);

  const handleBallUpdate = useCallback(async (ballType: string, runs?: string) => {
    if (ballType === 'W') {
      setShowWicketModal(true);
    } else {
      setPendingBallType(ballType);
      if (ballType === 'NB' && runs) {
        setBallRuns(runs);
      } else if (['0', '1', '2', '3', '4', '5', '6'].includes(ballType)) {
        setBallRuns(ballType);
      } else {
        setBallRuns('0');
      }
      setShowBallConfirmModal(true);
    }
  }, []);

  const handleConfirmBall = useCallback(async () => {
    setShowBallConfirmModal(false);
    setScoreUpdating(true);
    try {
      const currentBatsman = currentInnings?.batting?.striker;
      const currentBowler = currentInnings?.bowling?.find((b: any) => b.id === currentInnings?.currentOver?.bowlerId);

      if (!currentBatsman || !currentBowler) {
        showToast.error('Please select batsman and bowler first');
        setScoreUpdating(false);
        return;
      }

      const runs = parseInt(ballRuns) || 0;
      const payload = {
        matchId: matchId!,
        innings_id: currentInnings?.i || 1,
        ball_type: pendingBallType === 'WD' ? 'WIDE' : pendingBallType === 'NB' ? 'NO_BALL' : pendingBallType === 'BYE' ? 'BYE' : pendingBallType === 'LB' ? 'LEG_BYE' : 'NORMAL',
        runs,
        batsman_id: currentBatsman.id,
        bowler_id: currentBowler.id,
        is_wicket: false,
        is_boundary: runs === 4 || runs === 6,
        extras_enabled: extrasEnabled
      };

      const response = await MatchService.recordBall(payload);
      if (response.data?.success) {
        const scorecardResponse = await MatchService.getMatchScore(matchId!);
        if (scorecardResponse.data) {
          setMatchData(scorecardResponse.data);
        }
        showToast.success(response.message || 'Ball recorded successfully');
      }
    } catch (error: any) {
      console.error('Error recording ball:', error);
      showToast.error(error?.response?.data?.message || error?.message || 'Failed to record ball');
    } finally {
      setScoreUpdating(false);
      setPendingBallType('');
      setBallRuns('0');
    }
  }, [currentInnings, matchId, ballRuns, pendingBallType, extrasEnabled]);

  const handleWicket = useCallback(async (dismissalType: string, fielder?: string, normalRun?: number, byeRuns?: number, outBatsmanId?: string, ballType?: 'NORMAL' | 'WIDE' | 'NO_BALL') => {
    try {
      const currentBatsman = currentInnings?.batting?.striker;
      const currentBowler = currentInnings?.bowling?.find((b: any) => b.id === currentInnings?.currentOver?.bowlerId);

      if (!currentBatsman || !currentBowler) {
        showToast.error('Please select batsman and bowler first');
        return;
      }

      const payload: any = {
        matchId: matchId!,
        innings_id: currentInnings?.i || 1,
        ball_type: ballType,
        runs: normalRun !== undefined ? normalRun : 0,
        by_runs: byeRuns !== undefined ? byeRuns : 0,
        batsman_id: currentBatsman.id,
        bowler_id: currentBowler.id,
        is_wicket: true,
        wicket: {
          wicket_type: dismissalType,
          out_batsman_id: outBatsmanId ? parseInt(outBatsmanId) : currentBatsman.id,
          filder_id: fielder ? parseInt(fielder) : undefined
        },
        is_boundary: false
      };
      console.log('Payload for wicket:', payload);
      const response = await MatchService.recordBall(payload);
      if (response.data?.success) {
        setShowWicketModal(false);
        const scorecardResponse = await MatchService.getMatchScore(matchId!);
        if (scorecardResponse.data) {
          setMatchData(scorecardResponse.data);
        }
        showToast.success(response.message || 'Wicket recorded successfully');
        fetchAvailableBatsmen();
        setShowBatsmanModal(true);
      }
    } catch (error: any) {
      console.error('Error recording wicket:', error);
      showToast.error(error?.response?.data?.message || error?.message || 'Failed to record wicket');
    }
  }, [currentInnings, matchId, fetchAvailableBatsmen]);

  const handleSelectBatsman = useCallback(async (player: any) => {
    if (player === 'OPEN_MODAL') {
      setShowBatsmanModal(true);
      return;
    }

    try {
      const payload = {
        innings_id: currentInnings?.i || 1,
        player_id: player.id,
        is_striker: true,
        ret_hurt: false
      };

      const response = await MatchService.setBatsman(matchId!, payload);
      if (response.data?.success) {
        setShowBatsmanModal(false);
        const scorecardResponse = await MatchService.getMatchScore(matchId!);
        if (scorecardResponse.data) {
          setMatchData(scorecardResponse.data);
        }
        showToast.success(response.message || 'Batsman selected successfully');
      }
    } catch (error: any) {
      console.error('Error selecting batsman:', error);
      showToast.error(error?.response?.data?.message || error?.message || 'Failed to select batsman');
    }
  }, [matchId, currentInnings]);

  const handleSelectBowler = useCallback(async (player: any) => {
    if (player === 'OPEN_MODAL') {
      setShowBowlerModal(true);
      return;
    }

    try {
      const payload = {
        innings_id: currentInnings?.i || 1,
        player_id: player.id
      };

      const response = await MatchService.setBowler(matchId!, payload);
      if (response.data?.success) {
        setShowBowlerModal(false);
        const scorecardResponse = await MatchService.getMatchScore(matchId!);
        if (scorecardResponse.data) {
          setMatchData(scorecardResponse.data);
        }
        showToast.success(response.message || 'Bowler selected successfully');
      }
    } catch (error: any) {
      console.error('Error selecting bowler:', error);
      showToast.error(error?.response?.data?.message || error?.message || 'Failed to select bowler');
    }
  }, [matchId, currentInnings]);

  const handleOverComplete = useCallback(() => {
    fetchBowlingTeam();
    setShowBowlerModal(true);
  }, [fetchBowlingTeam]);

  useEffect(() => {
    if (currentInnings?.currentOver?.isOverComplete) {
      handleOverComplete();
    }
  }, [currentInnings?.currentOver?.isOverComplete, handleOverComplete]);

  if (loading) {
    return (
      <Stack direction="col" align="center" justify="center" className="h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack direction="col" align="center" justify="center" className="h-screen">
        <Box p="lg" bg="card" border rounded="md" className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            onClick={() => {
              const token = localStorage.getItem('activeMatchToken');
              if (token) fetchMatchScore();
            }}
            variant="primary"
          >
            Retry
          </Button>
        </Box>
      </Stack>
    );
  }

  if (!matchData) {
    return (
      <Stack direction="col" align="center" justify="center" className="h-screen">
        <p className="text-gray-500">No match data available</p>
      </Stack>
    );
  }

  return (
    <Box p="sm" className="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] overflow-y-auto pb-20 lg:pb-4">
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isHeaderCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'}`}>
        <Box p="none" className="mb-2">
          <ActiveSessionHeader matchToken={matchId || ''} onCancel={() => { }} />
        </Box>
        <MatchHeader teams={matchData.teams} meta={matchData.meta} isCollapsed={false} onToggleCollapse={() => { }} onPreview={() => { }} />
      </div>

      <Stack direction="row" justify="between" align="center" className="mb-3">
        <IconButton
          icon={isHeaderCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
          tooltip={isHeaderCollapsed ? 'Show Header' : 'Hide Header'}
          variant="ghost"
          size="sm"
        />
        <IconButton
          icon={<Eye size={18} />}
          onClick={() => setIsPreviewOpen(true)}
          tooltip="Live Preview"
          variant="secondary"
          size="sm"
        />
      </Stack>

      <GridLayout cols={2} gap="sm" className="mb-3">
        <CurrentScoreCard
          currentInnings={currentInnings}
          teams={matchData.teams}
          onSelectBatsman={handleSelectBatsman}
          loading={loading}
          scoreUpdating={scoreUpdating}
          fetchAvailableBatsmen={fetchAvailableBatsmen}
        />
        <RecentOversCard
          currentInnings={currentInnings}
          teams={matchData.teams}
          onSelectBowler={handleSelectBowler}
          fetchBowlingTeam={fetchBowlingTeam}
          onOverComplete={handleOverComplete}
        />
      </GridLayout>

      <BallOutcomes
        onBallUpdate={handleBallUpdate}
        extrasEnabled={extrasEnabled}
        onToggleExtras={toggleExtras}
      />

      <Box p="none" className="mb-3">
        <BallHistory overs={currentInnings?.currentOver ? [{ ...currentInnings.currentOver, overNumber: currentInnings.currentOver.o || 1, bowler: currentInnings.bowling?.find((b: any) => b.id === currentInnings.currentOver?.bowlerId)?.n || 'Unknown' }] : []} />
      </Box>

      <LivePreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        matchData={matchData}
      />

      <PlayerSelectionModal
        isOpen={showBatsmanModal}
        onClose={() => setShowBatsmanModal(false)}
        onSelect={handleSelectBatsman}
        players={availableBatsmen}
        title="Select Next Batsman"
        loading={modalLoading}
      />

      <PlayerSelectionModal
        isOpen={showBowlerModal}
        onClose={() => setShowBowlerModal(false)}
        onSelect={handleSelectBowler}
        players={bowlingTeamPlayers}
        title="Select Bowler"
        loading={modalLoading}
      />

      <WicketModal
        isOpen={showWicketModal}
        onClose={() => setShowWicketModal(false)}
        onConfirm={handleWicket}
        bowlingTeamPlayers={bowlingTeamPlayers}
        currentBatsmen={currentInnings?.batting}
      />

      <BallConfirmModal
        isOpen={showBallConfirmModal}
        ballType={pendingBallType}
        ballRuns={ballRuns}
        onRunsChange={setBallRuns}
        onConfirm={handleConfirmBall}
        onCancel={() => {
          setShowBallConfirmModal(false);
          setPendingBallType('');
          setBallRuns('0');
        }}
      />

      <ExtrasWarningModal
        isOpen={showExtrasWarning}
        pendingValue={pendingExtrasValue}
        onConfirm={confirmExtrasChange}
        onCancel={() => setShowExtrasWarning(false)}
      />
    </Box>
  );
};

export default ScoreEdit;
