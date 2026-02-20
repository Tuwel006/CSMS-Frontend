import React, { useMemo, useState, useEffect } from 'react';
import { Trophy, TrendingUp, Target, X, Star, Check } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { MatchService } from '../../../services/matchService';
import { showToast } from '../../../utils/toast';
import { CompleteMatchPayload } from '../../../types/matchService';

interface MatchResultModalProps {
    isOpen: boolean;
    matchData: any;
    onClose: () => void;
}

export const MatchResultModal: React.FC<MatchResultModalProps> = ({ isOpen, matchData, onClose }) => {
    const [selectedMOM, setSelectedMOM] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fullMatchData, setFullMatchData] = useState<any>(null);

    // Manual Result State
    const [useDefaultResult, setUseDefaultResult] = useState(true);
    const [winnerTeamId, setWinnerTeamId] = useState<number | undefined>(undefined);
    const [resultDescription, setResultDescription] = useState('');

    // Hooks must be called unconditionally
    const innings = matchData?.innings || [];
    const teams = matchData?.teams || {};
    const meta = matchData?.meta || {};

    const teamA = teams.A || teams.teamA;
    const teamB = teams.B || teams.teamB;

    // Fetch full match data to get player rosters if missing
    useEffect(() => {
        if (isOpen && meta.matchId) {
            const fetchFullDetails = async () => {
                try {
                    const response = await MatchService.getCurrentMatch(meta.matchId);
                    if (response.data) {
                        setFullMatchData(response.data);
                    }
                } catch (error) {
                    // Fail silently, fallback to existing data
                }
            };
            fetchFullDetails();
        }
    }, [isOpen, meta.matchId]);

    // Initialize state from meta if available
    useEffect(() => {
        if (matchData) {
            if (meta.man_of_the_match) setSelectedMOM(Number(meta.man_of_the_match));
            if (meta.winnerTeamId) setWinnerTeamId(meta.winnerTeamId);
            // If match is completed and has manual-looking data, maybe default should be false?
            // For now, default to true unless we strictly know otherwise.
            // But if user opens this to EDIT, they might want to see current state.
        }
    }, [matchData]);

    // Determine winner
    const winnerInfo = useMemo(() => {
        if (!matchData) return null;

        const winnerId = meta.winnerTeamId || (meta as any).winnerTeamId;
        if (!winnerId) return null;

        let winnerTeam, loserTeam;
        if (teamA?.id === winnerId) {
            winnerTeam = teamA;
            loserTeam = teamB;
        } else if (teamB?.id === winnerId) {
            winnerTeam = teamB;
            loserTeam = teamA;
        }

        if (!winnerTeam) return null;

        return {
            teamId: winnerTeam.id,
            teamName: winnerTeam.name,
            margin: meta.winMargin || (meta as any).winMargin || '',
            type: meta.winType || (meta as any).winType || '',
            loserName: loserTeam?.name || 'Opposition'
        };
    }, [matchData, meta, teamA, teamB]);

    // Process stats per innings
    const inningsPerformance = useMemo(() => {
        if (!matchData || !innings.length) return [];

        const getTeamName = (idOrName: string | number) => {
            if (teamA && (teamA.id === idOrName || teamA.name === idOrName)) return teamA.name;
            if (teamB && (teamB.id === idOrName || teamB.name === idOrName)) return teamB.name;
            return idOrName; // Fallback
        };

        return innings.map((inn: any, index: number) => {
            // BATSMEN: Combine striker, nonStriker, and dismissed
            const activeBatsmen = [
                inn.batting?.striker,
                inn.batting?.nonStriker
            ].filter(Boolean); // Remove nulls

            const dismissedBatsmen = inn.dismissed || [];

            // Merge and deduplicate by ID (just in case)
            const allBatsmenMap = new Map();
            [...activeBatsmen, ...dismissedBatsmen].forEach((b: any) => {
                if (b && b.id) {
                    allBatsmenMap.set(b.id, b);
                }
            });

            const allBatsmen = Array.from(allBatsmenMap.values());

            // Sort by Runs DESC, then Balls ASC (efficiency)
            const topBatsmen = allBatsmen.sort((a: any, b: any) => {
                if (b.r !== a.r) return b.r - a.r;
                return a.b - b.b;
            }).slice(0, 3);

            // BOWLERS: From bowling array
            const allBowlers = inn.bowling || [];

            // Sort by Wickets DESC, then Runs Conceded ASC (efficiency)
            const topBowlers = [...allBowlers].sort((a: any, b: any) => {
                if (b.w !== a.w) return b.w - a.w;
                return a.r - b.r;
            }).slice(0, 3);

            return {
                id: index,
                number: inn.innings_number || index + 1,
                battingTeam: getTeamName(inn.battingTeam),
                bowlingTeam: getTeamName(inn.bowlingTeam),
                score: inn.score,
                topBatsmen,
                topBowlers
            };
        });
    }, [matchData, innings, teamA, teamB]);

    // All Players flat list with aggregate stats for dropdown
    const allPlayersList = useMemo(() => {
        const statsMap = new Map<number, {
            id: number;
            name: string;
            teamId: number | string;
            runs: number;
            balls: number;
            wickets: number;
            runsConceded: number;
            ballsBowled: number; // Correctly track balls bowled
            inningsCount: number;
        }>();

        // Helper to init or get player stats
        const getPlayerStat = (p: any, teamId: number | string) => {
            if (!p || !p.id) return null;
            if (!statsMap.has(p.id)) {
                statsMap.set(p.id, {
                    id: p.id,
                    name: p.name || p.n || 'Unknown',
                    teamId, // Important: keep the team ID provided during init
                    runs: 0,
                    balls: 0,
                    wickets: 0,
                    runsConceded: 0,
                    ballsBowled: 0,
                    inningsCount: 0
                });
            }
            return statsMap.get(p.id)!;
        };

        // 1. Populate from Full Match Data (Rosters) - BEST SOURCE
        if (fullMatchData) {
            const fTeamA = fullMatchData.teamA || fullMatchData.teams?.A;
            const fTeamB = fullMatchData.teamB || fullMatchData.teams?.B;

            // Prefer using raw Team IDs from metadata if available
            const idA = fTeamA?.id || teamA?.id;
            const idB = fTeamB?.id || teamB?.id;

            if (fTeamA && fTeamA.players) {
                fTeamA.players.forEach((p: any) => getPlayerStat(p, idA));
            }
            if (fTeamB && fTeamB.players) {
                fTeamB.players.forEach((p: any) => getPlayerStat(p, idB));
            }
        }
        else {
            // Fallback
            if (teamA?.players) teamA.players.forEach((p: any) => getPlayerStat(p, teamA.id));
            if (teamB?.players) teamB.players.forEach((p: any) => getPlayerStat(p, teamB.id));
        }

        // 2. Iterate all innings to sum up stats
        innings.forEach((inn: any) => {
            // Determine team IDs for this innings
            const isBattingTeamA = inn.battingTeam === teamA?.name || inn.battingTeam === teamA?.id;
            const battingTeamId = isBattingTeamA ? teamA?.id : teamB?.id;
            const bowlingTeamId = isBattingTeamA ? teamB?.id : teamA?.id;

            // Batting Stats
            const uniqueBatsmenInInnings = new Map();
            [
                inn.batting?.striker,
                inn.batting?.nonStriker,
                ...(inn.dismissed || [])
            ].forEach((b: any) => {
                if (b && b.id) uniqueBatsmenInInnings.set(b.id, b);
            });

            uniqueBatsmenInInnings.forEach((b: any) => {
                const p = getPlayerStat(b, battingTeamId); // Use resolved ID
                if (p) {
                    p.runs += (b.r || 0);
                    p.balls += (b.b || 0);
                    p.inningsCount++;
                }
            });

            // Bowling Stats
            if (inn.bowling) {
                inn.bowling.forEach((b: any) => {
                    const p = getPlayerStat(b, bowlingTeamId); // Use resolved ID
                    if (p) {
                        p.wickets += (b.w || 0);
                        p.runsConceded += (b.r || 0);
                        let balls = b.b || 0;
                        if (!balls && b.o) {
                            const oStr = String(b.o);
                            const parts = oStr.split('.');
                            const overs = parseInt(parts[0] || '0', 10);
                            const extraBalls = parseInt(parts[1] || '0', 10);
                            balls = (overs * 6) + extraBalls;
                        }
                        p.ballsBowled += balls;
                    }
                });
            }
        });

        // Split lists
        const listA: any[] = [];
        const listB: any[] = [];

        // Final team check
        const idA = fullMatchData?.teamA?.id || teamA?.id;

        statsMap.forEach(p => {
            if (p.teamId === idA) listA.push(p);
            else listB.push(p);
        });

        return { listA, listB };
    }, [teamA, teamB, innings, fullMatchData]);

    if (!isOpen || !matchData) return null;

    const handleSubmitResult = async () => {
        setIsSubmitting(true);
        try {
            const payload: CompleteMatchPayload = {
                default: useDefaultResult,
                man_of_the_match_player_id: selectedMOM,
                ...(!useDefaultResult && {
                    winner_team_id: winnerTeamId,
                    result_description: resultDescription
                })
            };

            await MatchService.completeMatch(meta.matchId, payload);
            showToast.success('Match result updated successfully');
            onClose();
        } catch (error) {
            console.error('Error submitting result:', error);
            showToast.error('Failed to submit result');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper formatting function for minimal text
    const formatPlayerOption = (p: any) => {
        const parts = [];
        // Batting: 45(23)
        if (p.runs > 0 || p.balls > 0) {
            parts.push(`${p.runs}(${p.balls})`); // e.g. 45(23)
        }

        // Bowling: 2-24 (4.0)
        // Wickets-Runs (Overs)
        if (p.ballsBowled > 0 || p.wickets > 0) {
            const overs = Math.floor(p.ballsBowled / 6);
            const extraBalls = p.ballsBowled % 6;
            const ovStr = extraBalls > 0 ? `${overs}.${extraBalls}` : `${overs}`;
            parts.push(`${p.wickets}-${p.runsConceded} (${ovStr})`);
        }

        if (parts.length === 0) return p.name;
        return `${p.name}  •  ${parts.join('  •  ')}`;
    };

    const getOver = (balls: number) => {
        const overs = Math.floor(balls / 6);
        const extraBalls = balls % 6;
        return extraBalls > 0 ? `${overs}.${extraBalls}` : `${overs}`;
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300" onClick={onClose} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-[var(--card-bg)] w-full max-w-4xl rounded-xl shadow-2xl border border-[var(--card-border)] pointer-events-auto animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Beautiful Header with Gradient */}
                    <div className="relative bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 px-6 py-5 flex items-center justify-between shrink-0 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40 shadow-lg animate-pulse">
                                <Trophy size={24} className="text-white drop-shadow-lg" />
                            </div>
                            <div>
                                <h1 className="text-xs font-black text-white/90 uppercase tracking-widest leading-none mb-1.5 drop-shadow">🏆 Match Summary</h1>
                                <p className="text-lg font-black text-white leading-none drop-shadow-md">
                                    {winnerInfo ? `${winnerInfo.teamName} Won! 🎉` : 'Match Concluded'}
                                </p>
                                {winnerInfo && (
                                    <p className="text-xs font-semibold text-white/80 mt-1 drop-shadow">
                                        by {winnerInfo.margin} {winnerInfo.type}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all border border-white/30 relative z-10">
                            <X size={16} className="text-white" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">

                        {/* Innings Rows */}
                        {inningsPerformance.map((inn: any, idx: number) => (
                            <div key={idx} className="border-2 border-[var(--card-border)] rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/40 dark:to-gray-900/40 shadow-md hover:shadow-lg transition-shadow">
                                {/* Innings Header */}
                                <div className="px-4 py-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 border-b-2 border-[var(--card-border)] flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                                            {inn.number === 1 ? '🥇 1st' : '🥈 2nd'} Innings
                                        </span>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            {inn.battingTeam}
                                            <span className="text-xs font-normal text-gray-400">⚔️</span>
                                            {inn.bowlingTeam}
                                        </p>
                                    </div>
                                    <div className="text-sm font-black font-mono text-white bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 rounded-lg shadow-md">
                                        {inn.score?.r}/{inn.score?.w} <span className="text-xs text-white/80">({getOver(inn.score?.b)})</span>
                                    </div>
                                </div>

                                {/* Comparison Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--card-border)]">

                                    {/* Batting Column (Left) */}
                                    <div className="p-4 bg-white/50 dark:bg-gray-800/30">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                                <TrendingUp size={14} /> 🏏 Top Batsmen
                                            </h4>
                                        </div>
                                        <table className="w-full text-xs">
                                            <tbody className="divide-y divide-[var(--card-border)]">
                                                {inn.topBatsmen.length > 0 ? (
                                                    inn.topBatsmen.map((p: any, i: number) => (
                                                        <tr key={i} className="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                                                            <td className="py-2 pr-2 font-semibold text-gray-800 dark:text-gray-200 w-full truncate flex items-center gap-2">
                                                                {i === 0 && <span className="text-sm">🌟</span>}
                                                                {p.n}
                                                            </td>
                                                            <td className="py-2 px-2 text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                                                {p.r} <span className="text-[10px] font-normal text-gray-400">({p.b})</span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td className="py-3 text-center text-gray-400 italic text-xs">No batting data</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Bowling Column (Right) */}
                                    <div className="p-4 bg-white/30 dark:bg-gray-900/30">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center gap-2">
                                                <Target size={14} /> ⚾ Top Bowlers
                                            </h4>
                                        </div>
                                        <table className="w-full text-xs">
                                            <tbody className="divide-y divide-[var(--card-border)]">
                                                {inn.topBowlers.length > 0 ? (
                                                    inn.topBowlers.map((p: any, i: number) => (
                                                        <tr key={i} className="hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                                            <td className="py-2 pr-2 font-semibold text-gray-800 dark:text-gray-200 w-full truncate flex items-center gap-2">
                                                                {i === 0 && <span className="text-sm">🔥</span>}
                                                                {p.n}
                                                            </td>
                                                            <td className="py-2 px-2 text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                                                {p.w} <span className="text-[10px] font-normal text-gray-400">-{p.r}</span>
                                                            </td>
                                                            <td className="py-2 pl-2 text-right text-gray-500 whitespace-nowrap w-12 text-[10px]">{p.o} ov</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td className="py-3 text-center text-gray-400 italic text-xs">No bowling data</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                        ))}

                        {/* Result Controls Row */}
                        <div className="pt-2">
                            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-4 flex flex-col gap-4 shadow-xl border-2 border-slate-700">

                                {/* Top Controls: Toggle and Status */}
                                <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
                                    <div>
                                        <p className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                                            ⚙️ Result Calculation
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {useDefaultResult ? '✅ System Automatic' : '✏️ Manual Entry'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setUseDefaultResult(!useDefaultResult)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none shadow-lg ${useDefaultResult ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-gray-700'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md ${useDefaultResult ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                {/* Manual Result Fields */}
                                {!useDefaultResult && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-lg border-2 border-dashed border-white/10 backdrop-blur-sm">
                                        {/* Winner Select */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-300 uppercase ml-1 flex items-center gap-1.5">
                                                🏆 Winner Team
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => setWinnerTeamId(teamA?.id)}
                                                    className={`p-3 rounded-lg border-2 text-xs font-bold transition-all ${winnerTeamId === teamA?.id ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'}`}
                                                >
                                                    {teamA?.name || 'Team A'}
                                                </button>
                                                <button
                                                    onClick={() => setWinnerTeamId(teamB?.id)}
                                                    className={`p-3 rounded-lg border-2 text-xs font-bold transition-all ${winnerTeamId === teamB?.id ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'}`}
                                                >
                                                    {teamB?.name || 'Team B'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Result Description */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-300 uppercase ml-1 flex items-center gap-1.5">
                                                📝 Win Description
                                            </label>
                                            <input
                                                type="text"
                                                value={resultDescription}
                                                onChange={(e) => setResultDescription(e.target.value)}
                                                placeholder="e.g. Won by 20 runs"
                                                className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* MOM and Submit Action */}
                                <div className="flex flex-col md:flex-row items-end gap-4">
                                    <div className="flex-1 w-full">
                                        <label className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Star size={14} className="fill-amber-400" /> 🌟 Man of the Match
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={selectedMOM || ''}
                                                onChange={(e) => setSelectedMOM(Number(e.target.value))}
                                                className="w-full bg-gray-900 text-white text-xs font-bold focus:outline-none appearance-none cursor-pointer border-2 border-gray-700 rounded-lg py-3 px-4 hover:border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-lg"
                                            >
                                                <option value="" className="text-gray-400">Select Player of the Match</option>
                                                {/* Groups logic here... */}
                                                <optgroup label={`${teamA?.name || 'Team A'} 🏏`} className="bg-gray-800 text-gray-400 font-extrabold uppercase tracking-wider">
                                                    {allPlayersList.listA.map(p => (
                                                        <option key={p.id} value={p.id} className="text-white font-medium py-1">
                                                            {formatPlayerOption(p)}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                                <optgroup label={`${teamB?.name || 'Team B'} 🏏`} className="bg-gray-800 text-gray-400 font-extrabold uppercase tracking-wider">
                                                    {allPlayersList.listB.map(p => (
                                                        <option key={p.id} value={p.id} className="text-white font-medium py-1">
                                                            {formatPlayerOption(p)}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            </select>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleSubmitResult}
                                        disabled={isSubmitting}
                                        className="h-12 w-full md:w-auto px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all min-w-[160px]"
                                    >
                                        {isSubmitting ? '⏳ Saving...' : (
                                            <>
                                                <Check size={16} /> ✅ Update Result
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
