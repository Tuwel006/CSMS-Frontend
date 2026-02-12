import React, { useMemo } from 'react';
import { Trophy, TrendingUp, Target, Award, X } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface MatchResultModalProps {
    isOpen: boolean;
    matchData: any;
    onClose: () => void;
}

const MatchResultModal: React.FC<MatchResultModalProps> = ({ isOpen, matchData, onClose }) => {
    if (!isOpen || !matchData) return null;

    const innings = matchData.innings || [];
    const teams = matchData.teams || {};
    const meta = matchData.meta || {};

    // Determine winner
    const winnerInfo = useMemo(() => {
        if (!meta.winner) return null;

        const winnerTeam = teams[meta.winner];
        const loserTeam = teams[meta.winner === 'teamA' ? 'teamB' : 'teamA'];

        return {
            team: winnerTeam?.name || 'Unknown',
            margin: meta.winMargin || '',
            type: meta.winType || 'runs',
            loser: loserTeam?.name || 'Unknown'
        };
    }, [meta, teams]);

    // Get highest scorer from all innings
    const highestScorer = useMemo(() => {
        let highest = { name: '', runs: 0, balls: 0, team: '', sr: 0 };

        innings.forEach((inn: any) => {
            const batsmen = [
                ...(inn.batting?.striker ? [inn.batting.striker] : []),
                ...(inn.batting?.nonStriker ? [inn.batting.nonStriker] : []),
                ...(inn.dismissed || [])
            ];

            batsmen.forEach((bat: any) => {
                if (bat && bat.r > highest.runs) {
                    highest = {
                        name: bat.n || '',
                        runs: bat.r || 0,
                        balls: bat.b || 0,
                        team: inn.battingTeam || '',
                        sr: bat.b ? parseFloat(((bat.r / bat.b) * 100).toFixed(2)) : 0
                    };
                }
            });
        });

        return highest.runs > 0 ? highest : null;
    }, [innings]);

    // Get best bowler from all innings
    const bestBowler = useMemo(() => {
        let best = { name: '', wickets: 0, runs: 0, overs: 0, team: '', economy: 0 };

        innings.forEach((inn: any) => {
            const bowlers = inn.bowling || [];

            bowlers.forEach((bowl: any) => {
                if (bowl && bowl.w > best.wickets) {
                    best = {
                        name: bowl.n || '',
                        wickets: bowl.w || 0,
                        runs: bowl.r || 0,
                        overs: bowl.o || 0,
                        team: inn.bowlingTeam || '',
                        economy: bowl.o ? parseFloat((bowl.r / bowl.o).toFixed(2)) : 0
                    };
                }
            });
        });

        return best.wickets > 0 ? best : null;
    }, [innings]);

    // Get innings summaries
    const inningsSummaries = useMemo(() => {
        return innings.map((inn: any) => ({
            team: inn.battingTeam || teams[inn.battingTeam]?.name || 'Unknown',
            runs: inn.score?.r || 0,
            wickets: inn.score?.w || 0,
            overs: inn.score?.o || 0,
            runRate: inn.runRate || '0.00',
            extras: inn.extras || 0
        }));
    }, [innings, teams]);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 pointer-events-auto animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with Trophy */}
                    <div className="relative bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-6 rounded-t-3xl">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                        >
                            <X size={18} className="text-white" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 animate-bounce">
                                <Trophy size={32} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-1">
                                Match Complete
                            </h2>
                            {winnerInfo && (
                                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <p className="text-sm font-bold text-white">
                                        {winnerInfo.team} won by {winnerInfo.margin} {winnerInfo.type}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Innings Comparison */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-3">
                                <Target size={18} className="text-blue-600" />
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                                    Innings Summary
                                </h3>
                            </div>

                            {inningsSummaries.map((inn: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                                <span className="text-xs font-black text-white">{idx + 1}</span>
                                            </div>
                                            <span className="text-sm font-black text-gray-900 dark:text-white uppercase">
                                                {inn.team}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-gray-900 dark:text-white">
                                                    {inn.runs}
                                                </span>
                                                <span className="text-xl font-black text-blue-600">/{inn.wickets}</span>
                                            </div>
                                            <p className="text-xs font-bold text-gray-500">
                                                {inn.overs} Ov • RR: {inn.runRate}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600 dark:text-gray-400 font-semibold">
                                            Extras: {inn.extras}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Player of the Match Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Highest Scorer */}
                            {highestScorer && (
                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                                            <TrendingUp size={16} className="text-white" />
                                        </div>
                                        <h4 className="text-xs font-black text-emerald-600 uppercase tracking-wider">
                                            Highest Scorer
                                        </h4>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-lg font-black text-gray-900 dark:text-white truncate">
                                            {highestScorer.name}
                                        </p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-emerald-600">
                                                {highestScorer.runs}
                                            </span>
                                            <span className="text-sm text-gray-500 font-semibold">
                                                ({highestScorer.balls})
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-600 dark:text-gray-400 font-semibold">
                                                SR: {highestScorer.sr}
                                            </span>
                                            <span className="text-emerald-600 font-bold uppercase text-[10px]">
                                                {highestScorer.team}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Best Bowler */}
                            {bestBowler && (
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-2xl border border-purple-200 dark:border-purple-800">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                                            <Award size={16} className="text-white" />
                                        </div>
                                        <h4 className="text-xs font-black text-purple-600 uppercase tracking-wider">
                                            Best Bowler
                                        </h4>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-lg font-black text-gray-900 dark:text-white truncate">
                                            {bestBowler.name}
                                        </p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-purple-600">
                                                {bestBowler.wickets}
                                            </span>
                                            <span className="text-sm text-gray-500 font-semibold">
                                                /{bestBowler.runs}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-600 dark:text-gray-400 font-semibold">
                                                Econ: {bestBowler.economy}
                                            </span>
                                            <span className="text-purple-600 font-bold uppercase text-[10px]">
                                                {bestBowler.team}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Close Button */}
                        <div className="pt-4">
                            <Button
                                onClick={onClose}
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black text-sm rounded-2xl uppercase tracking-wider shadow-lg"
                            >
                                Close Result
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MatchResultModal;
