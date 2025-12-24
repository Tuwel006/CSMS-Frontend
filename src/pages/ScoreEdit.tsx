import React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import BallHistory from '../components/ui/BallHistory';
import LivePreview from '../components/ui/LivePreview';
import ActiveSessionHeader from '../components/ActiveSessionHeader';
import PlayerSelectionModal from '../components/ui/PlayerSelectionModal';
import WicketModal from '../components/ui/WicketModal';
import { Eye, Star, ChevronDown } from 'lucide-react';
import { MatchService } from '../services/matchService';
import { showToast } from '../utils/toast';
import { MatchScoreResponse } from '../types/scoreService';

const MatchHeader = React.memo(({ teams, meta }: any) => {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md p-2 mb-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-blue-950 dark:via-blue-900 dark:to-indigo-950 border-2 border-blue-300 dark:border-blue-700 rounded-lg px-3 py-2.5 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-0.5 tracking-wide">TEAM A</div>
            <h2 className="text-sm sm:text-base font-black text-blue-900 dark:text-blue-50 truncate">{teams?.A?.short || teams?.A?.name}</h2>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 px-2">
          <div className="text-lg sm:text-xl font-black text-gray-400 dark:text-gray-600">VS</div>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500 dark:bg-red-500 text-white dark:text-white text-[10px] font-bold rounded-full animate-pulse">
            <div className="w-1.5 h-1.5 bg-white dark:bg-white rounded-full"></div>
            {meta?.status || 'LIVE'}
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100 dark:from-emerald-950 dark:via-green-900 dark:to-teal-950 border-2 border-emerald-300 dark:border-emerald-700 rounded-lg px-3 py-2.5 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 mb-0.5 tracking-wide">TEAM B</div>
            <h2 className="text-sm sm:text-base font-black text-emerald-900 dark:text-emerald-50 truncate">{teams?.B?.short || teams?.B?.name}</h2>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-1.5 pt-1.5 border-t border-[var(--card-border)]">
        <div className="text-[10px] text-[var(--text-secondary)]">
          <span>{meta?.format} Overs Match</span>
        </div>
      </div>
    </div>
  );
});

