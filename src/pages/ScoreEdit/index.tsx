import React, { useState, useEffect, useCallback, useMemo } from 'react';
<<<<<<< HEAD
import { Eye, ChevronDown } from 'lucide-react';
=======
>>>>>>> 87c46b1 (feat: Add Text and Tooltip components for UI consistency)
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
import { MatchScoreResponse } from '../../types/scoreService';
import MatchHeader from './components/MatchHeader';
import CurrentScoreCard from './components/CurrentScoreCard';
import RecentOversCard from './components/RecentOversCard';
import BallOutcomes from './components/BallOutcomes';
import BallConfirmModal from './components/BallConfirmModal';
import ExtrasWarningModal from './components/ExtrasWarningModal';
import { recordBall } from '@/store/score/scoreThunks';
import { setScore } from '@/store/score/scoreSlice';

const ScoreEdit = () => {
  const dispatch = useAppDispatch();
  const scoreData = useAppSelector(state => state.score.data);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [matchData, setMatchData] = useState<MatchScoreResponse | null>(null);
  const [matchToken] = useState(() => localStorage.getItem('activeMatchToken'));
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
  const [isByeRun, setIsByeRun] = useState(false);

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
    if (!matchToken) {
      setLoading(false);
      setError('No active match token found');
      return;
    }
    
    try {
      const response = await MatchService.getMatchScore(matchToken);
      if (response?.data) {
        setMatchData(response.data);
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
  }, [matchToken, dispatch]);

  useEffect(() => {
    if(scoreData) {
      setMatchData(scoreData);
    }
  }, [scoreData]);

  useEffect(() => {
    fetchMatchScore();
  }, [fetchMatchScore]);

  const fetchAvailableBatsmen = useCallback(async () => {
    if (!matchToken || !matchData) return;
    try {
      setModalLoading(true);
      const response = await MatchService.getAvailableBatsmen(matchToken, 1);
      if (response.data) {
        setAvailableBatsmen(response.data);
      }
    } catch (error) {
      console.error('Error fetching batsmen:', error);
    } finally {
      setModalLoading(false);
    }
  }, [matchToken, matchData]);

  const fetchBowlingTeam = useCallback(async () => {
    if (!matchToken || !matchData) return;
    try {
      setModalLoading(true);
      const response = await MatchService.getBowlingTeam(matchToken, 1);
      if (response.data) {
        setBowlingTeamPlayers(response.data);
      }
    } catch (error) {
      console.error('Error fetching bowling team:', error);
    } finally {
      setModalLoading(false);
    }
  }, [matchToken, matchData]);

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
        setIsByeRun(true);
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
      const getBallType = (): 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE' | 'NORMAL' => {
        if (pendingBallType === 'WD') return 'WIDE';
        if (pendingBallType === 'NB') return 'NO_BALL';
        if (pendingBallType === 'BYE') return 'BYE';
        if (pendingBallType === 'LB') return 'LEG_BYE';
        return 'NORMAL';
      };
      
      const payload = {
        matchId: matchToken!,
        innings_id: currentInnings?.i || 1,
        ball_type: getBallType(),
        runs,
        batsman_id: currentBatsman.id!,
        bowler_id: currentBowler.id!,
        is_wicket: false,
        is_boundary: runs === 4 || runs === 6,
        extras_enabled: extrasEnabled
      };

      await dispatch(recordBall(payload)).unwrap();
      showToast.success('Ball recorded successfully');
    } catch (error) {
      console.error('Error recording ball:', error);
      showToast.error('Failed to record ball');
    } finally {
      setScoreUpdating(false);
      setPendingBallType('');
      setBallRuns('0');
    }
  }, [currentInnings, matchToken, ballRuns, pendingBallType, extrasEnabled, dispatch]);

  const handleWicket = useCallback(async (dismissalType: string, fielder?: string, normalRun?: number, byeRuns?: number, outBatsmanId?: string, ballType?: 'NORMAL' | 'WIDE' | 'NO_BALL') => {
    try {
      const currentBatsman = currentInnings?.batting?.striker;
      const currentBowler = currentInnings?.bowling?.find((b: any) => b.id === currentInnings?.currentOver?.bowlerId);
      
      if (!currentBatsman || !currentBowler) {
        showToast.error('Please select batsman and bowler first');
        return;
      }

      const payload: any = {
        matchId: matchToken!,
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
        const scorecardResponse = await MatchService.getMatchScore(matchToken!);
        if (scorecardResponse.data) {
          setMatchData(scorecardResponse.data);
        }
        showToast.success('Wicket recorded successfully');
        fetchAvailableBatsmen();
        setShowBatsmanModal(true);
      }
    } catch (error) {
      console.error('Error recording wicket:', error);
      showToast.error('Failed to record wicket');
    }
  }, [currentInnings, matchToken, fetchAvailableBatsmen]);

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
      
      const response = await MatchService.setBatsman(matchToken!, payload);
      if (response.data?.success) {
        setShowBatsmanModal(false);
        const scorecardResponse = await MatchService.getMatchScore(matchToken!);
        if (scorecardResponse.data) {
          setMatchData(scorecardResponse.data);
        }
        showToast.success('Batsman selected successfully');
      }
    } catch (error) {
      console.error('Error selecting batsman:', error);
      showToast.error('Failed to select batsman');
    }
  }, [matchToken, currentInnings]);

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
      
      const response = await MatchService.setBowler(matchToken!, payload);
      if (response.data?.success) {
        setShowBowlerModal(false);
        const scorecardResponse = await MatchService.getMatchScore(matchToken!);
        if (scorecardResponse.data) {
          setMatchData(scorecardResponse.data);
        }
        showToast.success('Bowler selected successfully');
      }
    } catch (error) {
      console.error('Error selecting bowler:', error);
      showToast.error('Failed to select bowler');
    }
  }, [matchToken, currentInnings]);

  const handleOverComplete = useCallback(() => {
    fetchBowlingTeam();
    setShowBowlerModal(true);
  }, [fetchBowlingTeam]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
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
        </div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No match data available</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto p-2 sm:p-4 pb-20 lg:pb-4">
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isHeaderCollapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
        <div className="mb-1">
          <ActiveSessionHeader matchToken={matchToken} onCancel={() => {}} />
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
        <div className="h-8 bg-[var(--card-bg)] border-y border-[var(--card-border)] flex items-center justify-between px-3 mb-3">
          <button
            onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Show Header"
          >
            <ChevronDown size={14} />
          </button>
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Live Preview"
          >
            <Eye size={14} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
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

      <BallOutcomes 
        onBallUpdate={handleBallUpdate}
        extrasEnabled={extrasEnabled}
        onToggleExtras={toggleExtras}
      />
      
      <div className="mb-3">
        <BallHistory overs={currentInnings?.currentOver ? [{...currentInnings.currentOver, overNumber: currentInnings.currentOver.o || 1, bowler: currentInnings.bowling?.find((b: any) => b.id === currentInnings.currentOver?.bowlerId)?.n || 'Unknown'}] : []} />
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
  );
};

export default ScoreEdit;
