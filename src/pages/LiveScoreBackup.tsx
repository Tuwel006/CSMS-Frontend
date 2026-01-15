import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { MatchService } from "../services/matchService";
import type { MatchScoreResponse } from "../types/scoreService";
import { useTheme } from "../context/ThemeContext";
import { Box, Stack, Card, Table, InfoRow, GridLayout } from "../components/ui/lib";

const LiveScore: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<MatchScoreResponse | null>(null);
  const [expandedInning, setExpandedInning] = useState<number | null>(null);
  const isInitialLoad = useRef(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (!id) return;
    
    const fetchScore = async () => {
      try {
        const response = await MatchService.getMatchScore(id);
        if (response.data) {
          setData(response.data);
          if (isInitialLoad.current) {
            setExpandedInning(response.data.innings.length - 1);
            isInitialLoad.current = false;
          }
        }
      } catch {
        // Handle error silently
      }
    };

    fetchScore();
    const interval = setInterval(fetchScore, 30000);
    return () => clearInterval(interval);
  }, [id]);

  const currentInning = expandedInning !== null && data ? data.innings[expandedInning] : data?.innings[0];

  const allBatsmen = useMemo(() => {
    if (!currentInning) return [];
    const batsmen = [];
    if (currentInning.batting.striker) batsmen.push({ ...currentInning.batting.striker, isStriker: true });
    if (currentInning.batting.nonStriker) batsmen.push({ ...currentInning.batting.nonStriker, isStriker: false });
    if (currentInning.dismissed) batsmen.push(...currentInning.dismissed.map((b: any) => ({ ...b, isStriker: false })));
    return batsmen.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [currentInning]);

  const getDismissalText = (batsman: any) => {
    if (!batsman.w) return batsman.status || (batsman.isStriker !== undefined && batsman.b > 0 ? "batting" : "");
    
    const { wicket_type, by, bowler } = batsman.w;
    let text = "";
    
    if (wicket_type === "Caught") {
      text = "c";
      if (by) text += ` ${by}`;
      if (bowler) text += ` b ${bowler}`;
    } else if (wicket_type === "Bowled") {
      text = bowler ? `b ${bowler}` : "bowled";
    } else if (wicket_type === "Run Out") {
      text = "run out";
      if (by) text += ` (${by})`;
    } else if (wicket_type === "Stumped") {
      text = "st";
      if (by) text += ` ${by}`;
      if (bowler) text += ` b ${bowler}`;
    } else if (wicket_type === "LBW") {
      text = "lbw";
      if (bowler) text += ` b ${bowler}`;
    } else if (wicket_type === "Hit Wicket") {
      text = "hit wicket";
      if (bowler) text += ` b ${bowler}`;
    } else {
      text = wicket_type.toLowerCase();
    }
    
    return text;
  };

  const batsmenColumns = [
    {
      key: 'name',
      label: '',
      align: 'left' as const,
      render: (_: any, row: any) => (
        <Box>
          <Stack direction="row" align="center" gap="xs">
            <span className={`font-medium text-xs sm:text-sm ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
              {row.n}
            </span>
            {row.isStriker && <span className="text-yellow-500 text-sm">★</span>}
          </Stack>
          <Box className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {getDismissalText(row)}
          </Box>
        </Box>
      )
    },
    { key: 'r', label: 'R', align: 'center' as const, render: (v: any) => <span className="font-bold">{v}</span> },
    { key: 'b', label: 'B', align: 'center' as const },
    { key: '4s', label: '4s', align: 'center' as const, render: (v: any) => <span className="text-orange-600 dark:text-orange-400 font-medium">{v || 0}</span> },
    { key: '6s', label: '6s', align: 'center' as const, render: (v: any) => <span className="text-orange-600 dark:text-orange-400 font-medium">{v || 0}</span> },
    { key: 'sr', label: 'SR', align: 'center' as const, render: (v: any) => v || "0.00" },
    { key: 'action', label: '', width: 'w-6 sm:w-8', render: () => <span className="text-gray-400 dark:text-gray-500">›</span> }
  ];

  const bowlerColumns = [
    { key: 'n', label: '', align: 'left' as const, render: (v: any) => <span className="font-medium text-cyan-600 dark:text-cyan-400">{v}</span> },
    { key: 'o', label: 'O', align: 'center' as const },
    { key: 'm', label: 'M', align: 'center' as const, render: (v: any) => v || 0 },
    { key: 'r', label: 'R', align: 'center' as const },
    { key: 'w', label: 'W', align: 'center' as const, render: (v: any) => <span className="font-bold">{v}</span> },
    { key: '4s', label: '4s', align: 'center' as const, render: (v: any) => <span className="text-orange-600 dark:text-orange-400 font-medium">{v || 0}</span> },
    { key: '6s', label: '6s', align: 'center' as const, render: (v: any) => <span className="text-orange-600 dark:text-orange-400 font-medium">{v || 0}</span> },
    { key: 'extras', label: 'Ex', align: 'center' as const, render: (v: any) => v || 0 },
    { key: 'eco', label: 'Eco', align: 'center' as const },
    { key: 'action', label: '', width: 'w-6 sm:w-8', render: () => <span className="text-gray-400 dark:text-gray-500">›</span> }
  ];

  if (!data) return (
    <Stack justify="center" align="center" className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </Stack>
  );

  return (
    <Box className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} py-1 sm:py-2`}>
      <Box className="max-w-6xl mx-auto px-1 sm:px-2">
        {/* Teams Score Cards - Sticky */}
        <Box className="lg:sticky lg:top-0 lg:z-10 lg:bg-gray-900">
          {data.innings.map((inn, idx) => (
            <Box key={idx} className="mb-0.5 sm:mb-1">
              <Card
                variant={expandedInning === idx ? 'primary' : 'default'}
                onClick={() => setExpandedInning(expandedInning === idx ? null : idx)}
                className="transition-colors hover:opacity-90"
                bodyClassName="px-2 sm:px-3 py-1 sm:py-1.5"
              >
                <Stack direction="row" justify="between" align="center">
                  <span className="font-bold text-xs sm:text-sm">{inn.battingTeam}</span>
                  <Stack direction="row" align="center" gap="xs">
                    <span className="font-bold text-base sm:text-lg">{inn.score.r}-{inn.score.w}</span>
                    <span className="text-xs opacity-80">({inn.score.o} Ov)</span>
                    <span className="text-xs">{expandedInning === idx ? '▲' : '▼'}</span>
                  </Stack>
                </Stack>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Scorecard Details */}
        {expandedInning !== null && (
          <Card className="mt-1.5 sm:mt-2" bodyClassName="p-1.5 sm:p-2">
            {/* Batting */}
            <Box className="mb-2">
              <Box className="bg-gray-100 dark:bg-gray-750 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-200">
                Batter
              </Box>
              <Table columns={batsmenColumns} data={allBatsmen} size="xs" />
              
              {/* Extras & Total */}
              <Box className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 px-4 py-2 text-xs text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Extras</span>
                <span className="ml-2">{currentInning?.extras || "0 (b 0, lb 0, w 0, nb 0, p 0)"}</span>
              </Box>
              
              <Box className="border-t border-gray-200 dark:border-gray-700 bg-cyan-50 dark:bg-cyan-900 px-4 py-2 text-xs font-bold text-cyan-900 dark:text-cyan-200">
                <span>Total</span>
                <span className="ml-4">{currentInning?.score.r}-{currentInning?.score.w} ({currentInning?.score.o} Overs, RR: {currentInning?.runRate || "0.00"})</span>
              </Box>

              {currentInning?.didNotBat && currentInning.didNotBat.length > 0 && (
                <Box className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Did not Bat</span>
                  <span className="text-xs ml-2 text-cyan-600 dark:text-cyan-400">
                    {currentInning.didNotBat.join(", ")}
                  </span>
                </Box>
              )}
            </Box>

            {/* Bowling */}
            <Box>
              <Box className="bg-gray-100 dark:bg-gray-750 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
                Bowler
              </Box>
              <Table columns={bowlerColumns} data={currentInning?.bowling || []} size="xs" />
            </Box>

            {/* Current Over */}
            {currentInning?.currentOver?.balls && currentInning.currentOver.balls.length > 0 && (
              <Box className="mt-3">
                <Box className="bg-gray-100 dark:bg-gray-750 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
                  Current Over
                </Box>
                <Box className="p-3 sm:p-4 bg-gray-800 dark:bg-gray-800">
                  <Stack direction="row" gap="sm" wrap>
                    {currentInning!.currentOver.balls.map((ball: any, idx: number) => {
                      const getBallColor = () => {
                        if (ball.t === "WIDE" || ball.t === "NO_BALL") return "bg-red-600 dark:bg-red-600";
                        if (ball.r === 6) return "bg-purple-600 dark:bg-purple-600";
                        if (ball.r === 4) return "bg-green-600 dark:bg-green-600";
                        if (ball.r === 0) return "bg-gray-700 dark:bg-gray-700";
                        return "bg-cyan-700 dark:bg-cyan-700";
                      };
                      
                      return (
                        <Box key={idx} className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm text-white ${getBallColor()}`}>
                          {ball.t === "WIDE" ? "WD" : ball.t === "NO_BALL" ? "NB" : ball.r}
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              </Box>
            )}
          </Card>
        )}

        {/* Match Information */}
        <Card title="Match Information" className="mt-1.5 sm:mt-2" bodyClassName="p-2 sm:p-3">
          <GridLayout cols={2} gap="xs" className="text-[10px] sm:text-xs">
            <InfoRow label="Format" value={data.meta.format} />
            <InfoRow label="Status" value={<span className="capitalize">{data.meta.status}</span>} />
            <InfoRow label="Match ID" value={<span className="truncate">{data.meta.matchId}</span>} />
            <InfoRow label="Last Updated" value={new Date(data.meta.lastUpdated).toLocaleTimeString()} />
          </GridLayout>
          
          <Box className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Box className="text-gray-500 dark:text-gray-400 mb-2 text-xs">Teams</Box>
            <Stack direction="row" gap="sm" className="flex-col sm:flex-row">
              <Box className="flex-1 p-2 bg-gray-50 dark:bg-gray-750 flex items-center gap-2 rounded-xs">
                <Box className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xs rounded-xs">
                  {data.teams.A.short}
                </Box>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-200">{data.teams.A.name}</span>
              </Box>
              <Box className="flex-1 p-2 bg-gray-50 dark:bg-gray-750 flex items-center gap-2 rounded-xs">
                <Box className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xs rounded-xs">
                  {data.teams.B.short}
                </Box>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-200">{data.teams.B.name}</span>
              </Box>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default LiveScore;
