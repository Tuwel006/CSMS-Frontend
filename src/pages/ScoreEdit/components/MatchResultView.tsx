import React from 'react';
import { Card, Stack, Text, Grid } from '../../../components/ui/lib';
import { useTheme } from '../../../context/ThemeContext';
import { Calendar, MapPin, Award, Trophy, TrendingUp, Target } from 'lucide-react';
import { ScoreType } from '../../../store/score/scoreTypes';
import { Innings } from '../../../types/scoreService';

interface MatchResultViewProps {
    matchData: ScoreType;
}

const MatchResultView: React.FC<MatchResultViewProps> = ({ matchData }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Utility functions for calculations
    const getOver = (balls?: number): string => {
        if (!balls && balls !== 0) return '0.0';
        const overs = Math.floor(balls / 6);
        const remainingBalls = balls % 6;
        return `${overs}.${remainingBalls}`;
    };

    const getStrikeRate = (runs?: number, balls?: number): string => {
        if (!balls || balls === 0) return '0.00';
        const sr = (runs || 0) / balls * 100;
        return sr.toFixed(2);
    };

    const getEconomy = (runs?: number, balls?: number): string => {
        if (!balls || balls === 0) return '0.00';
        const overs = balls / 6;
        const eco = (runs || 0) / overs;
        return eco.toFixed(2);
    };

    const getAllBatsmen = (inn: Innings) => {
        if (!inn) return [];
        const batsmen: any[] = [];
        // Add current batters (not out or retired hurt but currently at crease)
        if (inn.batting?.striker) batsmen.push({ ...inn.batting.striker, status: 'not out' });
        if (inn.batting?.nonStriker) batsmen.push({ ...inn.batting.nonStriker, status: 'not out' });
        // Add dismissed batters
        if (inn.dismissed) {
            batsmen.push(...inn.dismissed);
        }
        return batsmen.sort((a, b) => (a.order || 0) - (b.order || 0));
    };

    const getDismissalText = (batsman: any) => {
        if (batsman.status === 'not out' || (!batsman.w && !batsman.dismissal)) return "not out";
        const wicket = batsman.w || batsman.dismissal;
        if (!wicket) return "not out";
        const wicketType = wicket.wicket_type || wicket.type;
        const by = wicket.fielder || wicket.by;
        const bowler = wicket.bowler;
        let text = "";
        if (wicketType === "Caught") {
            text = "c " + (by || "") + (bowler ? ` b ${bowler}` : "");
        } else if (wicketType === "Bowled") {
            text = bowler ? `b ${bowler}` : "bowled";
        } else if (wicketType === "Run Out") {
            text = `run out (${by || ""})`;
        } else if (wicketType === "Stumped") {
            text = `st ${by || ""} b ${bowler || ""}`;
        } else if (wicketType === "LBW") {
            text = `lbw b ${bowler || ""}`;
        } else {
            text = wicketType?.toLowerCase() || '';
        }
        return text;
    };

    const formattedDate = matchData.meta.lastUpdated ? new Date(matchData.meta.lastUpdated).toLocaleDateString() : 'Unknown Date';

    const getResultText = () => {
        if (matchData.meta.status !== 'COMPLETED') return matchData.meta.status;
        if (matchData.meta.winnerTeamId) {
            const winner = matchData.meta.winnerTeamId === matchData.teams.A.id ? matchData.teams.A.name : matchData.teams.B.name;
            const margin = matchData.meta.winMargin || '';
            const type = matchData.meta.winType || '';
            return `${winner} Won ${margin ? `by ${margin} ${type}` : ''}`;
        }
        return "Match Completed";
    };

    const resultText = getResultText();
    const winnerTeamId = matchData.meta.winnerTeamId;

    return (
        <div className={`min-h-screen ${isDark ? "bg-[#0f172a]" : "bg-gray-50"} pb-12 font-sans`}>
            {/* Elegant Theme-Matching Banner */}
            <div className={`relative ${isDark ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-r from-slate-50 via-white to-slate-50'} shadow-lg z-10 overflow-hidden border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <div className={`absolute inset-0 opacity-5 ${isDark ? 'bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=")]' : 'bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0iYmxhY2siLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=")]'}`}></div>
                <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-5 relative z-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                        {/* Left: Trophy & Result */}
                        <div className="flex items-center gap-3">
                            {winnerTeamId && (
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'} border-2 flex items-center justify-center shadow-md`}>
                                    <Trophy className={`${isDark ? 'text-amber-500' : 'text-amber-600'} w-5 h-5 sm:w-6 sm:h-6`} />
                                </div>
                            )}
                            <div>
                                <div className={`inline-flex items-center gap-1.5 ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'} border px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase font-black tracking-wider mb-1`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'} animate-pulse`}></span>
                                    Match Concluded
                                </div>
                                <h1 className={`text-base sm:text-lg md:text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'} leading-tight`}>
                                    {resultText}
                                </h1>
                                <div className={`flex items-center gap-2 text-[9px] sm:text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                                    <span className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {formattedDate}</span>
                                    <span className={`w-0.5 h-0.5 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-400'}`} />
                                    <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {matchData.meta.venue || "Stadium"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Score Summary */}
                        <div className={`flex items-center gap-3 sm:gap-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg px-3 py-2 shadow-sm`}>
                            {/* Team A */}
                            <div className={`flex items-center gap-2 ${winnerTeamId === matchData.teams.A.id ? 'opacity-100' : 'opacity-60'}`}>
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[10px] sm:text-xs font-black shadow-sm text-white">
                                    {matchData.teams.A.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="text-right">
                                    <div className={`text-[10px] sm:text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} leading-tight`}>{matchData.teams.A.name}</div>
                                    {matchData.innings.map((inn, i) => inn.battingTeam === matchData.teams.A.name ? (
                                        <div key={i} className={`text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-900'} font-mono font-bold`}>{inn.score?.r}/{inn.score?.w} <span className={`opacity-60 text-[9px] sm:text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>({getOver(inn.score?.b)})</span></div>
                                    ) : null)}
                                </div>
                            </div>

                            <div className={`text-xs sm:text-sm font-black ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>vs</div>

                            {/* Team B */}
                            <div className={`flex items-center gap-2 ${winnerTeamId === matchData.teams.B.id ? 'opacity-100' : 'opacity-60'}`}>
                                <div className="text-left">
                                    <div className={`text-[10px] sm:text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} leading-tight`}>{matchData.teams.B.name}</div>
                                    {matchData.innings.map((inn, i) => inn.battingTeam === matchData.teams.B.name ? (
                                        <div key={i} className={`text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-900'} font-mono font-bold`}>{inn.score?.r}/{inn.score?.w} <span className={`opacity-60 text-[9px] sm:text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>({getOver(inn.score?.b)})</span></div>
                                    ) : null)}
                                </div>
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-[10px] sm:text-xs font-black shadow-sm text-white">
                                    {matchData.teams.B.name.substring(0, 2).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area - Compact Scorecard */}
            <div className="max-w-6xl mx-auto px-2 sm:px-3 mt-3 sm:mt-4 relative z-20">
                <div className="space-y-3 sm:space-y-4">
                    {matchData.innings.map((inning, idx) => (
                        <div key={idx} className={`rounded-lg overflow-hidden shadow-sm border ${isDark ? "bg-[#1e293b] border-slate-700" : "bg-white border-slate-200"}`}>
                            {/* Innings Header - Compact */}
                            <div className={`px-3 py-2 ${isDark ? "bg-slate-800/80" : "bg-slate-50"} border-b ${isDark ? "border-slate-700" : "border-slate-100"} flex items-center justify-between`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] sm:text-[10px] font-black bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                                        {inning.innings_number === 1 ? '🥇 1st' : '🥈 2nd'} Innings
                                    </span>
                                    <div className={`text-[10px] sm:text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                        {inning.battingTeam} <span className="text-[9px] font-normal opacity-60">vs {inning.bowlingTeam}</span>
                                    </div>
                                </div>
                                <div className={`text-xs sm:text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'} bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-2 py-0.5 rounded shadow-sm`}>
                                    {inning.score?.r}/{inning.score?.w} <span className="text-[9px] sm:text-[10px] text-white/80">({getOver(inning.score?.b)})</span>
                                </div>
                            </div>

                            <div className={`grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x ${isDark ? "divide-slate-700" : "divide-slate-100"}`}>

                                {/* Batting Table - Compact */}
                                <div>
                                    <div className="px-3 py-1.5 bg-blue-500/5 flex items-center gap-1.5 border-b border-blue-500/10">
                                        <TrendingUp className="text-blue-500 w-3 h-3" />
                                        <span className="text-[9px] sm:text-[10px] font-black text-blue-600 uppercase tracking-wider">🏏 Batting</span>
                                    </div>
                                    <table className="w-full text-[9px] sm:text-[10px]">
                                        <thead className={`${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-500"} border-b ${isDark ? "border-slate-700" : "border-slate-100"}`}>
                                            <tr>
                                                <th className="text-left font-bold py-1.5 px-2 sm:px-3 w-5/12 uppercase tracking-wide text-[8px] sm:text-[9px]">Batter</th>
                                                <th className="text-center font-bold py-1.5 uppercase tracking-wide text-[8px] sm:text-[9px]">R</th>
                                                <th className="text-center font-bold py-1.5 uppercase tracking-wide text-[8px] sm:text-[9px]">B</th>
                                                <th className="text-center font-bold hidden sm:table-cell py-1.5 uppercase tracking-wide text-[8px] sm:text-[9px]">4s</th>
                                                <th className="text-center font-bold hidden sm:table-cell py-1.5 uppercase tracking-wide text-[8px] sm:text-[9px]">6s</th>
                                                <th className="text-right font-bold pr-2 sm:pr-3 py-1.5 uppercase tracking-wide text-[8px] sm:text-[9px]">SR</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDark ? "divide-slate-800/50" : "divide-slate-50"}`}>
                                            {getAllBatsmen(inning).map((batter, bIdx) => (
                                                <tr key={bIdx} className={`${batter.status === 'not out' ? (isDark ? 'bg-green-500/5' : 'bg-green-50') : ''} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}>
                                                    <td className="py-1.5 px-2 sm:px-3 align-middle relative">
                                                        {batter.status === 'not out' && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-green-500"></div>}
                                                        <div className={`font-bold ${isDark ? "text-slate-200" : "text-slate-700"} truncate max-w-[100px] sm:max-w-[120px] text-[10px] sm:text-xs flex items-center gap-1`}>
                                                            {batter.n}
                                                        </div>
                                                        <div className="text-[8px] sm:text-[9px] text-slate-400 truncate max-w-[100px] sm:max-w-[120px]">{getDismissalText(batter)}</div>
                                                    </td>
                                                    <td className={`text-center font-bold align-middle ${isDark ? "text-white" : "text-slate-900"} text-[10px] sm:text-xs`}>{batter.r}</td>
                                                    <td className="text-center text-slate-400 align-middle text-[9px] sm:text-[10px]">{batter.b}</td>
                                                    <td className="text-center text-slate-400 hidden sm:table-cell align-middle">{batter['4s'] || 0}</td>
                                                    <td className="text-center text-slate-400 hidden sm:table-cell align-middle">{batter['6s'] || 0}</td>
                                                    <td className="text-right pr-2 sm:pr-3 text-slate-500 align-middle font-mono text-[9px] sm:text-[10px]">{getStrikeRate(batter.r, batter.b)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Bowling Table - Compact */}
                                <div>
                                    <div className="px-3 py-1.5 bg-rose-500/5 flex items-center gap-1.5 border-b border-rose-500/10">
                                        <Target className="text-rose-500 w-3 h-3" />
                                        <span className="text-[9px] sm:text-[10px] font-black text-rose-600 uppercase tracking-wider">⚾ Bowling</span>
                                    </div>
                                    <table className="w-full text-[9px] sm:text-[10px]">
                                        <thead className={`${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-500"} border-b ${isDark ? "border-slate-700" : "border-slate-100"}`}>
                                            <tr>
                                                <th className="text-left font-bold py-1.5 px-2 sm:px-3 w-5/12 uppercase tracking-wide text-[8px] sm:text-[9px]">Bowler</th>
                                                <th className="text-center font-bold py-1.5 uppercase tracking-wide text-[8px] sm:text-[9px]">O</th>
                                                <th className="text-center font-bold py-1.5 uppercase tracking-wide text-[8px] sm:text-[9px]">M</th>
                                                <th className="text-center font-bold py-1.5 uppercase tracking-wide text-[8px] sm:text-[9px]">R</th>
                                                <th className="text-center font-bold py-1.5 uppercase tracking-wide text-[8px] sm:text-[9px]">W</th>
                                                <th className="text-right font-bold pr-2 sm:pr-3 py-1.5 uppercase tracking-wide text-[8px] sm:text-[9px]">Eco</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDark ? "divide-slate-800/50" : "divide-slate-50"}`}>
                                            {inning.bowling?.map((bowler, boIdx) => (
                                                <tr key={boIdx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                    <td className="py-1.5 px-2 sm:px-3 font-semibold align-middle truncate max-w-[100px] sm:max-w-[120px] text-slate-700 dark:text-slate-300 text-[10px] sm:text-xs flex items-center gap-1">
                                                        {bowler.n}
                                                    </td>
                                                    <td className="text-center text-slate-500 align-middle text-[9px] sm:text-[10px]">{getOver(bowler.b)}</td>
                                                    <td className="text-center text-slate-400 align-middle text-[9px] sm:text-[10px]">{bowler.m || 0}</td>
                                                    <td className="text-center text-slate-500 align-middle text-[9px] sm:text-[10px]">{bowler.r}</td>
                                                    <td className={`text-center font-bold align-middle ${isDark ? "text-white" : "text-slate-900"} text-[10px] sm:text-xs`}>{bowler.w}</td>
                                                    <td className="text-right pr-2 sm:pr-3 text-slate-500 align-middle font-mono text-[9px] sm:text-[10px]">{getEconomy(bowler.r, bowler.b)}</td>
                                                </tr>
                                            )) || <tr><td colSpan={6} className="text-center py-3 text-slate-400 italic text-[9px] sm:text-[10px]">No Bowling Data</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-6 sm:mt-8 text-center opacity-40 hover:opacity-100 transition-opacity pb-6">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 font-bold flex items-center justify-center gap-1.5">
                        ✅ Match Completed Successfully
                    </p>
                    <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-700 mx-auto mt-1.5 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default MatchResultView;
