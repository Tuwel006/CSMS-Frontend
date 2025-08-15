const ScoreCard = () => {
  return (
    <div
      className="p-5 rounded-xl border shadow-sm mb-4"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
        color: "var(--text)",
      }}
    >
      <h2 className="text-lg font-semibold">IND vs AUS</h2>
      <p className="text-sm">Live | 2nd ODI | Delhi</p>
      <div className="mt-3 flex justify-between">
        <span>India: 245/7 (45.2)</span>
        <span>Australia: Yet to bat</span>
      </div>
    </div>
  );
};

export default ScoreCard;
