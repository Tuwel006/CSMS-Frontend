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
        flex justify-between items-center px-6 py-4 rounded-xl border-2 shadow-lg transition-all duration-300 relative overflow-hidden
        ${isDark
                    ? 'bg-gradient-to-r from-blue-950 to-slate-900 border-blue-500/30 shadow-blue-500/20'
                    : 'bg-gradient-to-r from-blue-50 to-white border-blue-300 shadow-blue-200/50'}
      `}
        >
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            </div>

            <div className="flex items-center gap-4 relative z-10">
                <div
                    className={`
            px-3 py-2 rounded-lg border-2 shadow-md
            ${isDark
                            ? 'bg-blue-900/50 border-blue-400/50'
                            : 'bg-blue-100 border-blue-400'}
          `}
                >
                    <span className={`font-mono text-sm font-extrabold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                        ID
                    </span>
                </div>
                <div className="flex flex-col">
                    <p className={`text-xs font-bold uppercase tracking-wider leading-none mb-1.5 flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Active Session
                    </p>
                    <p className={`text-2xl font-black font-mono tracking-tight leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {matchToken}
                    </p>
                </div>
            </div>

            <div className="relative z-10">
                <Button
                    variant="danger"
                    size="md"
                    onClick={onCancel}
                    className="shadow-lg"
                >
                    Cancel Session
                </Button>
            </div>
        </div>
    );
};

export default ActiveSessionHeader;
