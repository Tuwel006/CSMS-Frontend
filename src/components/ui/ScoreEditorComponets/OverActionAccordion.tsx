import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import ConfirmDialog from "../ConfirmDialog";

type BallOption = {
  label: string;
  color: string; // Tailwind class
};

const ballOptions: BallOption[] = [
  { label: "0", color: "bg-gray-500" },
  { label: "1", color: "bg-green-500" },
  { label: "2", color: "bg-green-600" },
  { label: "3", color: "bg-green-700" },
  { label: "4", color: "bg-blue-500" },
  { label: "6", color: "bg-yellow-500" },
  { label: "W", color: "bg-red-500" },
  { label: "NB", color: "bg-purple-500" },
  { label: "WD", color: "bg-pink-500" },
  { label: "LB", color: "bg-cyan-500" },
  { label: "B", color: "bg-orange-500" },
];

const OverOptionsAccordion = () => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState<boolean>(true);
  const [selected, setSelected] = useState<BallOption | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleOptionClick = (option: BallOption) => {
    setSelected(option);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (selected) {
      console.log("Confirmed selection:", selected);
      // You can emit/save to DB here
    }
    setShowConfirm(false);
    setSelected(null);
  };

  return (
    <div className={`rounded-xl shadow-md p-4 my-4 transition-all ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
      <button
        className="w-full flex justify-between items-center text-lg font-semibold mb-2"
        onClick={() => setExpanded(!expanded)}
      >
        Over Options
        <span>{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {ballOptions.map((option) => (
            <button
              key={option.label}
              className={`rounded py-2 font-semibold text-white transition-colors ${option.color} hover:scale-105`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {showConfirm && selected && (
        <ConfirmDialog
          message={`Are you sure you want to select "${selected.label}"?`}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default OverOptionsAccordion;
