import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { MatchService } from "../services/matchService";
import type { MatchScoreResponse } from "../types/scoreService";
import { useTheme } from "../context/ThemeContext";
import { PageLoader, ErrorDisplay } from "../components/ui/loading";

const LiveScore: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<MatchScoreResponse | null>(null);
  const [expandedInning, setExpandedInning] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (!id) return;
    
    const fetchScore = async () => {
      try {
        setError(null);
        const response = await MatchService.getMatchScore(id);
        if (response.data) {
          setData(response.data);
          if (isInitialLoad.current) {
            setExpandedInning(response.data.innings.length - 1);
            isInitialLoad.current = false;
          }
        }
      } catch (err) {
        setError('Failed to load match data');
      } finally {
        setLoading(false);
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

  if (loading) return <PageLoader />;
  if (error || !data) return (
    <div className={`min-h-screen ${isDark ? "dark:bg-gray-900 bg-gray-900" : "bg-gray-50"} py-4`}>
      <div className="max-w-6xl mx-auto px-3">
        <ErrorDisplay message={error || "No match data available"} onRetry={() => { setLoading(true); setError(null); }} />
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDark ? "dark:bg-gray-900 bg-gray-900" : "bg-gray-50"} py-2 sm:py-4`}>
      <div className="max-w-6xl mx-auto px-2 sm:px-3">
        {/* Teams Score Cards */}
        {data.innings.map((inn, idx) => (
          <div key={idx} className="mb-1">
            <div 
              onClick={() => setExpandedInning(expandedInning === idx ? null : idx)}
              className={`flex items-center justify-between px-3 sm:px-4 py-2 cursor-pointer transition-colors rounded-sm ${
                expandedInning === idx 
                  ? (isDark ? "bg-cyan-700" : "bg-cyan-600") + " text-white"
                  : (isDark ? "bg-gray-800 text-gray-200 hover:bg-gray-750" : "bg-white text-gray-900 hover:bg-gray-50 shadow-sm")
              }`}
            >
              <div className="font-bold text-xs sm:text-sm">{inn.battingTeam}</div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-base sm:text-lg">{inn.score.r}-{inn.score.w}</span>
                <span className="text-xs opacity-80">({inn.score.o} Ov)</span>
                <span className="text-xs">{expandedInning === idx ? '▲' : '▼'}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Scorecard Details - Only show if expanded */}
        {expandedInning !== null && (
          <div className={`mt-2 sm:mt-3 ${isDark ? "bg-gray-800" : "bg-white shadow-sm"} p-2 sm:p-3 border ${isDark ? "border-gray-700" : "border-gray-200"} rounded-sm`}>
            {/* Batting Section */}
            <div className="mb-3">
              <div className={`${isDark ? "bg-gray-750" : "bg-gray-100"} px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Batter
              </div>
          
          <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`${isDark ? "bg-gray-750 text-gray-300" : "bg-gray-50 text-gray-600"} border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <th className="text-left px-2 sm:px-4 py-1.5 sm:py-2 font-semibold"></th>
                <th className="text-center px-1 sm:px-2 py-1.5 sm:py-2 font-semibold">R</th>
                <th className="text-center px-1 sm:px-2 py-1.5 sm:py-2 font-semibold">B</th>
                <th className="text-center px-1 sm:px-2 py-1.5 sm:py-2 font-semibold">4s</th>
                <th className="text-center px-1 sm:px-2 py-1.5 sm:py-2 font-semibold">6s</th>
                <th className="text-center px-1 sm:px-2 py-1.5 sm:py-2 font-semibold">SR</th>
                <th className="w-6 sm:w-8"></th>
              </tr>
            </thead>
            <tbody>
              {allBatsmen.map((batsman, idx) => {
                const getDismissalText = () => {
                  if (!batsman.w) return batsman.status || (batsman.isStriker !== undefined && batsman.b > 0 ? "batting" : "");
                  
                  const wicketType = batsman.w.wicket_type;
                  const by = batsman.w.by;
                  const bowler = batsman.w.bowler;
                  
                  let text = "";
                  
                  if (wicketType === "Caught") {
                    text = "c";
                    if (by) text += ` ${by}`;
                    if (bowler) text += ` b ${bowler}`;
                  } else if (wicketType === "Bowled") {
                    text = bowler ? `b ${bowler}` : "bowled";
                  } else if (wicketType === "Run Out") {
                    text = "run out";
                    if (by) text += ` (${by})`;
                  } else if (wicketType === "Stumped") {
                    text = "st";
                    if (by) text += ` ${by}`;
                    if (bowler) text += ` b ${bowler}`;
                  } else if (wicketType === "LBW") {
                    text = "lbw";
                    if (bowler) text += ` b ${bowler}`;
                  } else if (wicketType === "Hit Wicket") {
                    text = "hit wicket";
                    if (bowler) text += ` b ${bowler}`;
                  } else {
                    text = wicketType.toLowerCase();
                  }
                  
                  return text;
                };
                
                return (
                <tr key={idx} className={`border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className={`font-medium text-xs sm:text-sm ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                        {batsman.n}
                      </div>
                      {batsman.isStriker && <span className="text-yellow-500 text-sm">★</span>}
                    </div>
                    <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {getDismissalText()}
                    </div>
                  </td>
                  <td className={`text-center px-1 sm:px-2 py-2 sm:py-3 font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                    {batsman.r}
                  </td>
                  <td className={`text-center px-1 sm:px-2 py-2 sm:py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {batsman.b}
                  </td>
                  <td className={`text-center px-1 sm:px-2 py-2 sm:py-3 ${isDark ? "text-orange-400" : "text-orange-600"} font-medium`}>
                    {batsman['4s'] || 0}
                  </td>
                  <td className={`text-center px-1 sm:px-2 py-2 sm:py-3 ${isDark ? "text-orange-400" : "text-orange-600"} font-medium`}>
                    {batsman['6s'] || 0}
                  </td>
                  <td className={`text-center px-1 sm:px-2 py-2 sm:py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {batsman.sr || "0.00"}
                  </td>
                  <td className="text-center px-1 sm:px-2 py-2 sm:py-3">
                    <span className={isDark ? "text-gray-400" : "text-gray-500"}>›</span>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
          </div>

              {/* Extras & Total */}
              <div className={`border-t ${isDark ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"}`}>
                <div className={`px-4 py-2 text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  <span className="font-semibold">Extras</span>
                  <span className="ml-2">{currentInning?.extras || "0 (b 0, lb 0, w 0, nb 0, p 0)"}</span>
                </div>
              </div>
              
              <div className={`border-t ${isDark ? "border-gray-700 bg-cyan-900" : "border-gray-200 bg-cyan-50"}`}>
                <div className={`px-4 py-2 text-xs font-bold ${isDark ? "text-cyan-200" : "text-cyan-900"}`}>
                  <span>Total</span>
                  <span className="ml-4">{currentInning?.score.r}-{currentInning?.score.w} ({currentInning?.score.o} Overs, RR: {currentInning?.runRate || "0.00"})</span>
                </div>
              </div>

              {/* Did not Bat */}
              {currentInning?.didNotBat && currentInning.didNotBat.length > 0 && (
                <div className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"} px-4 py-2`}>
                  <span className={`text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Did not Bat</span>
                  <span className={`text-xs ml-2 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                    {currentInning.didNotBat.join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Bowling Section */}
            <div>
              <div className={`${isDark ? "bg-gray-750" : "bg-gray-100"} px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Bowler
              </div>
          
          <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`${isDark ? "bg-gray-750 text-gray-300" : "bg-gray-50 text-gray-600"} border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <th className="text-left px-2 sm:px-4 py-1.5 sm:py-2 font-semibold"></th>
                <th className="text-center px-1 sm:px-2 py-1.5 sm:py-2 font-semibold">O</th>
                <th className="text-center px-1 sm:px-2 py-1.5 sm:py-2 font-semibold">M</th>
                <th className="text-center px-1 sm:px-2 py-1.5 sm:py-2 font-semibold">R</th>
                <th className="text-center px-1 sm:px-2 py-1.5 sm:py-2 font-semibold">W</th>
                <th className="text-center px-1 sm:px-2 py-1.5 sm:py-2 font-semibold">4s</th>
                <th className="text-center px-1 sm:px-2 py-1.5 sm:py-2 font-semibold">6s</th>
                <th className="text-center px-1 sm:px-2 py-1.5 sm:py-2 font-semibold">Ex</th>
                <th className="text-center px-1 sm:px-2 py-1.5 sm:py-2 font-semibold">Eco</th>
                <th className="w-6 sm:w-8"></th>
              </tr>
            </thead>
            <tbody>
              {currentInning?.bowling.map((bowler, idx) => (
                <tr key={idx} className={`border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <div className={`font-medium text-xs sm:text-sm ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                      {bowler.n}
                    </div>
                  </td>
                  <td className={`text-center px-1 sm:px-2 py-2 sm:py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {bowler.o}
                  </td>
                  <td className={`text-center px-1 sm:px-2 py-2 sm:py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {bowler.m || 0}
                  </td>
                  <td className={`text-center px-1 sm:px-2 py-2 sm:py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {bowler.r}
                  </td>
                  <td className={`text-center px-1 sm:px-2 py-2 sm:py-3 font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                    {bowler.w}
                  </td>
                  <td className={`text-center px-1 sm:px-2 py-2 sm:py-3 ${isDark ? "text-orange-400" : "text-orange-600"} font-medium`}>
                    {bowler['4s'] || 0}
                  </td>
                  <td className={`text-center px-1 sm:px-2 py-2 sm:py-3 ${isDark ? "text-orange-400" : "text-orange-600"} font-medium`}>
                    {bowler['6s'] || 0}
                  </td>
                  <td className={`text-center px-1 sm:px-2 py-2 sm:py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {bowler.extras || 0}
                  </td>
                  <td className={`text-center px-1 sm:px-2 py-2 sm:py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {bowler.eco}
                  </td>
                  <td className="text-center px-1 sm:px-2 py-2 sm:py-3">
                    <span className={isDark ? "text-gray-400" : "text-gray-500"}>›</span>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
            </div>
            </div>

            {/* Current Over Section */}
            {currentInning?.currentOver && currentInning.currentOver.balls && currentInning.currentOver.balls.length > 0 && (
              <div className="mt-3">
                <div className={`${isDark ? "bg-gray-750" : "bg-gray-100"} px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Current Over
                </div>
                <div className={`p-3 sm:p-4 ${isDark ? "bg-gray-800" : "bg-white"}`}>
                  <div className="flex flex-wrap gap-2">
                    {currentInning.currentOver.balls.map((ball, idx) => {
                      const getBallStyle = () => {
                        if (ball.t === "WIDE" || ball.t === "NO_BALL") return isDark ? "bg-red-600 text-white" : "bg-red-500 text-white";
                        if (ball.r === 6) return isDark ? "bg-purple-600 text-white" : "bg-purple-500 text-white";
                        if (ball.r === 4) return isDark ? "bg-green-600 text-white" : "bg-green-500 text-white";
                        if (ball.r === 0) return isDark ? "bg-gray-700 text-gray-300" : "bg-gray-300 text-gray-700";
                        return isDark ? "bg-cyan-700 text-white" : "bg-cyan-500 text-white";
                      };
                      
                      return (
                        <div
                          key={idx}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${getBallStyle()}`}
                        >
                          {ball.t === "WIDE" ? "WD" : ball.t === "NO_BALL" ? "NB" : ball.r}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Match Information Card */}
        <div className={`mt-2 sm:mt-3 ${isDark ? "bg-gray-800" : "bg-white shadow-sm"} border ${isDark ? "border-gray-700" : "border-gray-200"} p-3 sm:p-4 rounded-sm`}>
          <div className={`text-sm font-bold mb-3 ${isDark ? "text-gray-200" : "text-gray-900"}`}>Match Information</div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
            <div>
              <div className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-1`}>Format</div>
              <div className={`font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}>{data.meta.format}</div>
            </div>
            <div>
              <div className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-1`}>Status</div>
              <div className={`font-medium capitalize ${isDark ? "text-gray-200" : "text-gray-900"}`}>{data.meta.status}</div>
            </div>
            <div>
              <div className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-1`}>Match ID</div>
              <div className={`font-medium ${isDark ? "text-gray-200" : "text-gray-900"} truncate`}>{data.meta.matchId}</div>
            </div>
            <div>
              <div className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-1`}>Last Updated</div>
              <div className={`font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                {new Date(data.meta.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          <div className={`mt-3 pt-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            <div className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-2 text-xs`}>Teams</div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className={`flex-1 p-2 ${isDark ? "bg-gray-750" : "bg-gray-50"} flex items-center gap-2 rounded`}>
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xs rounded">
                  {data.teams.A.short}
                </div>
                <div className={`text-xs font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}>{data.teams.A.name}</div>
              </div>
              <div className={`flex-1 p-2 ${isDark ? "bg-gray-750" : "bg-gray-50"} flex items-center gap-2 rounded`}>
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xs rounded">
                  {data.teams.B.short}
                </div>
                <div className={`text-xs font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}>{data.teams.B.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveScore;
