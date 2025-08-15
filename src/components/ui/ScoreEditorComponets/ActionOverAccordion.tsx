// File: src/components/ScoreEditor/ActionOverAccordion.tsx
import React from "react";

interface ActionOverAccordionProps {
  onSelectRun: (run: string) => void;
  onCancel: () => void;
}

const runOptions = ["0", "1", "2", "3", "4", "6", "W", "w"];

const ActionOverAccordion: React.FC<ActionOverAccordionProps> = ({ onSelectRun, onCancel }) => {
  return (
    <div className="p-4 rounded-md shadow-md border bg-white dark:bg-gray-900 dark:text-white w-full max-w-sm mx-auto">
      <h3 className="font-bold text-lg mb-2">Select Ball Outcome</h3>
      <div className="grid grid-cols-4 gap-2">
        {runOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelectRun(opt)}
            className="py-1 px-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {opt}
          </button>
        ))}
      </div>
      <button
        onClick={onCancel}
        className="mt-4 text-sm text-red-500 hover:underline"
      >
        Cancel
      </button>
    </div>
  );
};

export default ActionOverAccordion;