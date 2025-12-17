import React from 'react';
import Button from './ui/Button';
import { useTheme } from '../context/ThemeContext';

interface ActiveSessionHeaderProps {
    matchToken: string | null;
    onCancel: () => void;
}

const ActiveSessionHeader: React.FC<ActiveSessionHeaderProps> = ({ matchToken, onCancel }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 py-3 rounded border shadow-sm ${isDark ? 'bg-[var(--card-bg)] border-[var(--card-border)]' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <div className={`px-2 py-1 rounded text-xs font-semibold ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                    SESSION
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active</span>
                    <span className="text-gray-400 hidden sm:inline">•</span>
                    <span className={`text-xs sm:text-sm font-mono font-semibold ${isDark ? 'text-white' : 'text-gray-900'} break-all`}>{matchToken}</span>
                </div>
            </div>
            <Button variant="danger" size="sm" onClick={onCancel} className="w-full sm:w-auto">
                Cancel Session
            </Button>
        </div>
    );
};

export default ActiveSessionHeader;
