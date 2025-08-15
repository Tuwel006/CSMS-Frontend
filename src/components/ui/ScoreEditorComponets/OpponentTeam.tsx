// File: src/components/ScoreEditor/OpponentTeam.tsx
import { useState } from "react";

const OpponentTeam = () => {
  const [visible, setVisible] = useState(false);
  const opponents = [
    { name: "Opponent A", out: true },
    { name: "Opponent B", out: true },
    { name: "Opponent C", out: false },
  ];

  return (
    <div className="rounded-xl p-4 shadow-md bg-card dark:bg-card-dark">
      <button
        onClick={() => setVisible(!visible)}
        className="mb-3 text-sm text-blue-600 dark:text-blue-300"
      >
        {visible ? "Hide" : "Show"} Opponent Team
      </button>
      {visible && (
        <ul className="space-y-1">
          {opponents.map((player, index) => (
            <li
              key={index}
              className="p-2 rounded bg-gray-100 dark:bg-gray-700 flex justify-between"
            >
              <span>{player.name}</span>
              <span>{player.out ? "Out" : "Not Out"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OpponentTeam;