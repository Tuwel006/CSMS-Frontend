import { useState } from "react";
import { useScore } from "@/context";
import { ChevronDown, Activity } from "lucide-react";

const OverManagement = () => {
  const { overs } = useScore();
  const [currentBowler, setCurrentBowler] = useState<string>("");
  const [nextBowler, setNextBowler] = useState<string>("");
  const [showBowlerDropdown, setShowBowlerDropdown] = useState(false);

  const currentOver = overs[overs.length - 1] || [];
  const overNumber = overs.length;
  const ballsInOver = currentOver.filter((b) => b !== "WD" && b !== "NB").length;

  const bowlers = [
    "P. Cummins",
    "M. Starc",
    "A. Zampa",
    "J. Hazlewood",
    "G. Maxwell",
  ];

  const getBallColor = (ball: string) => {
    switch (ball) {
      case "0":
        return "bg-gray-400 text-white";
      case "1":
        return "bg-green-500 text-white";
      case "2":
        return "bg-green-600 text-white";
      case "3":
        return "bg-green-700 text-white";
      case "4":
        return "bg-blue-500 text-white";
      case "6":
        return "bg-yellow-500 text-white";
      case "W":
        return "bg-red-500 text-white";
      case "WD":
        return "bg-pink-500 text-white";
      case "NB":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  const calculateOverRuns = (over: string[]) => {
    return over.reduce((total, ball) => {
      const num = parseInt(ball);
      return total + (isNaN(num) ? 0 : num);
    }, 0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Activity size={24} className="text-blue-600 dark:text-blue-400" />
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
          Over Management
        </h3>
      </div>

      {/* Current Over Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Over {overNumber}
          </span>
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {ballsInOver}/6 balls
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2 mb-4">
          {Array.from({ length: 6 }).map((_, idx) => {
            const ball = currentOver[idx];
            const isPlayed = idx < currentOver.length;
            const isCurrent = idx === currentOver.length;

            return (
              <div
                key={idx}
                className={`aspect-square rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
                  isPlayed
                    ? getBallColor(ball)
                    : isCurrent
                    ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 text-blue-600 dark:text-blue-400 animate-pulse"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                }`}
              >
                {isPlayed ? ball : isCurrent ? "•" : ""}
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Over Runs</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {calculateOverRuns(currentOver)} runs
          </p>
        </div>
      </div>

      {/* Current Bowler */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Current Bowler
        </label>
        <div className="relative">
          <button
            onClick={() => setShowBowlerDropdown(!showBowlerDropdown)}
            className="w-full flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-xl p-4 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/30 dark:hover:to-red-900/30 transition-colors"
          >
            <span className="font-medium text-gray-800 dark:text-white">
              {currentBowler || "Select Bowler"}
            </span>
            <ChevronDown
              size={20}
              className={`text-gray-600 dark:text-gray-400 transition-transform ${
                showBowlerDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showBowlerDropdown && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              {bowlers.map((bowler, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentBowler(bowler);
                    setShowBowlerDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <p className="font-medium text-gray-800 dark:text-white">{bowler}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Next Bowler */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Next Over Bowler
        </label>
        <select
          value={nextBowler}
          onChange={(e) => setNextBowler(e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl p-3 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Next Bowler</option>
          {bowlers.map((bowler, idx) => (
            <option key={idx} value={bowler}>
              {bowler}
            </option>
          ))}
        </select>
      </div>

      {/* Recent Overs Summary */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Recent Overs
        </h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {overs
            .slice(-5)
            .reverse()
            .map((over, idx) => (
              <div
                key={idx}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Over {overs.length - idx}
                  </span>
                  <span className="text-sm font-bold text-gray-800 dark:text-white">
                    {calculateOverRuns(over)} runs
                  </span>
                </div>
                <div className="flex gap-1">
                  {over.map((ball, ballIdx) => (
                    <div
                      key={ballIdx}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${getBallColor(
                        ball
                      )}`}
                    >
                      {ball}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default OverManagement;
