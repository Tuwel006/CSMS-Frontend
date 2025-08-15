// File: src/components/ScoreEditor/over/BallSelector.tsx
interface Props {
  onSelect: (ball: string) => void;
}

const ballTypes = ["0", "1", "2", "3", "4", "6", "W", "NB", "WD", "LB", "B"];

const BallSelector: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
      {ballTypes.map((ball, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(ball)}
          className="py-1 px-2 rounded text-white text-sm font-bold bg-blue-600 hover:bg-blue-700"
        >
          {ball}
        </button>
      ))}
    </div>
  );
};

export default BallSelector;