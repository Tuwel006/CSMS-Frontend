// File: src/components/ScoreEditor/BattingRow.tsx
import React from "react";

interface BattingRowProps {
  batter: {
    name: string;
    runs: number;
    balls: number;
    isStriker: boolean;
    status?: string;
  };
}

const BattingRow: React.FC<BattingRowProps> = ({ batter }) => {
  return (
    <tr id="BattingRow" className="border-t border-gray-200 dark:border-gray-700">
      <td className="p-1">
        {batter.name} {batter.isStriker && <span className="text-blue-500">*</span>}
        {batter.status && (
          <div className="text-xs text-gray-500 dark:text-gray-400">{batter.status}</div>
        )}
      </td>
      <td className="p-1 text-right">{batter.runs}</td>
      <td className="p-1 text-right">{batter.balls}</td>
      <td className="p-1 text-right">
        {batter.balls > 0 ? ((batter.runs * 100) / batter.balls).toFixed(1) : "-"}
      </td>
    </tr>
  );
};

export default BattingRow;
