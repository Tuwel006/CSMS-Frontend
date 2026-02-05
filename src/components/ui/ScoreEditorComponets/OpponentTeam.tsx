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
    <div className="rounded-sm p-4 border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm">
      <button
        onClick={() => setVisible(!visible)}
        className="mb-3 text-[10px] font-bold uppercase tracking-widest text-cyan-600 hover:text-cyan-700 transition-colors"
      >
        {visible ? "Hide" : "Show"} Opponent Team
      </button>
      {visible && (
        <ul className="space-y-1.5">
          {opponents.map((player, index) => (
            <li
              key={index}
              className="px-3 py-1.5 rounded-sm bg-[var(--hover-bg)] border border-[var(--card-border)] flex justify-between items-center text-[11px] font-bold text-[var(--text)] uppercase tracking-tight"
            >
              <span>{player.name}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-xs tracking-widest ${player.out ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                {player.out ? "OUT" : "NOT OUT"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OpponentTeam;