import { useScore } from "@/context";
import { TrendingUp, Target } from "lucide-react";

const CurrentScoreCard = () => {
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

  const remainingRuns = chasing ? targetScore - battingScore : 0;
  const remainingBalls = (totalOvers - battingOvers) * 6;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-2xl shadow-2xl p-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Score */}
        <div className="md:col-span-2">
          <div className="flex items-baseline gap-4">
            <div>
              <h2 className="text-sm font-medium opacity-90">{battingTeam}</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold">{battingScore}</span>
                <span className="text-3xl font-semibold">/{battingWickets}</span>
              </div>
              <p className="text-lg mt-1 opacity-90">
                Overs: {battingOvers.toFixed(1)} / {totalOvers}
              </p>
            </div>
          </div>

          {chasing && (
            <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target size={20} />
                <span className="font-semibold">Target: {targetScore}</span>
              </div>
              <p className="text-2xl font-bold">
                Need {remainingRuns} runs from {remainingBalls} balls
              </p>
            </div>
          )}
        </div>

        {/* Run Rates */}
        <div className="space-y-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={18} />
              <span className="text-sm opacity-90">Current Run Rate</span>
            </div>
            <p className="text-3xl font-bold">{runRate}</p>
          </div>

          {chasing && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={18} />
                <span className="text-sm opacity-90">Required Run Rate</span>
              </div>
              <p className="text-3xl font-bold">{requiredRate}</p>
            </div>
          )}

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-sm opacity-90">vs</p>
            <p className="font-semibold">{opponentTeam}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentScoreCard;
