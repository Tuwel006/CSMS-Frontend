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
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md w-full">
      <div className="flex justify-between items-start text-lg font-semibold">
        <div className="text-left space-y-1">
          <div>{battingTeam} (Batting)</div>
          <div>{battingScore}/{battingWickets} in {battingOvers} overs</div>
        </div>
        <div className="text-right space-y-1">
          <div>{opponentTeam} (Not Batting)</div>
          <div>Match: {totalOvers} overs</div>
        </div>
      </div>
      {chasing && (
        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-md text-sm font-medium">
          Need {targetScore - battingScore} runs to win
        </div>
      )}
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        <span>CRR: {runRate}</span>
        {chasing && <span className="ml-4">RRR: {requiredRate}</span>}
      </div>
    </div>
  );
};

export default TeamScoreCard;