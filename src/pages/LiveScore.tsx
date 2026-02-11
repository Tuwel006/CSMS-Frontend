import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { MatchService } from "../services/matchService";
import { ErrorDisplay } from "../components/ui/loading";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setMatchScore, clearLiveScore } from "../store/liveScore/liveScoreSlice";
import { subscribeLiveScore, unsubscribeLiveScore } from "../store/liveScore/liveScoreThunks";
import { Container, Box, Stack, Text } from "../components/ui/lib";
import { useTheme } from "../context/ThemeContext";

// Modular Components
import { InningsHeader } from "../components/specific/LiveScore/InningsHeader";
import { InningsDetails } from "../components/specific/LiveScore/InningsDetails";
import { MatchInfo } from "../components/specific/LiveScore/MatchInfo";
import ScoreCardSkeleton from "../components/ui/ScoreCardSkeleton";
import TableSkeleton from "../components/ui/TableSkeleton";

const LiveScore: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Get data from Redux liveScore state
  const reduxData = useAppSelector((state) => state.liveScore.data);
  const isConnected = useAppSelector((state) => state.liveScore.isConnected);
  const reduxError = useAppSelector((state) => state.liveScore.error);

  // DEBUG LOGS
  console.log("Current Redux Data:", reduxData);
  console.log("SSE Connection Status:", isConnected);

  // UI state
  const [expandedInning, setExpandedInning] = useState<number | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const isInitialLoadRef = useRef(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Effect to handle initial expand based on reduxData
  useEffect(() => {
    if (reduxData?.innings && isInitialLoadRef.current) {
      setExpandedInning(reduxData.innings.length - 1);
      isInitialLoadRef.current = false;
    }
  }, [reduxData]);

  // Main effect for data fetching and SSE subscription
  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const initializeScore = async () => {
      try {
        // If we don't have data, show the loader
        if (!reduxData) {
          setIsInitialLoading(true);
        }

        // 1. Initial fetch to get the match data
        const response = await MatchService.getMatchScore(id);
        if (mounted) {
          if (response.data) {
            dispatch(setMatchScore(response.data));
          }
          setIsInitialLoading(false);
        }

        // 2. Subscribe to SSE for live updates
        await dispatch(subscribeLiveScore({ matchId: id }));

      } catch (err) {
        console.error("Failed to initialize score:", err);
        if (mounted) {
          setIsInitialLoading(false);
        }
      }
    };

    initializeScore();

    // Cleanup function
    return () => {
      mounted = false;
      unsubscribeLiveScore();
      dispatch(clearLiveScore());
    };
  }, [id, dispatch]);

  // Derived state
  const currentInning = useMemo(() => {
    if (!reduxData?.innings) return null;
    return expandedInning !== null ? reduxData.innings[expandedInning] : reduxData.innings[reduxData.innings.length - 1];
  }, [reduxData, expandedInning]);

  const allBatsmen = useMemo(() => {
    if (!currentInning) return [];
    const batsmen = [];
    if (currentInning.batting.striker) batsmen.push({ ...currentInning.batting.striker, isStriker: true });
    if (currentInning.batting.nonStriker) batsmen.push({ ...currentInning.batting.nonStriker, isStriker: false });
    if (currentInning.dismissed) {
      batsmen.push(...currentInning.dismissed.map((b: any) => ({ ...b, isStriker: false })));
    }
    return batsmen.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [currentInning]);
  if (isInitialLoading && !reduxData) return (
    <Box className={`min-h-screen ${isDark ? "dark:bg-gray-900 bg-gray-900" : "bg-gray-50"} py-4`}>
      <Container className="px-2 sm:px-3">
        <Stack gap="md">
          <ScoreCardSkeleton />
          <ScoreCardSkeleton />
          <Box className="mt-4">
            <TableSkeleton rows={8} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );

  if (reduxError && !reduxData) return (
    <Box className={`min-h-screen ${isDark ? "dark:bg-gray-900 bg-gray-900" : "bg-gray-50"} py-4`}>
      <Container>
        <ErrorDisplay
          message={reduxError || "No match data available"}
          onRetry={() => window.location.reload()}
        />
      </Container>
    </Box>
  );

  return (
    <Box className={`min-h-screen ${isDark ? "dark:bg-gray-900 bg-gray-900" : "bg-gray-50"} py-2 sm:py-4`}>
      <Container className="px-2 sm:px-3">
        {/* Header with Live Indicator */}
        <Stack direction="row" align="center" justify="between" className="mb-4">
          <Text weight="bold" size="lg" className={isDark ? "text-white" : "text-gray-900"}>
            Live Scorecard
          </Text>
          <Stack direction="row" align="center" gap="xs">
            {isConnected ? (
              <Stack direction="row" align="center" gap="xs" className="bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <Text size="xs" weight="bold" className="text-red-500 uppercase tracking-wider text-[10px]">Live</Text>
              </Stack>
            ) : (
              <Stack direction="row" align="center" gap="xs" className="bg-gray-500/10 px-2 py-0.5 rounded-full border border-gray-500/20">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <Text size="xs" weight="medium" className="text-gray-400 uppercase tracking-wider text-[10px]">Offline</Text>
              </Stack>
            )}
          </Stack>
        </Stack>

        {/* Teams Score Cards */}
        {reduxData?.innings.map((inn, idx) => (
          <React.Fragment key={idx}>
            <InningsHeader
              inn={inn}
              idx={idx}
              expandedInning={expandedInning}
              setExpandedInning={setExpandedInning}
            />
            {/* Scorecard Details - Only show if expanded */}
            {expandedInning === idx && (
              <InningsDetails inn={inn} allBatsmen={allBatsmen} />
            )}
          </React.Fragment>
        ))}

        {/* Match Information Card */}
        {reduxData && <MatchInfo data={reduxData} />}
      </Container>
    </Box>
  );
};

export default LiveScore;
