import React from 'react';

interface MatchHeaderProps {
  teams: any;
  meta: any;
}

const MatchHeader = React.memo(({ teams, meta }: MatchHeaderProps) => {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md p-2 mb-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-blue-950 dark:via-blue-900 dark:to-indigo-950 border-2 border-blue-300 dark:border-blue-700 rounded-lg px-3 py-2.5 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-0.5 tracking-wide">TEAM A</div>
            <h2 className="text-sm sm:text-base font-black text-blue-900 dark:text-blue-50 truncate">{teams?.A?.short || teams?.A?.name}</h2>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 px-2">
          <div className="text-lg sm:text-xl font-black text-gray-400 dark:text-gray-600">VS</div>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500 dark:bg-red-500 text-white dark:text-white text-[10px] font-bold rounded-full animate-pulse">
            <div className="w-1.5 h-1.5 bg-white dark:bg-white rounded-full"></div>
            {meta?.status || 'LIVE'}
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100 dark:from-emerald-950 dark:via-green-900 dark:to-teal-950 border-2 border-emerald-300 dark:border-emerald-700 rounded-lg px-3 py-2.5 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 mb-0.5 tracking-wide">TEAM B</div>
            <h2 className="text-sm sm:text-base font-black text-emerald-900 dark:text-emerald-50 truncate">{teams?.B?.short || teams?.B?.name}</h2>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-1.5 pt-1.5 border-t border-[var(--card-border)]">
        <div className="text-[10px] text-[var(--text-secondary)]">
          <span>{meta?.format} Overs Match</span>
        </div>
      </div>
    </div>
  );
});

export default MatchHeader;
