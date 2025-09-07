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
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">IND vs AUS</h2>
        <div className="flex items-center gap-1 text-xs">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>LIVE</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">2nd ODI • Narendra Modi Stadium, Ahmedabad</p>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">India (1st Innings)</span>
          <span className="text-xl font-bold">187/4 (15.2)</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          V. Kohli* 45(32) • S. Iyer 23(18) • CRR: 12.13
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm">Australia</span>
          <span className="text-sm text-gray-500">Yet to bat</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
