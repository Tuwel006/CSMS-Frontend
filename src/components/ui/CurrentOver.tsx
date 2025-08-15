// File: src/components/ScoreEditor/over/CurrentOver.tsx
interface Props {
  balls: string[];
}

const CurrentOver: React.FC<Props> = ({ balls }) => {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {balls.map((ball, idx) => (
        <div
          key={idx}
          className="px-3 py-1 rounded-full bg-gray-300 dark:bg-gray-600 text-sm font-semibold"
        >
          {ball}
        </div>
      ))}
    </div>
  );
};

export default CurrentOver;