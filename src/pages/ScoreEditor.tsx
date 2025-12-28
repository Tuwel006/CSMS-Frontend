// File: src/pages/ScoreEditorPage.tsx

import BattingList from "@/components/ui/ScoreEditorComponets/BattingList";
import OpponentTeam from "@/components/ui/ScoreEditorComponets/OpponentTeam";
import OverTracker from "@/components/ui/ScoreEditorComponets/OverTracker";
import TeamScoreCard from "@/components/ui/ScoreEditorComponets/TeamScoreCard";
import BowlerList from "@/components/ui/ScoreEditorComponets/BolowerList";
import OverOptionsAccordion from "@/components/ui/ScoreEditorComponets/OverActionAccordion";
import React from "react";
import { ScoreProvider } from "@/context";


const ScoreEditor: React.FC = () => {
  const battingPlayers = [
    { name: "R. Sharma", runs: 45, balls: 32, isStriker: true, status: "Not Out" },
    { name: "V. Kohli", runs: 28, balls: 21, isStriker: false, status: "Not Out" },
    { name: "S. Iyer", runs: 10, balls: 8, isStriker: false, status: "Caught by M. Starc" },
    { name: "H. Pandya", runs: 17, balls: 10, isStriker: false, status: "Bowled by Zampa" },
    { name: "R. Jadeja", runs: 12, balls: 15, isStriker: false, status: "Not Out" },
    { name: "D. Karthik", runs: 0, balls: 0, isStriker: false },
    { name: "B. Kumar", runs: 0, balls: 0, isStriker: false },
    { name: "Y. Chahal", runs: 0, balls: 0, isStriker: false },
    { name: "M. Shami", runs: 0, balls: 0, isStriker: false },
    { name: "J. Bumrah", runs: 0, balls: 0, isStriker: false },
    { name: "K. Yadav", runs: 0, balls: 0, isStriker: false },
  ];

  const opponentPlayers = [
    { name: "D. Warner", runs: 63, balls: 41, isStriker: false, status: "Caught by R. Sharma" },
    { name: "A. Finch", runs: 35, balls: 28, isStriker: false, status: "Run Out" },
    { name: "G. Maxwell", runs: 0, balls: 0, isStriker: false },
    { name: "S. Smith", runs: 0, balls: 0, isStriker: false },
    { name: "M. Marsh", runs: 0, balls: 0, isStriker: false },
    { name: "M. Wade", runs: 0, balls: 0, isStriker: false },
    { name: "P. Cummins", runs: 0, balls: 0, isStriker: false },
    { name: "M. Starc", runs: 0, balls: 0, isStriker: false },
    { name: "A. Zampa", runs: 0, balls: 0, isStriker: false },
    { name: "J. Hazlewood", runs: 0, balls: 0, isStriker: false },
    { name: "T. Head", runs: 0, balls: 0, isStriker: false },
  ];

  return (
    <ScoreProvider>
        <div id="ScoreEditorPage" className="p-4 space-y-6 dark:bg-gray-900 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamScoreCard />
        <OpponentTeam />
      </div>

      <OverTracker />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BattingList batters={battingPlayers} teamName="India" initialMode="normal" />
        <BattingList batters={opponentPlayers} teamName="Australia" initialMode="hidden" />
      </div>

      <BowlerList />
      <OverOptionsAccordion />
    </div>
    </ScoreProvider>
  );
};

export default ScoreEditor;