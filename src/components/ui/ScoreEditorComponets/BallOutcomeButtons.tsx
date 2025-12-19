import { useState } from "react";
import { useScore } from "@/context";

type BallOutcome = {
  label: string;
  value: string;
  color: string;
  hoverColor: string;
  description: string;
};

const ballOutcomes: BallOutcome[] = [
  { label: "0", value: "0", color: "bg-gray-500", hoverColor: "hover:bg-gray-600", description: "Dot Ball" },
  { label: "1", value: "1", color: "bg-green-500", hoverColor: "hover:bg-green-600", description: "Single" },
  { label: "2", value: "2", color: "bg-green-600", hoverColor: "hover:bg-green-700", description: "Two Runs" },
  { label: "3", value: "3", color: "bg-green-700", hoverColor: "hover:bg-green-800", description: "Three Runs" },
  { label: "4", value: "4", color: "bg-blue-500", hoverColor: "hover:bg-blue-600", description: "Boundary" },
  { label: "6", value: "6", color: "bg-yellow-500", hoverColor: "hover:bg-yellow-600", description: "Six" },
  { label: "W", value: "W", color: "bg-red-500", hoverColor: "hover:bg-red-600", description: "Wicket" },
  { label: "WD", value: "WD", color: "bg-pink-500", hoverColor: "hover:bg-pink-600", description: "Wide" },
  { label: "NB", value: "NB", color: "bg-purple-500", hoverColor: "hover:bg-purple-600", description: "No Ball" },
  { label: "LB", value: "LB", color: "bg-cyan-500", hoverColor: "hover:bg-cyan-600", description: "Leg Bye" },
  { label: "B", value: "B", color: "bg-orange-500", hoverColor: "hover:bg-orange-600", description: "Bye" },
];

const BallOutcomeButtons = () => {
  const { addBallRun } = useScore();
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);

  const handleOutcomeClick = (outcome: BallOutcome) => {
    setSelectedOutcome(outcome.value);
    addBallRun(outcome.value);
    
    // Visual feedback
    setTimeout(() => setSelectedOutcome(null), 300);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Ball Outcome
      </h3>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {ballOutcomes.map((outcome) => (
          <button
            key={outcome.value}
            onClick={() => handleOutcomeClick(outcome)}
            className={`relative group ${outcome.color} ${outcome.hoverColor} text-white rounded-xl p-4 transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
              selectedOutcome === outcome.value ? "ring-4 ring-white scale-105" : ""
            }`}
          >
            <div className="text-2xl font-bold mb-1">{outcome.label}</div>
            <div className="text-xs opacity-90">{outcome.description}</div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {outcome.description}
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl p-4 font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg">
          Undo Last Ball
        </button>
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-4 font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg">
          End Over
        </button>
      </div>
    </div>
  );
};

export default BallOutcomeButtons;
