import React from "react";
import MatchCard from "../ScoreCard";
import { type Match } from "@/context/CurrentMatchContext";
interface Props {
  matches: Match[];
}

const MatchSlider: React.FC<Props> = ({ matches }) => {
  return (
    <div className="relative">
      {/* Horizontal Scroll Belt */}
      <div className="flex space-x-4 overflow-x-auto p-4 scrollbar-hide">
        {matches.map((match, idx) => (
          <MatchCard key={idx} match={match as any} />
        ))}
      </div>

      {/* Right Arrow */}
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-500 text-white rounded-full p-2 opacity-90 hover:opacity-100"
        onClick={() => {
          const container = document.querySelector('.scrollbar-hide');
          if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
        }}
      >
        ➔
      </button>
    </div>
  );
};

export default MatchSlider;
