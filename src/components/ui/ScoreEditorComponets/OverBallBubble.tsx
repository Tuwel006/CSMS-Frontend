import React from "react";

interface OverBallBubbleProps {
  run?: string;
  onClick: () => void;
  isActive: boolean;
  isFuture: boolean;
}

const getBubbleColor = (isFuture: boolean, run?: string) => {
  if (isFuture === true) return "bg-gray-300 dark:bg-gray-700";
  switch (run) {
    case "W": return "bg-red-600";
    case "w": return "bg-gray-500";
    case "0": return "bg-gray-700";
    default: return "bg-blue-500";
  }
};

const OverBallBubble: React.FC<OverBallBubbleProps> = ({ run, onClick, isActive, isFuture=true }) => {
  return (
    <button
      onClick={isActive ? onClick : undefined}
      className={`w-8 h-8 flex items-center justify-center text-sm rounded-full text-white
        ${getBubbleColor(isFuture, run)}
        ${isActive ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}
      `}
      disabled={!isActive}
    >
      {run || "+"}
    </button>
  );
};

export default OverBallBubble;
