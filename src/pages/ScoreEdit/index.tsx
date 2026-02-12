import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Eye, ChevronDown } from 'lucide-react';
import Button from '../../components/ui/Button';
import BallHistory from '../../components/ui/BallHistory';
import LivePreview from '../../components/ui/LivePreview';
import ActiveSessionHeader from '../../components/ActiveSessionHeader';
import PlayerSelectionModal from '../../components/ui/PlayerSelectionModal';
import WicketModal from '../../components/ui/WicketModal';
import { MatchService } from '../../services/matchService';
import { showToast } from '../../utils/toast';
import { Innings } from '../../types/scoreService';
import MatchHeader from './components/MatchHeader';
import CurrentScoreCard from './components/CurrentScoreCard';
import RecentOversCard from './components/RecentOversCard';
import BallOutcomes from './components/BallOutcomes';
import BallConfirmModal from './components/BallConfirmModal';
import ExtrasWarningModal from './components/ExtrasWarningModal';
import InningsCompleteModal from './components/InningsCompleteModal';
import { MatchResultModal } from './components/MatchResultModal';
import { recordBall } from '@/store/score/scoreThunks';
import { setScore } from '@/store/score/scoreSlice';
import { PageLoader, ErrorDisplay } from '@/components/ui/loading';
import { Trophy } from 'lucide-react';

