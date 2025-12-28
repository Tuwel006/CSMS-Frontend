// File: src/context/ScoreContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

interface BallEntry {
  value: string;
  editable: boolean;
}

interface Batsman {
  name: string;
  runs: number;
  balls: number;
  striker: boolean;
}

interface ScoreState {
  battingTeam: string;
  opponentTeam: string;
  battingScore: number;
  battingWickets: number;
  battingOvers: number;
  totalOvers: number;
  chasing: boolean;
  targetScore: number;
  runRate: number;
  requiredRate: number;
  overBalls: BallEntry[];
  overs: string[][];
  batsmen: Batsman[];
  updateBall: (ball: string) => void;
  addBallRun: (run: string) => void;
  editBallRun: (overIndex: number, ballIndex: number, run: string) => void;
}

const ScoreContext = createContext<ScoreState | undefined>(undefined);

export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  const [battingTeam] = useState("India");
  const [opponentTeam] = useState("Australia");
  const [battingScore, setBattingScore] = useState(145);
  const [battingWickets, setBattingWickets] = useState(3);
  const [battingOvers] = useState(17.4);
  const [totalOvers] = useState(20);
  const [chasing] = useState(true);
  const [targetScore] = useState(175);
  const [overBalls, setOverBalls] = useState<BallEntry[]>([]);
  const [overs, setOvers] = useState<string[][]>([[]]);
  const [batsmen, setBatsmen] = useState<Batsman[]>([
    { name: "Player A", runs: 45, balls: 32, striker: true },
    { name: "Player B", runs: 28, balls: 21, striker: false },
    { name: "Player C", runs: 0, balls: 0, striker: false },
  ]);

  const runRate = +(battingScore / battingOvers).toFixed(2);
  const requiredRate = chasing
    ? +(((targetScore - battingScore) / (totalOvers - battingOvers)).toFixed(2))
    : 0;

  const updateBall = (value: string) => {
    const ballEntry = { value, editable: true };
    setOverBalls((prev) => [...prev, ballEntry]);

    const run = parseInt(value);
    if (!isNaN(run)) {
      setBattingScore((prev) => prev + run);
      setBatsmen((prev) => {
        const updated = [...prev];
        const strikerIdx = updated.findIndex((b) => b.striker);
        updated[strikerIdx].runs += run;
        updated[strikerIdx].balls += 1;

        if (run % 2 === 1) {
          updated.forEach((b) => (b.striker = !b.striker));
        }
        return updated;
      });
    }
  };

  const addBallRun = (run: string) => {
    setOvers((prev) => {
      const copy = [...prev];
      const currentOver = copy[copy.length - 1];

      currentOver.push(run);

      // If 6 legal deliveries (not wide or no-ball), start a new over
      const legalBalls = currentOver.filter((r) => r !== "w" && r !== "nb").length;
      if (legalBalls >= 6) {
        copy.push([]);
      }

      return copy;
    });

    if (run === "W") {
      setBattingWickets((prev) => prev + 1);
    }

    const runValue = parseInt(run);
    if (!isNaN(runValue)) {
      setBattingScore((prev) => prev + runValue);
      setBatsmen((prev) => {
        const updated = [...prev];
        const strikerIdx = updated.findIndex((b) => b.striker);
        updated[strikerIdx].runs += runValue;
        updated[strikerIdx].balls += 1;

        if (runValue % 2 === 1) {
          updated.forEach((b) => (b.striker = !b.striker));
        }

        return updated;
      });
    }
  };

  const editBallRun = (overIndex: number, ballIndex: number, newRun: string) => {
    setOvers((prev) => {
      const updated = [...prev];
      updated[overIndex][ballIndex] = newRun;
      return updated;
    });
  };

  return (
    <ScoreContext.Provider
      value={{
        battingTeam,
        opponentTeam,
        battingScore,
        battingWickets,
        battingOvers,
        totalOvers,
        chasing,
        targetScore,
        runRate,
        requiredRate,
        overBalls,
        overs,
        batsmen,
        updateBall,
        addBallRun,
        editBallRun,
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => {
  const ctx = useContext(ScoreContext);
  if (!ctx) throw new Error("useScore must be used inside ScoreProvider");
  return ctx;
};
