interface ScoreRowProps {
  team: string;
  score: string;
}

const ScoreRow = ({ team, score }: ScoreRowProps) => (
  <div className="flex justify-between">
    <span>{team}:</span>
    <span>{score}</span>
  </div>
);

export default ScoreRow;