const ScoreEdit = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const dispatch = useAppDispatch();
  const scoreData = useAppSelector(state => state.score.data);
  const matchData = scoreData;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scoreUpdating, setScoreUpdating] = useState(false);
  const [extrasEnabled, setExtrasEnabled] = useState(() => {
    const saved = localStorage.getItem('extrasEnabled');
    return saved !== null ? saved === 'true' : true;
  });
  console.log("score data: ", scoreData);
  console.log("match data: ", matchData);
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
  const [_isByeRun, setIsByeRun] = useState(false);
  const [showMatchResult, setShowMatchResult] = useState(false);
  const lastFetchedInningsRef = useRef<number | null>(null);

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
        dispatch(setScore(response.data));
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
  }, [matchId, dispatch]);

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

  const currentInnings = useMemo(() => matchData?.innings?.length ? matchData.innings.find((innings: Innings) => innings.i === matchData.meta.currentInningsId) : null, [matchData]);

  // Check if match is completed
  const isMatchCompleted = useMemo(() => {
    return matchData?.meta?.isMatchCompleted || false;
  }, [matchData]);

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
        setIsByeRun(true);
      }
      setShowBallConfirmModal(true);
    }
  }, []);
  console.log("current innings: ", currentInnings);
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
      const getBallType = (): 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE' | 'NORMAL' => {
        if (pendingBallType === 'WD') return 'WIDE';
        if (pendingBallType === 'NB') return 'NO_BALL';
        if (pendingBallType === 'BYE') return 'BYE';
        if (pendingBallType === 'LB') return 'LEG_BYE';
        return 'NORMAL';
      };

      const payload = {
        matchId: matchId!,
        innings_id: currentInnings?.i || 1,
        ball_type: getBallType(),
        runs,
        batsman_id: currentBatsman.id,
        bowler_id: currentBowler.id,
        is_wicket: false,
        is_boundary: runs === 4 || runs === 6,
        extras_enabled: extrasEnabled
      };

      const result = await dispatch(recordBall(payload)).unwrap();
      showToast.success(result.message);
    } catch (error: any) {
      console.error('Error recording ball:', error);
      showToast.error(error || 'Failed to record ball');
    } finally {
      setScoreUpdating(false);
      setPendingBallType('');
      setBallRuns('0');
    }
  }, [currentInnings, matchId, ballRuns, pendingBallType, extrasEnabled, dispatch]);

  const handleWicket = useCallback(async (dismissalType: string, fielder?: string, normalRun?: number, byeRuns?: number, outBatsmanId?: string, ballType?: 'NORMAL' | 'WIDE' | 'NO_BALL') => {
    setScoreUpdating(true);
    try {
      const currentBatsman = currentInnings?.batting?.striker;
      const currentBowler = currentInnings?.bowling?.find((b: any) => b.id === currentInnings?.currentOver?.bowlerId);

      if (!currentBatsman || !currentBowler) {
        showToast.error('Please select batsman and bowler first');
        setScoreUpdating(false);
        return;
      }

      const payload: any = {
        matchId: matchId!,
        innings_id: currentInnings?.i || 1,
        ball_type: ballType || 'NORMAL',
        runs: normalRun !== undefined ? normalRun : 0,
        by_runs: byeRuns !== undefined ? byeRuns : 0,
        batsman_id: currentBatsman.id,
        bowler_id: currentBowler.id,
        is_wicket: true,
        wicket: {
          wicket_type: dismissalType,
          out_batsman_id: outBatsmanId ? parseInt(outBatsmanId) : currentBatsman.id,
          fielder_id: fielder ? parseInt(fielder) : undefined
        },
        is_boundary: false
      };
      console.log('Payload for wicket:', payload);
      const response = await dispatch(recordBall(payload)).unwrap();
      setShowWicketModal(false);
      showToast.success(response.message || 'Wicket recorded successfully');

      // Only show batsman modal if innings is not over
      if (!response.data?.is_innings_over) {
        fetchAvailableBatsmen();
        setShowBatsmanModal(true);
      }
    } catch (error: any) {
      console.error('Error recording wicket:', error);
      showToast.error(error?.response?.data?.message || error?.message || 'Failed to record wicket');
    } finally {
      setScoreUpdating(false);
    }
  }, [currentInnings, matchId, fetchAvailableBatsmen]);

  const handleSelectBatsman = useCallback(async (player: any) => {
    console.log("player", player);
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
      if (response.data) {
        setShowBatsmanModal(false);
        await fetchMatchScore();
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
      if (response.data) {
        setShowBowlerModal(false);
        await fetchMatchScore();
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

  const isInningsOver = useMemo(() => currentInnings?.is_innings_over || currentInnings?.is_completed, [currentInnings]);
  console.log("is innings over", isInningsOver);

  useEffect(() => {
    const inningsId = currentInnings?.i;
    if (currentInnings?.is_innings_over && !isMatchCompleted && lastFetchedInningsRef.current !== inningsId) {
      // Mark as fetched immediately to prevent double-trigger
      lastFetchedInningsRef.current = inningsId || null;

      // Small delay to ensure state is settled before refetching for clarity
      const timer = setTimeout(() => {
        fetchMatchScore();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentInnings?.is_innings_over, currentInnings?.i, isMatchCompleted, fetchMatchScore]);

  // Auto-open Match Result modal when match is completed
  useEffect(() => {
    if (isMatchCompleted) {
      setShowMatchResult(true);
    }
  }, [isMatchCompleted]);

  const handleStartNextInnings = useCallback(async (isFollowOn: boolean = false) => {
    if (!matchId) return;

    try {
      setLoading(true);
      const response = await MatchService.nextInnings(matchId, isFollowOn);

      if (response.data) {
        await fetchMatchScore();
        showToast.success(response.message || 'Moved to next innings');
      }
    } catch (error: any) {
      console.error('Error starting next innings:', error);
      showToast.error(error?.response?.data?.message || error?.message || 'Failed to start next innings');
    } finally {
      setLoading(false);
    }
  }, [matchId, fetchMatchScore]);

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="p-4">
        <ErrorDisplay message={error} onRetry={fetchMatchScore} />
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="p-4">
        <ErrorDisplay message="No match data available" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] relative flex flex-col overflow-hidden bg-[var(--page-bg)]">
      <div className="flex-1 overflow-y-auto p-1.5 pt-0.5 sm:p-2.5 sm:pt-1.5 pb-24 lg:pb-8">
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isHeaderCollapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
          <div className="mb-0.5 sm:mb-1">
            <ActiveSessionHeader matchToken={matchId || ''} onCancel={() => { }} />
          </div>
          <MatchHeader
            teams={matchData.teams}
            meta={matchData.meta}
            isCollapsed={isHeaderCollapsed}
            onToggleCollapse={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
            onPreview={() => setIsPreviewOpen(true)}
          />
        </div>

        {isHeaderCollapsed && (
          <div className="h-6.5 sm:h-7.5 bg-[var(--card-bg)] border-y border-[var(--card-border)] flex items-center justify-between px-3 mb-1.5 sm:mb-2 transition-all">
            <Button
              size="sm"
              onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
              className="h-5 w-8 hover:brightness-110 transition-all font-bold"
            >
              <ChevronDown size={12} />
            </Button>
            <Button
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              className="h-5 w-8 hover:brightness-110 transition-all font-bold"
            >
              <Eye size={12} />
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 mb-2.5">
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
        </div>

        <div className="relative">
          <BallOutcomes
            onBallUpdate={handleBallUpdate}
            extrasEnabled={extrasEnabled}
            onToggleExtras={toggleExtras}
            disabled={isInningsOver || scoreUpdating || isMatchCompleted}
          />
        </div>

        <div className="mb-3">
          <BallHistory overs={currentInnings?.currentOver ? [{ ...currentInnings.currentOver, overNumber: currentInnings.currentOver.o || 1, bowler: currentInnings.bowling?.find((b: any) => b.id === currentInnings.currentOver?.bowlerId)?.n || 'Unknown' }] : []} />
        </div>

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
      </div>

      {/* Floating Match Result Button - Only show when match is completed */}
      {isMatchCompleted && (
        <button
          onClick={() => setShowMatchResult(true)}
          className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-30 animate-bounce"
          title="View Match Result"
        >
          <Trophy size={24} className="text-white" />
        </button>
      )}

      {/* InningsCompleteModal stays fixed relative to THIS div, which doesn't cover sidebar */}
      <InningsCompleteModal
        isOpen={isInningsOver && !isMatchCompleted}
        currentInnings={currentInnings}
        teams={matchData?.teams}
        matchData={matchData}
        onStartNext={handleStartNextInnings}
        onViewScorecard={() => setIsPreviewOpen(true)}
      />

      {/* Match Result Modal */}
      <MatchResultModal
        isOpen={showMatchResult}
        matchData={matchData}
        onClose={() => setShowMatchResult(false)}
      />
    </div>
  );
};

export default ScoreEdit;
