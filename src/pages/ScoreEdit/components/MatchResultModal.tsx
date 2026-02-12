import React, { useMemo, useState, useEffect } from 'react';
import { Trophy, TrendingUp, Target, X, Star, Check } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { MatchService } from '../../../services/matchService';
import { showToast } from '../../../utils/toast';

interface MatchResultModalProps {
    isOpen: boolean;
    matchData: any;
    onClose: () => void;
}

export const MatchResultModal: React.FC<MatchResultModalProps> = ({ isOpen, matchData, onClose }) => {
    const [selectedMOM, setSelectedMOM] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fullMatchData, setFullMatchData] = useState<any>(null);

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
                        // Assuming 'b.b' is balls delivered if available, or calc from overs
                        // Standard score object has 'b' for balls bowled usually? 
                        // Let's check typical structure. Usually `b` is balls. `o` is overs string.
                        // If `b` is missing but `o` is there (e.g. "3.2"), parse it.
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
        if (!selectedMOM) {
            showToast.error('Please choose Man of the Match');
            return;
        }

        setIsSubmitting(true);
        try {
            if ((MatchService as any).updateMatch) {
                await (MatchService as any).updateMatch(meta.matchId, { man_of_the_match: String(selectedMOM) });
            } else {
                const { apiClient } = await import('../../../utils/api');
                await apiClient.patch(`matches/${meta.matchId}`, { man_of_the_match: String(selectedMOM) });
            }
            showToast.success('Match result submitted successfully');
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

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300" onClick={onClose} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-[var(--card-bg)] w-full max-w-4xl rounded-xl shadow-2xl border border-[var(--card-border)] pointer-events-auto animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Compact Header */}
                    <div className="bg-gray-100 dark:bg-gray-800/50 border-b border-[var(--card-border)] px-4 py-3 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                <Trophy size={16} className="text-amber-600 dark:text-amber-500" />
                            </div>
                            <div>
                                <h1 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none mb-1">Match Summary</h1>
                                <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                                    {winnerInfo ? `${winnerInfo.teamName} Won by ${winnerInfo.margin} ${winnerInfo.type}` : 'Match Concluded'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-6 h-6 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors">
                            <X size={14} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">

                        {/* Innings Rows */}
                        {inningsPerformance.map((inn: any, idx: number) => (
                            <div key={idx} className="border border-[var(--card-border)] rounded-lg overflow-hidden bg-gray-50/30 dark:bg-gray-800/20">
                                {/* Innings Header */}
                                <div className="px-3 py-2 bg-gray-100/50 dark:bg-gray-700/30 border-b border-[var(--card-border)] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                            {inn.number === 1 ? '1st' : '2nd'} Innings
                                        </span>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                            {inn.battingTeam}
                                            <span className="text-[10px] font-normal text-gray-400">vs</span>
                                            {inn.bowlingTeam}
                                        </p>
                                    </div>
                                    <div className="text-xs font-bold font-mono text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-[var(--card-border)]">
                                        {inn.score?.r}/{inn.score?.w} <span className="text-[10px] text-gray-400">({inn.score?.o})</span>
                                    </div>
                                </div>

                                {/* Comparison Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--card-border)]">

                                    {/* Batting Column (Left) */}
                                    <div className="p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <TrendingUp size={10} /> Batsmen
                                            </h4>
                                        </div>
                                        <table className="w-full text-[10px]">
                                            <tbody className="divide-y divide-[var(--card-border)]">
                                                {inn.topBatsmen.length > 0 ? (
                                                    inn.topBatsmen.map((p: any, i: number) => (
                                                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                                            <td className="py-1.5 pr-2 font-semibold text-gray-800 dark:text-gray-200 w-full truncate">{p.n}</td>
                                                            <td className="py-1.5 px-2 text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">{p.r} <span className="text-[9px] font-normal text-gray-400">({p.b})</span></td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td className="py-2 text-center text-gray-400 italic text-[10px]">No batting data</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Bowling Column (Right) */}
                                    <div className="p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <Target size={10} /> Bowlers
                                            </h4>
                                        </div>
                                        <table className="w-full text-[10px]">
                                            <tbody className="divide-y divide-[var(--card-border)]">
                                                {inn.topBowlers.length > 0 ? (
                                                    inn.topBowlers.map((p: any, i: number) => (
                                                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                                            <td className="py-1.5 pr-2 font-semibold text-gray-800 dark:text-gray-200 w-full truncate">{p.n}</td>
                                                            <td className="py-1.5 px-2 text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">{p.w} <span className="text-[9px] font-normal text-gray-400">-{p.r}</span></td>
                                                            <td className="py-1.5 pl-2 text-right text-gray-500 whitespace-nowrap w-12 text-[9px]">{p.o} ov</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td className="py-2 text-center text-gray-400 italic text-[10px]">No bowling data</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                        ))}

                        {/* Man of the Match Row */}
                        <div className="pt-2">
                            <div className="bg-[#0f172a] rounded-lg p-3 flex flex-col md:flex-row items-center gap-4 shadow-lg border border-gray-800">
                                <div className="flex-1 w-full">
                                    <label className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                        <Star size={10} className="fill-amber-500" /> Man of the Match
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedMOM || ''}
                                            onChange={(e) => setSelectedMOM(Number(e.target.value))}
                                            className="w-full bg-gray-900 text-white text-[11px] font-bold focus:outline-none appearance-none cursor-pointer border border-gray-700 rounded-md py-2 px-3 hover:border-gray-600 transition-colors"
                                        >
                                            <option value="" className="text-gray-400">Select Player</option>
                                            <optgroup label={teamA?.name || 'Team A'} className="bg-gray-800 text-gray-400 font-extrabold uppercase tracking-wider">
                                                {allPlayersList.listA.map(p => (
                                                    <option key={p.id} value={p.id} className="text-white font-medium py-1">
                                                        {formatPlayerOption(p)}
                                                    </option>
                                                ))}
                                            </optgroup>
                                            <optgroup label={teamB?.name || 'Team B'} className="bg-gray-800 text-gray-400 font-extrabold uppercase tracking-wider">
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
                                    disabled={!selectedMOM || isSubmitting}
                                    className="h-9 w-full md:w-auto px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm whitespace-nowrap min-w-[140px]"
                                >
                                    {isSubmitting ? 'Saving...' : (
                                        <>
                                            <Check size={14} /> Submit Result
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};



