import { useState } from "react";
import { useScore } from "@/context";

type BallOutcome = {
  label: string;
  value: string;
  ballType: string;
  color: string;
  hoverColor: string;
  description: string;
};

const ballOutcomes: BallOutcome[] = [
  { label: "0", value: "0", ballType: "NORMAL", color: "bg-gray-500", hoverColor: "hover:bg-gray-600", description: "Dot Ball" },
  { label: "1", value: "1", ballType: "NORMAL", color: "bg-green-500", hoverColor: "hover:bg-green-600", description: "Single" },
  { label: "2", value: "2", ballType: "NORMAL", color: "bg-green-600", hoverColor: "hover:bg-green-700", description: "Two Runs" },
  { label: "3", value: "3", ballType: "NORMAL", color: "bg-green-700", hoverColor: "hover:bg-green-800", description: "Three Runs" },
  { label: "4", value: "4", ballType: "NORMAL", color: "bg-blue-500", hoverColor: "hover:bg-blue-600", description: "Boundary" },
  { label: "6", value: "6", ballType: "NORMAL", color: "bg-yellow-500", hoverColor: "hover:bg-yellow-600", description: "Six" },
  { label: "W", value: "W", ballType: "WICKET", color: "bg-red-500", hoverColor: "hover:bg-red-600", description: "Wicket" },
  { label: "WD", value: "WD", ballType: "WIDE", color: "bg-pink-500", hoverColor: "hover:bg-pink-600", description: "Wide" },
  { label: "NB", value: "NB", ballType: "NO_BALL", color: "bg-purple-500", hoverColor: "hover:bg-purple-600", description: "No Ball" },
  { label: "LB", value: "LB", ballType: "LEG_BYE", color: "bg-cyan-500", hoverColor: "hover:bg-cyan-600", description: "Leg Bye" },
  { label: "B", value: "B", ballType: "BYE", color: "bg-orange-500", hoverColor: "hover:bg-orange-600", description: "Bye" },
];

const BallOutcomeButtons = () => {
  const { addBallRun } = useScore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingOutcome, setPendingOutcome] = useState<BallOutcome | null>(null);
  const [runs, setRuns] = useState("0");

  const handleOutcomeClick = (outcome: BallOutcome) => {
    setPendingOutcome(outcome);
    if (["1", "2", "3", "4", "6"].includes(outcome.value)) {
      setRuns(outcome.value);
    } else {
      setRuns("0");
    }
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (!pendingOutcome) return;
    
    const payload = {
      ball_type: pendingOutcome.ballType,
      batsman_id: 1,
      bowler_id: 13,
      is_boundary: ["4", "6"].includes(pendingOutcome.value),
      is_wicket: pendingOutcome.value === "W",
      runs: parseInt(runs) || 0
    };
    
    console.log("Ball Payload:", payload);
    // TODO: await ballService.recordBall(payload);
    
    addBallRun(pendingOutcome.value);
    setShowConfirmModal(false);
    setPendingOutcome(null);
    setRuns("0");
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setPendingOutcome(null);
    setRuns("0");
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Ball Outcome here
        </h3>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {ballOutcomes.map((outcome) => (
            <button
              key={outcome.value}
              onClick={() => handleOutcomeClick(outcome)}
              className={`relative group ${outcome.color} ${outcome.hoverColor} text-white rounded-xl p-4 transition-all transform hover:scale-105 active:scale-95 shadow-lg`}
            >
              <div className="text-2xl font-bold mb-1">{outcome.label} -1</div>
              <div className="text-xs opacity-90">{outcome.description}</div>
              
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {outcome.description}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl p-4 font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg">
            Undo Last Ball
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-4 font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg">
            End Over
          </button>
        </div>
      </div>

      {showConfirmModal && pendingOutcome && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Ball Outcome</h2>
            
            <div className="mb-4">
              <div className={`${pendingOutcome.color} text-white rounded-xl p-4 text-center`}>
                <div className="text-3xl font-bold mb-1">{pendingOutcome.label}</div>
                <div className="text-sm">{pendingOutcome.description}</div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Runs</label>
              <input
                type="number"
                min="0"
                max="6"
                value={runs}
                onChange={(e) => setRuns(e.target.value)}
                placeholder="Enter runs (0-6)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {pendingOutcome.ballType === "WIDE" || pendingOutcome.ballType === "NO_BALL" 
                  ? "Additional runs by batsman or bye/leg bye"
                  : pendingOutcome.ballType === "BYE" || pendingOutcome.ballType === "LEG_BYE"
                  ? "Runs scored as " + pendingOutcome.description.toLowerCase()
                  : "Runs scored by batsman"}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BallOutcomeButtons;
