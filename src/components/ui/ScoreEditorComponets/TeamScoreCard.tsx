// File: src/components/ScoreEditor/TeamScoreCard.tsx
import { useScore } from "@/context";

const TeamScoreCard = () => {
  const {
    battingTeam,
    opponentTeam,
    battingScore,
    battingWickets,
    battingOvers,
    totalOvers,
    chasing,
    targetScore,
    runRate,
    requiredRate,
  } = useScore();

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-4 rounded-sm shadow-sm w-full">
      <div className="flex justify-between items-start text-lg font-bold text-[var(--text)]">
        <div className="text-left space-y-1 uppercase tracking-tight">
          <div>{battingTeam}</div>
          <div className="text-xl font-bold text-cyan-600">{battingScore}/{battingWickets} <span className="text-[10px] text-[var(--text-secondary)] font-bold">{battingOvers} OVERS</span></div>
        </div>
        <div className="text-right space-y-1">
          <div className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest leading-none">{opponentTeam}</div>
          <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Match: {totalOvers} overs</div>
        </div>
      </div>
      {chasing && (
        <div className="mt-3 p-2 bg-cyan-600/10 border border-cyan-500/20 text-cyan-500 rounded-sm text-[10px] font-bold uppercase tracking-widest text-center">
          Need {targetScore - battingScore} runs to win
        </div>
      )}
      <div className="mt-3 pt-3 border-t border-[var(--card-border)] flex gap-4 text-[10px] font-bold uppercase tracking-widest">
        <span className="text-emerald-500">CRR: {runRate}</span>
        {chasing && <span className="text-cyan-500">RRR: {requiredRate}</span>}
      </div>
    </div>
  );
};

export default TeamScoreCard;