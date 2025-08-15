// File: src/components/ScoreEditor/BattingList.tsx
import React, { useState } from "react";
import BattingRow from "./BattingRow";

interface Batter {
  name: string;
  runs: number;
  balls: number;
  isStriker: boolean;
  status?: string;
}

interface BattingListProps {
  batters: Batter[];
  teamName: string;
  initialMode: "normal" | "hidden" | "grow";
}

const BattingList: React.FC<BattingListProps> = ({ batters, teamName, initialMode }) => {
  const [mode, setMode] = useState(initialMode);

  const toggleMode = () => {
    setMode((prev) => (prev === "grow" ? "normal" : "grow"));
  };

  const visibleBatters = mode === "grow"
    ? batters
    : mode === "normal"
    ? batters
        .filter((_, index) => index < 2)
        .sort((a, b) => (b.isStriker ? 1 : 0) - (a.isStriker ? 1 : 0))
    : [];

  return (
    <div id="BattingList" className="w-full max-w-md mx-auto p-2 bg-white dark:bg-gray-800 rounded-md shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold dark:text-white text-gray-800">{teamName} Batting</h2>
        <button
          onClick={toggleMode}
          className="text-sm text-blue-500 hover:underline"
        >
          {mode === "grow" ? "Collapse" : "Expand"}
        </button>
      </div>
      {mode !== "hidden" ? (
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 dark:text-gray-300">
            <tr>
              <th className="p-1">Batter</th>
              <th className="p-1 text-right">R</th>
              <th className="p-1 text-right">B</th>
              <th className="p-1 text-right">SR</th>
            </tr>
          </thead>
          <tbody>
            {visibleBatters.map((batter, idx) => (
              <BattingRow key={idx} batter={batter} />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={toggleMode}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Show {teamName} Batting
          </button>
        </div>
      )}
    </div>
  );
};

export default BattingList;