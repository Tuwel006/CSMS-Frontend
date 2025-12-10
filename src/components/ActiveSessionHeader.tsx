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
        flex justify-between items-center p-5 rounded-xl border relative overflow-hidden group
        ${isDark
                    ? 'bg-[#0f172a] border-cyan-900/30'
                    : 'bg-white border-cyan-100'}
      `}
        >

            <div className="flex items-center gap-4 relative z-10">
                <div
                    className={`
            p-3 rounded-lg border
            ${isDark
                            ? 'bg-slate-800 border-cyan-900/30'
                            : 'bg-cyan-50 border-cyan-100'}
          `}
                >
                    <span className={`font-mono text-sm font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                        ID
                    </span>
                </div>
                <div>
                    <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${isDark ? 'text-slate-400' : 'text-cyan-600/80'}`}>
                        Active Session
                    </p>
                    <p className={`text-xl font-bold font-mono tracking-tight tabular-nums ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {matchToken}
                    </p>
                </div>
            </div>

            <Button
                variant="ghost"
                size="sm"
                className={`
          relative z-10 transition-colors duration-200
          ${isDark
                        ? 'text-gray-400 hover:text-red-400 hover:bg-red-950/30'
                        : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}
        `}
                onClick={onCancel}
            >
                Cancel Session
            </Button>
        </div>
    );
};

export default ActiveSessionHeader;
