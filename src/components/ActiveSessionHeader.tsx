import React from 'react';
import Button from './ui/Button';
import { useTheme } from '../context/ThemeContext'; // Ensure correct path

interface ActiveSessionHeaderProps {
    matchToken: string | null;
    onCancel: () => void;
}

const ActiveSessionHeader: React.FC<ActiveSessionHeaderProps> = ({ matchToken, onCancel }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div
            className={`
        flex justify-between items-center px-4 py-3 rounded-lg border shadow-sm transition-all duration-300
        ${isDark
                    ? 'bg-[#0f172a] border-white/10 shadow-black/20'
                    : 'bg-white border-gray-200 shadow-sm'}
      `}
        >

            <div className="flex items-center gap-3">
                <div
                    className={`
            px-2.5 py-1.5 rounded-md border
            ${isDark
                            ? 'bg-slate-800 border-white/10'
                            : 'bg-gray-50 border-gray-200'}
          `}
                >
                    <span className={`font-mono text-xs font-bold ${isDark ? 'text-cyan-400' : 'text-gray-600'}`}>
                        ID
                    </span>
                </div>
                <div className="flex flex-col">
                    <p className={`text-[10px] font-semibold uppercase tracking-widest leading-none mb-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                        Active Session
                    </p>
                    <p className={`text-lg font-bold font-mono tracking-tight leading-none ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                        {matchToken}
                    </p>
                </div>
            </div>

            <Button
                variant="ghost"
                size="sm"
                className={`
          h-8 text-xs font-medium px-3
          ${isDark
                        ? 'text-gray-400 hover:text-red-400 hover:bg-white/5'
                        : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}
        `}
                onClick={onCancel}
            >
                End Session
            </Button>
        </div>
    );
};

export default ActiveSessionHeader;
