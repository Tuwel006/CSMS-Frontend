import React, { useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import { Activity, Trophy, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { CompleteMatchPayload } from '../../../types/matchService';

interface InningsCompleteModalProps {
    isOpen: boolean | undefined;
    currentInnings: any;
    teams: any;
    matchData?: any;
    onStartNext: (isFollowOn: boolean) => void;
    onCompleteMatch?: (payload: CompleteMatchPayload) => void;
    onViewScorecard: () => void;
}

const InningsCompleteModal: React.FC<InningsCompleteModalProps> = ({
    isOpen,
    currentInnings,
    teams,
    matchData,
    onStartNext,
    onCompleteMatch,
    onViewScorecard,
}) => {
    const [isFollowOn, setIsFollowOn] = useState(false);
    const [view, setView] = useState<'summary' | 'complete'>('summary');

    // Complete Match Form State
    const [useDefaultResult, setUseDefaultResult] = useState(true);
    const [winnerTeamId, setWinnerTeamId] = useState<number | undefined>(undefined);
    const [manOfMatchId, setManOfMatchId] = useState<number | undefined>(undefined);
    const [resultDescription, setResultDescription] = useState('');

    if (!isOpen) return null;

    const battingTeam = teams?.[currentInnings?.battingTeam];
    const bowlingTeam = teams?.[currentInnings?.bowlingTeam];
    const score = currentInnings?.score;

    // Check if this is the 2nd innings complete (starting 3rd innings)
    const isSecondInningsComplete = useMemo(() => {
        const inningsCount = matchData?.innings?.length || 0;
        const currentInningsNumber = currentInnings?.innings_number || currentInnings?.i || 0;
        return inningsCount === 2 || currentInningsNumber === 2;
    }, [matchData?.innings, currentInnings]);

    const oversDisplay = useMemo(() => {
        const balls = score?.b || 0;
        return `${Math.floor(balls / 6)}.${balls % 6}`;
    }, [score?.b]);

    const runRate = useMemo(() => {
        const balls = score?.b || 0;
        if (!balls) return '0.00';
        return (score.r / (balls / 6)).toFixed(2);
    }, [score?.r, score?.b]);

    const notOutBatsmen = useMemo(() => {
        return [
            currentInnings?.batting?.striker,
            currentInnings?.batting?.nonStriker
        ].filter(Boolean);
    }, [currentInnings]);

    const allPlayers = useMemo(() => {
        if (!matchData?.teams) return [];
        const teamAPlayers = matchData.teams.A?.players || [];
        const teamBPlayers = matchData.teams.B?.players || [];
        return [...teamAPlayers, ...teamBPlayers];
    }, [matchData?.teams]);

    const handleSubmitComplete = () => {
        if (onCompleteMatch) {
            const payload: CompleteMatchPayload = {
                default: useDefaultResult,
                // Only include other fields if default is false
                ...(!useDefaultResult && {
                    winner_team_id: winnerTeamId,
                    man_of_the_match_player_id: manOfMatchId,
                    result_description: resultDescription
                })
            };
            onCompleteMatch(payload);
        }
    };

    return (
        <>
            {/* Overlay bound to page area - No Blur */}
            <div
                className="absolute inset-0 bg-black/10 dark:bg-black/50 z-20 pointer-events-auto"
                aria-hidden="true"
                onClick={() => { /* Prevent click through */ }}
            />

            <div className="fixed inset-x-0 bottom-16 lg:bottom-0 z-40 flex justify-center pointer-events-none">
                <div className="bg-[var(--card-bg)] w-full max-w-[400px] rounded-t-2xl rounded-b-none shadow-[0_-8px_30px_rgba(0,0,0,0.3)] border-t border-x border-[var(--card-border)] pointer-events-auto flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">

                    {/* Header */}
                    <div className="px-4 py-3 bg-emerald-500/5 border-b border-[var(--card-border)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {view === 'complete' && (
                                <button onClick={() => setView('summary')} className="mr-2 text-gray-500">
                                    <ArrowLeft size={16} />
                                </button>
                            )}
                            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                                <Activity size={14} className="text-white" />
                            </div>
                            <h2 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest text-emerald-600">
                                {view === 'complete' ? 'Complete Match' : `Innings ${currentInnings?.innings_number || 1}`}
                            </h2>
                        </div>
                        {view === 'summary' && (
                            <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded uppercase">Innings End</span>
                        )}
                        {view === 'complete' && (
                            <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded uppercase">Finalize</span>
                        )}
                    </div>

                    {view === 'summary' ? (
                        /* SUMMARY VIEW */
                        <div className="p-4 space-y-4">
                            {/* Teams */}
                            <div className="grid grid-cols-7 items-center text-center">
                                <div className="col-span-3">
                                    <p className="text-[7px] font-bold text-gray-500 uppercase mb-0.5">Batting</p>
                                    <p className="text-[11px] font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">
                                        {currentInnings?.battingTeam || battingTeam?.name || '---'}
                                    </p>
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <div className="text-[8px] font-black text-gray-300 italic">VS</div>
                                </div>
                                <div className="col-span-3">
                                    <p className="text-[7px] font-bold text-gray-500 uppercase mb-0.5">Bowling</p>
                                    <p className="text-[11px] font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">
                                        {currentInnings?.bowlingTeam || bowlingTeam?.name || '---'}
                                    </p>
                                </div>
                            </div>

                            {/* Centered Score */}
                            <div className="text-center py-1">
                                <div className="flex items-baseline justify-center gap-1.5 font-black tracking-tighter">
                                    <span className="text-4xl text-gray-900 dark:text-white">
                                        {score?.r || 0}
                                    </span>
                                    <span className="text-2xl text-gray-300">/</span>
                                    <span className="text-4xl text-emerald-500">
                                        {score?.w || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center gap-2 mt-1 text-[10px] font-bold text-gray-500">
                                    <span>{oversDisplay} OVERS</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span className="text-emerald-600">CRR {runRate}</span>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 dark:bg-gray-800/40 p-2 rounded-xl border border-[var(--card-border)] flex flex-col items-center">
                                    <span className="text-[7px] font-black text-gray-400 uppercase">Total Balls</span>
                                    <span className="text-sm font-black text-gray-900 dark:text-white">{score?.b || 0}</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/40 p-2 rounded-xl border border-[var(--card-border)] flex flex-col items-center">
                                    <span className="text-[7px] font-black text-gray-400 uppercase">Extras</span>
                                    <span className="text-sm font-black text-gray-900 dark:text-white">{currentInnings?.extras || 0}</span>
                                </div>
                            </div>

                            {/* Batsmen In-Crease */}
                            {notOutBatsmen.length > 0 && (
                                <div className="space-y-1.5 border-t border-[var(--card-border)] pt-3">
                                    {notOutBatsmen.map((batsman, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-[10px] font-black uppercase">
                                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="truncate max-w-[140px]">{batsman.n}*</span>
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-emerald-600">{batsman.r}</span>
                                                <span className="text-[7px] opacity-40">({batsman.b})</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Follow-on Switch - Only show when 2nd innings is complete */}
                            {isSecondInningsComplete && (
                                <div className="border-t border-[var(--card-border)] pt-3 space-y-2">
                                    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-200 dark:border-blue-800">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                                Follow-on
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsFollowOn(!isFollowOn)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isFollowOn ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFollowOn ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex flex-col gap-2 pt-2">
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => onStartNext(isFollowOn)}
                                        className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] rounded-xl uppercase tracking-widest"
                                    >
                                        CONTINUE NEXT
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={onViewScorecard}
                                        className="flex-1 h-10 border border-[var(--card-border)] font-black text-[9px] text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 uppercase tracking-widest"
                                    >
                                        SCORECARD
                                    </Button>
                                </div>

                                {/* Complete Match Option */}
                                {onCompleteMatch && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => setView('complete')}
                                        className="w-full h-8 text-[8px] text-gray-400 hover:text-gray-600 hover:bg-gray-50 uppercase tracking-wider border border-dashed border-gray-200"
                                    >
                                        End Match Now...
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* COMPLETE MATCH VIEW */
                        <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto">

                            {/* Toggle Default Result */}
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-[var(--card-border)]">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-900 dark:text-white uppercase">Auto-Calculate Result</p>
                                    <p className="text-[8px] text-gray-500">System determines winner</p>
                                </div>
                                <button
                                    onClick={() => setUseDefaultResult(!useDefaultResult)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${useDefaultResult ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useDefaultResult ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            {!useDefaultResult && (
                                <div className="space-y-4 bg-gray-50/50 dark:bg-gray-800/10 p-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                    <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest text-center border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                                        Manual Result Details
                                    </div>

                                    {/* Winner Select */}
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-gray-500 uppercase ml-1">Winner</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setWinnerTeamId(matchData?.teams?.A?.id)}
                                                className={`p-3 rounded-xl border text-[10px] font-bold transition-all ${winnerTeamId === matchData?.teams?.A?.id ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500' : 'bg-white dark:bg-gray-800 border-[var(--card-border)] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                            >
                                                {matchData?.teams?.A?.name || 'Team A'}
                                            </button>
                                            <button
                                                onClick={() => setWinnerTeamId(matchData?.teams?.B?.id)}
                                                className={`p-3 rounded-xl border text-[10px] font-bold transition-all ${winnerTeamId === matchData?.teams?.B?.id ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500' : 'bg-white dark:bg-gray-800 border-[var(--card-border)] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                            >
                                                {matchData?.teams?.B?.name || 'Team B'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Man of Match Select */}
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-gray-500 uppercase ml-1">Player of the Match</label>
                                        <select
                                            className="w-full p-2.5 rounded-xl border border-[var(--card-border)] bg-white dark:bg-gray-900 text-[10px] font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                            value={manOfMatchId || ''}
                                            onChange={(e) => setManOfMatchId(e.target.value ? Number(e.target.value) : undefined)}
                                        >
                                            <option value="">Select Player</option>
                                            {allPlayers.map((player: any) => (
                                                <option key={player.id} value={player.id}>{player.name} ({player.role})</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Result Description */}
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-gray-500 uppercase ml-1">Result Description</label>
                                        <textarea
                                            value={resultDescription}
                                            onChange={(e) => setResultDescription(e.target.value)}
                                            placeholder="e.g. Team A won by 20 runs"
                                            className="w-full p-3 rounded-xl border border-[var(--card-border)] bg-white dark:bg-gray-900 text-[10px] min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                            )}

                            <Button
                                onClick={handleSubmitComplete}
                                className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] rounded-xl uppercase tracking-widest mt-4"
                            >
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 size={12} />
                                    CONFIRM COMPLETION
                                </span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default InningsCompleteModal;
