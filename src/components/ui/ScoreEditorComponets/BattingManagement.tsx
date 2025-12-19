import { useState } from "react";
import { useScore } from "@/context";
import { Star, ChevronDown, UserPlus } from "lucide-react";

const BattingManagement = () => {
  const { batsmen } = useScore();
  const [nextBatsman, setNextBatsman] = useState<string>("");
  const [showNextBatsmanDropdown, setShowNextBatsmanDropdown] = useState(false);

  const activeBatsmen = batsmen.filter((b) => b.runs > 0 || b.balls > 0);
  const striker = batsmen.find((b) => b.striker);
  const nonStriker = batsmen.find((b) => !b.striker && (b.runs > 0 || b.balls > 0));
  const hasWicket = activeBatsmen.length < batsmen.length;

  const availableBatsmen = batsmen.filter(
    (b) => b.runs === 0 && b.balls === 0 && !b.striker
  );

  const calculateStrikeRate = (runs: number, balls: number) => {
    return balls > 0 ? ((runs / balls) * 100).toFixed(1) : "0.0";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
          Batting
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Star size={16} className="text-yellow-500" />
          <span>On Strike</span>
        </div>
      </div>

      {/* Current Batsmen */}
      <div className="space-y-3 mb-6">
        {striker && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star size={20} className="text-green-600 dark:text-green-400 fill-current" />
                <div>
                  <p className="font-bold text-lg text-gray-800 dark:text-white">
                    {striker.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">On Strike</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {striker.runs}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {striker.balls} balls • SR: {calculateStrikeRate(striker.runs, striker.balls)}
                </p>
              </div>
            </div>
          </div>
        )}

        {nonStriker && (
          <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg text-gray-800 dark:text-white">
                  {nonStriker.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Non-Striker</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {nonStriker.runs}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {nonStriker.balls} balls • SR: {calculateStrikeRate(nonStriker.runs, nonStriker.balls)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Next Batsman Selection */}
      {hasWicket && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Next Batsman
          </label>
          <div className="relative">
            <button
              onClick={() => setShowNextBatsmanDropdown(!showNextBatsmanDropdown)}
              className="w-full flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-xl p-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <UserPlus size={20} className="text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-gray-800 dark:text-white">
                  {nextBatsman || "Select Next Batsman"}
                </span>
              </div>
              <ChevronDown
                size={20}
                className={`text-gray-600 dark:text-gray-400 transition-transform ${
                  showNextBatsmanDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showNextBatsmanDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                {availableBatsmen.map((batsman, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setNextBatsman(batsman.name);
                      setShowNextBatsmanDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <p className="font-medium text-gray-800 dark:text-white">
                      {batsman.name}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Partnership Info */}
      {striker && nonStriker && (
        <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-1">
            Current Partnership
          </p>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
            {striker.runs + nonStriker.runs} runs
          </p>
          <p className="text-sm text-purple-700 dark:text-purple-400">
            {striker.balls + nonStriker.balls} balls
          </p>
        </div>
      )}
    </div>
  );
};

export default BattingManagement;