const CurrentScoreCard = React.memo(({ currentInnings, teams, onSelectBatsman, onSelectBowler, loading, scoreUpdating, availableBatsmen, modalLoading, fetchAvailableBatsmen }: any) => {
  const [showBatsmanDropdown, setShowBatsmanDropdown] = useState(false);
  
  const score = currentInnings?.score || { r: 0, w: 0, o: '0.0' };
  const batting = currentInnings?.batting || [];
  const battingTeam = teams?.[currentInnings?.battingTeam];
  const bowlingTeam = teams?.[currentInnings?.bowlingTeam];
  
  const striker = batting.striker;
  const nonStriker = batting.nonStriker;
  
  const handleBatsmanClick = useCallback(() => {
    fetchAvailableBatsmen();
    setShowBatsmanDropdown(false); // Close dropdown
    // Use parent's modal instead
    onSelectBatsman('OPEN_MODAL');
  }, [fetchAvailableBatsmen, onSelectBatsman]);
  
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-[var(--text)]">Current Score</h3>
        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded font-medium">
          {currentInnings?.battingTeam ? 
            (teams?.[currentInnings.battingTeam]?.short || teams?.[currentInnings.battingTeam]?.name || currentInnings.battingTeam) 
            : 'Team'} Batting
        </span>
      </div>
      <div className="text-center py-2 relative">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-lg font-medium text-[var(--text)] mb-1">
              {currentInnings?.battingTeam ? 
                (teams?.[currentInnings.battingTeam]?.short || teams?.[currentInnings.battingTeam]?.name || currentInnings.battingTeam) 
                : 'Team'}
            </div>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
              {score.r}/{score.w}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              Overs: {score.o}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              {battingTeam?.name} vs {bowlingTeam?.name}
            </div>
            {scoreUpdating && (
              <div className="absolute top-2 right-2 flex space-x-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="mt-2 space-y-1.5">
        <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">BATTING NOW</p>
        
        {striker ? (
          <div className="bg-green-50 dark:bg-green-900/20 rounded p-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Star size={12} className="text-green-600 dark:text-green-400 fill-current" />
                <span className="text-xs font-bold text-[var(--text)]">{striker.n}</span>
              </div>
              <span className="text-xs font-bold text-[var(--text)]">
                {striker.r}({striker.b}) SR: {striker.b > 0 ? ((striker.r / striker.b) * 100).toFixed(1) : '0.0'}
              </span>
            </div>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={handleBatsmanClick}
              className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border-2 border-dashed border-green-400 dark:border-green-600 rounded p-1.5 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <span className="text-xs font-medium text-green-600 dark:text-green-400">Select Striker</span>
              <ChevronDown size={12} className="text-green-600 dark:text-green-400" />
            </button>
          </div>
        )}
        
        {nonStriker ? (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text)]">{nonStriker.n}</span>
              <span className="text-xs font-bold text-[var(--text)]">
                {nonStriker.r}({nonStriker.b}) SR: {nonStriker.b > 0 ? ((nonStriker.r / nonStriker.b) * 100).toFixed(1) : '0.0'}
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={handleBatsmanClick}
            className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded p-1.5 hover:bg-gray-50 dark:hover:bg-gray-900/20"
          >
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Select Non-Striker</span>
            <ChevronDown size={12} className="text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
});

const RecentOversCard = React.memo(({ currentInnings, teams, onSelectBowler, bowlingTeamPlayers, modalLoading, fetchBowlingTeam, onOverComplete }: any) => {
  const [showBowlerDropdown, setShowBowlerDropdown] = useState(false);
  
  const currentOver = currentInnings?.currentOver;
  const bowling = currentInnings?.bowling || [];
  const currentBowler = bowling.find((b: any) => b.id === currentOver?.bowlerId);
  const bowlingTeam = teams?.[currentInnings?.bowlingTeam];
  const isOverComplete = currentOver?.balls?.length === 6;
  const bowlersWithOvers = bowling.filter((b: any) => parseFloat(b.o) > 0);
  
  const handleBowlerClick = useCallback(() => {
    fetchBowlingTeam();
    setShowBowlerDropdown(false);
    onSelectBowler('OPEN_MODAL');
  }, [fetchBowlingTeam, onSelectBowler]);
  
  const getBallColor = (ball: string) => {
    const colors: any = { '0': 'bg-gray-500', '1': 'bg-green-500', '2': 'bg-green-600', '3': 'bg-green-700', '4': 'bg-blue-500', '6': 'bg-yellow-500', 'W': 'bg-red-500', 'WD': 'bg-pink-500', 'NB': 'bg-purple-500' };
    return colors[ball] || 'bg-gray-400';
  };
  
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-[var(--text)]">Recent Overs</h3>
        <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded font-medium">
          {currentInnings?.bowlingTeam ? 
            (teams?.[currentInnings.bowlingTeam]?.short || teams?.[currentInnings.bowlingTeam]?.name || currentInnings.bowlingTeam) 
            : 'Team'} Bowling
        </span>
      </div>
      
      <div className="mb-2 relative">
        {currentBowler && !isOverComplete ? (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-0.5">BOWLING NOW</p>
                <p className="font-bold text-xs text-[var(--text)]">{currentBowler.n}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[var(--text)]">{currentBowler.o}-{currentBowler.m || 0}-{currentBowler.r}-{currentBowler.w}</p>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">ER: {currentBowler.eco}</p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={handleBowlerClick}
            className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border-2 border-dashed border-orange-400 dark:border-orange-600 rounded p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <div>
              <p className="text-[10px] text-orange-600 dark:text-orange-400">{isOverComplete ? 'Over Complete' : 'Select Bowler'}</p>
              <p className="font-bold text-xs text-orange-600 dark:text-orange-400">{isOverComplete ? 'Choose next bowler' : `Choose from ${bowlingTeam?.name}`}</p>
            </div>
            <ChevronDown size={14} className="text-orange-600 dark:text-orange-400" />
          </button>
        )}
      </div>
      
      {/* Bowlers List */}
      {bowlersWithOvers.length > 0 && (
        <div className="mb-2">
          <p className="text-[10px] text-[var(--text-secondary)] mb-1">BOWLERS</p>
          <div className="space-y-1 max-h-[4.5rem] overflow-y-auto">
            {bowlersWithOvers.map((bowler: any) => (
              <div key={bowler.id} className="bg-gray-50 dark:bg-gray-800 rounded p-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--text)] truncate">{bowler.n}</span>
                <span className="text-xs text-[var(--text-secondary)]">{bowler.o}-{bowler.m || 0}-{bowler.r}-{bowler.w}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] text-[var(--text-secondary)]">Current Over {currentOver?.o || 1}</p>
          {isOverComplete && (
            <button
              onClick={onOverComplete}
              className="text-[10px] px-2 py-0.5 bg-green-500 text-white rounded font-medium hover:bg-green-600"
            >
              Complete Over
            </button>
          )}
        </div>
        <div className="flex gap-1.5">
          {(currentOver?.balls || []).map((ball: any, i: number) => (
            <div key={i} className={`${getBallColor(ball.r)} text-white w-7 h-7 rounded flex items-center justify-center text-xs font-bold`}>
              {ball.t === 'WICKET' ? 'W' : ball.t === 'WIDE' ? 'Wd' : ball.t === 'NO_BALL' ? 'Nb' : ball.r}
            </div>
          ))}
          {Array.from({ length: 6 - (currentOver?.balls?.length || 0) }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-200 dark:bg-gray-700 w-7 h-7 rounded flex items-center justify-center text-xs">
              •
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const ScoreEdit = () => {
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
  
  // Modal states
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
    if (!matchToken) {
      setLoading(false);
      setError('No active match token found');
      return;
    }
    
    try {
      const response = await MatchService.getMatchScore(matchToken);
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
  }, [matchToken]);

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

  const updateScoreData = useCallback((newScoreData: any) => {
    setMatchData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        innings: prev.innings.map((inning, index) => 
          index === 0 ? { ...inning, ...newScoreData } : inning
        )
      };
    });
  }, []);

  const currentInnings = useMemo(() => matchData?.innings?.[matchData?.innings?.length ? matchData.innings.length - 1 : 0], [matchData]);

  const handleBallUpdate = useCallback(async (ballType: string) => {
    if (ballType === 'W') {
      setShowWicketModal(true);
    } else {
      // Show confirmation modal
      setPendingBallType(ballType);
      setBallRuns(['1', '2', '3', '4', '5', '6'].includes(ballType) ? ballType : '0');
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
        ball_type: pendingBallType === 'WD' ? 'WIDE' : pendingBallType === 'NB' ? 'NO_BALL' : pendingBallType === 'BYE' ? 'BYE' : pendingBallType === 'LB' ? 'LEG_BYE' : 'NORMAL',
        runs,
        batsman_id: currentBatsman.id,
        bowler_id: currentBowler.id,
        is_wicket: false,
        is_boundary: runs === 4 || runs === 6,
        extras_enabled: extrasEnabled
      };

      const response = await MatchService.recordBall(matchToken!, payload);
      if (response.data?.success) {
        const scorecardResponse = await MatchService.getMatchScore(matchToken!);
        if (scorecardResponse.data) {
          setMatchData(scorecardResponse.data);
        }
        showToast.success('Ball recorded successfully');
      }
    } catch (error) {
      console.error('Error recording ball:', error);
      showToast.error('Failed to record ball');
    } finally {
      setScoreUpdating(false);
      setPendingBallType('');
      setBallRuns('0');
    }
  }, [currentInnings, matchToken, ballRuns, pendingBallType, extrasEnabled]);

  const handleWicket = useCallback(async (dismissalType: string, fielder?: string) => {
    try {
      const currentBatsman = currentInnings?.batting?.striker;
      const currentBowler = currentInnings?.bowling?.find((b: any) => b.id === currentInnings?.currentOver?.bowlerId);
      
      if (!currentBatsman || !currentBowler) {
        showToast.error('Please select batsman and bowler first');
        return;
      }

      const payload = {
        ball_type: 'NORMAL',
        runs: 0,
        batsman_id: currentBatsman.id,
        bowler_id: currentBowler.id,
        is_wicket: true,
        wicket_type: dismissalType,
        fielder_id: fielder ? parseInt(fielder) : undefined,
        is_boundary: false,
        extras_enabled: extrasEnabled
      };

      const response = await MatchService.recordBall(matchToken!, payload);
      if (response.data?.success) {
        setShowWicketModal(false);
        // Refresh scorecard
        const scorecardResponse = await MatchService.getMatchScore(matchToken!);
        if (scorecardResponse.data) {
          setMatchData(scorecardResponse.data);
        }
        showToast.success('Wicket recorded successfully');
        // Show batsman selection modal
        fetchAvailableBatsmen();
        setShowBatsmanModal(true);
      }
    } catch (error) {
      console.error('Error recording wicket:', error);
      showToast.error('Failed to record wicket');
    }
  }, [currentInnings, matchToken, fetchAvailableBatsmen, extrasEnabled]);

  const handleSelectBatsman = useCallback(async (player: any) => {
    if (player === 'OPEN_MODAL') {
      setShowBatsmanModal(true);
      return;
    }
    
    try {
      const payload = {
        innings_id: 1,
        player_id: player.id,
        is_striker: true,
        ret_hurt: false
      };
      
      const response = await MatchService.setBatsman(matchToken!, payload);
      if (response.data?.success) {
        setShowBatsmanModal(false);
        // Refresh scorecard
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
  }, [matchToken]);

  const handleSelectBowler = useCallback(async (player: any) => {
    if (player === 'OPEN_MODAL') {
      setShowBowlerModal(true);
      return;
    }
    
    try {
      const payload = {
        innings_id: 1,
        player_id: player.id
      };
      
      const response = await MatchService.setBowler(matchToken!, payload);
      if (response.data?.success) {
        setShowBowlerModal(false);
        // Refresh scorecard
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
  }, [matchToken]);

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
          <button 
            onClick={() => {
              const token = localStorage.getItem('activeMatchToken');
              if (token) fetchMatchScore();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
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
    <div className="h-[calc(100vh-4rem)] overflow-y-auto p-2 sm:p-4">
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isHeaderCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'}`}>
        <div className="mb-2">
          <ActiveSessionHeader matchToken={matchToken} onCancel={() => {}} />
        </div>
        
        <MatchHeader 
          teams={matchData.teams}
          meta={matchData.meta}
        />
      </div>

      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
          className="text-xs text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
        >
          {isHeaderCollapsed ? '▼ Show Header' : '▲ Hide Header'}
        </button>
        <button 
          onClick={() => setIsPreviewOpen(true)}
          className="flex items-center gap-2 text-sm bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-1.5 rounded-lg text-[var(--text)] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <Eye size={16} />
          Live Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <CurrentScoreCard 
          currentInnings={currentInnings}
          teams={matchData.teams}
          onSelectBatsman={handleSelectBatsman}
          onSelectBowler={handleSelectBowler}
          loading={loading}
          scoreUpdating={scoreUpdating}
          availableBatsmen={availableBatsmen}
          modalLoading={modalLoading}
          fetchAvailableBatsmen={fetchAvailableBatsmen}
        />
        <RecentOversCard 
          currentInnings={currentInnings}
          teams={matchData.teams}
          onSelectBowler={handleSelectBowler}
          bowlingTeamPlayers={bowlingTeamPlayers}
          modalLoading={modalLoading}
          fetchBowlingTeam={fetchBowlingTeam}
          onOverComplete={handleOverComplete}
        />
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-[var(--text)]">Ball Outcomes</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--text-secondary)]">Extra Runs</span>
            <button
              onClick={toggleExtras}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                extrasEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  extrasEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 mb-3">
          {['0', '1', '2', '3', '4', '5', '6'].map((ball) => (
            <button
              key={ball}
              onClick={() => handleBallUpdate(ball)}
              className="h-9 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-800 dark:text-gray-200 font-bold text-sm transition-all"
            >
              {ball}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
          {['WD', 'NB', 'BYE', 'LB'].map((ball) => (
            <button
              key={ball}
              onClick={() => handleBallUpdate(ball)}
              className="h-9 rounded border-2 border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20 hover:border-orange-500 dark:hover:border-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-orange-800 dark:text-orange-200 font-bold text-xs transition-all"
            >
              {ball}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => handleBallUpdate('W')}
          className="w-full h-10 rounded border-2 border-red-500 bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all"
        >
          WICKET
        </button>
      </div>
      
      <div className="mb-3">
        <BallHistory overs={currentInnings?.currentOver ? [{...currentInnings.currentOver, overNumber: currentInnings.currentOver.o || 1, bowler: currentInnings.bowling?.find((b: any) => b.id === currentInnings.currentOver?.bowlerId)?.n || 'Unknown'}] : []} />
      </div>
      
      <LivePreview 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        matchData={matchData}
      />
      
      {/* Player Selection Modals */}
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
      />
      
      {/* Ball Confirmation Modal */}
      {showBallConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Ball Outcome</h2>
            
            <div className="mb-4">
              <div className="bg-blue-500 text-white rounded-xl p-4 text-center">
                <div className="text-3xl font-bold mb-1">{pendingBallType}</div>
                <div className="text-sm">
                  {pendingBallType === 'WD' ? 'Wide' : 
                   pendingBallType === 'NB' ? 'No Ball' : 
                   pendingBallType === 'BYE' ? 'Bye' : 
                   pendingBallType === 'LB' ? 'Leg Bye' : 
                   `${pendingBallType} Run${pendingBallType !== '1' ? 's' : ''}`}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Runs</label>
              <input
                type="number"
                min="0"
                max="6"
                value={ballRuns}
                onChange={(e) => setBallRuns(e.target.value)}
                placeholder="Enter runs (0-6)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {['WD', 'NB'].includes(pendingBallType) 
                  ? "Additional runs by batsman or bye/leg bye"
                  : ['BYE', 'LB'].includes(pendingBallType)
                  ? `Runs scored as ${pendingBallType === 'BYE' ? 'bye' : 'leg bye'}`
                  : "Runs scored by batsman"}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                onClick={() => {
                  setShowBallConfirmModal(false);
                  setPendingBallType('');
                  setBallRuns('0');
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
                onClick={handleConfirmBall}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extras Warning Modal */}
      {showExtrasWarning && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold">Change Extra Runs Setting?</h2>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {pendingExtrasValue 
                ? "Enabling extra runs will add 1 run to the team score for Wide and No Ball deliveries (standard cricket rules)."
                : "Disabling extra runs means Wide and No Ball will NOT add extra runs to the team score (gully cricket rules). Only runs scored by batsman will count."}
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                onClick={() => setShowExtrasWarning(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                onClick={confirmExtrasChange}
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreEdit;
