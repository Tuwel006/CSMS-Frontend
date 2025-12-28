import React from "react";
import { ScoreProvider } from "@/context";
import CurrentScoreCard from "@/components/ui/ScoreEditorComponets/CurrentScoreCard";
import BattingManagement from "@/components/ui/ScoreEditorComponets/BattingManagement";
import OverManagement from "@/components/ui/ScoreEditorComponets/OverManagement";
import BallOutcomeButtons from "@/components/ui/ScoreEditorComponets/BallOutcomeButtons";

const ScoreEditorNew: React.FC = () => {
  return (
    <ScoreProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Top Score Display */}
          <CurrentScoreCard />

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Side - Batting Management (2 columns) */}
            <div className="lg:col-span-2 space-y-4">
              <BattingManagement />
              <BallOutcomeButtons />
            </div>

            {/* Right Side - Over Management (1 column) */}
            <div className="lg:col-span-1">
              <OverManagement />
            </div>
          </div>
        </div>
      </div>
    </ScoreProvider>
  );
};

export default ScoreEditorNew;
