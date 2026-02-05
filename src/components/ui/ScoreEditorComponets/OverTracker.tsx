import { useState } from "react";
import { useScore } from "@/context/ScoreContext";
import OverBallBubble from "./OverBallBubble";
import OverActionAccordion from "./OverActionAccordion";
const OverTracker = () => {
  const { overs } = useScore();
  const [activeOverIndex, setActiveOverIndex] = useState(overs.length - 1);
  const [showAction, setShowAction] = useState(false);

  const currentOver = overs[activeOverIndex] || [];

  const handleSelectBall = (_index: number) => {
    setShowAction(true);
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

      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] flex justify-between items-center py-2 border-y border-[var(--card-border)]">
        <span>
          Over {activeOverIndex + 1} of {overs.length}
        </span>
        <button
          onClick={() =>
            setActiveOverIndex(
              activeOverIndex === overs.length - 1 ? 0 : activeOverIndex + 1
            )
          }
          className="text-cyan-600 hover:text-cyan-700 transition-colors"
        >
          {activeOverIndex === overs.length - 1 ? "First Over" : "Next Over"}
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
