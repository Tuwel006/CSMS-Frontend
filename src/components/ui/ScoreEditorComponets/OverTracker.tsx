import { useState } from "react";
import { useScore } from "@/context/ScoreContext";
import OverBallBubble from "./OverBallBubble";
import OverActionAccordion from "./OverActionAccordion";
const OverTracker = () => {
  const { overs, addBallRun, editBallRun } = useScore();
  const [activeOverIndex, setActiveOverIndex] = useState(overs.length - 1);
  const [showAction, setShowAction] = useState(false);
  const [selectedBallIndex, setSelectedBallIndex] = useState<number | null>(null);

  const currentOver = overs[activeOverIndex] || [];
  const nextBallIndex = currentOver.length; // index of next ball to be added

  const handleSelectBall = (index: number) => {
    setSelectedBallIndex(index);
    setShowAction(true);
  };

  const handleRunSelect = (run: string) => {
    if (selectedBallIndex !== null) {
      if (selectedBallIndex < currentOver.length) {
        // Edit existing ball
        editBallRun(activeOverIndex, selectedBallIndex, run);
      } else if (selectedBallIndex === currentOver.length) {
        // Add new ball
        addBallRun(run);
      }
    }
    setShowAction(false);
    setSelectedBallIndex(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center overflow-x-auto">
        {Array.from({ length: 6 }).map((_, idx) => {
          const run = currentOver[idx];
          const isPlayed = idx < currentOver.length;
          const isCurrent = idx === currentOver.length;
          const isFuture = idx > currentOver.length;

          return (
            <OverBallBubble
              key={idx}
              run={run}
              isActive={isPlayed || isCurrent}
              isFuture={isFuture}
              onClick={() => handleSelectBall(idx)}
            />
          );
        })}
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
        <span>
          Over {activeOverIndex + 1} of {overs.length}
        </span>
        <button
          onClick={() =>
            setActiveOverIndex(
              activeOverIndex === overs.length - 1 ? 0 : activeOverIndex + 1
            )
          }
          className="text-blue-500 hover:underline"
        >
          {activeOverIndex === overs.length - 1 ? "Go to first over" : "Next over"}
        </button>
      </div>

      {showAction && (
        <OverActionAccordion
        
        />
      )}
    </div>
  );
};

export default OverTracker;
