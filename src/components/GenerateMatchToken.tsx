import React from 'react';
import Button from './ui/Button';
import { useTheme } from '../context/ThemeContext';

interface GenerateMatchTokenProps {
    onGenerate: () => void;
    isGenerating: boolean;
}

const GenerateMatchToken: React.FC<GenerateMatchTokenProps> = ({ onGenerate, isGenerating }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="relative group w-full max-w-[340px]">
                {/* Subtle Ambient Glow */}
                <div className={`absolute -inset-1 rounded-2xl blur-lg opacity-40 transition duration-1000 group-hover:duration-200 group-hover:opacity-60
                    ${isDark ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20' : 'bg-gradient-to-r from-cyan-400/30 to-blue-500/30'}
                `}></div>

                {/* Main Card */}
                <div
                    className={`
                        relative px-6 py-8 rounded-xl shadow-2xl backdrop-blur-md border border-t transition-all duration-300
                        ${isDark
                            ? 'bg-[#0f172a]/90 border-white/10 border-t-white/20 shadow-black/50'
                            : 'bg-white/90 border-gray-200 border-t-white shadow-cyan-900/5'}
                    `}
                >
                    {/* Icon Container */}
                    <div className={`
                        relative w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg transform group-hover:scale-105 transition-transform duration-500
                        ${isDark
                            ? 'bg-slate-800 ring-1 ring-white/10'
                            : 'bg-gradient-to-br from-cyan-50 to-white ring-1 ring-cyan-100'}
                    `}>
                        <svg className={`w-7 h-7 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <h2 className={`text-lg font-bold mb-2 tracking-tight ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            Initiate Match
                        </h2>
                        <p className={`mb-6 text-xs font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Generate a secure match ID to begin.
                        </p>

                        <Button
                            size="sm"
                            variant="primary"
                            className={`w-full h-10 text-xs uppercase tracking-wider font-bold shadow-lg transition-all transform active:scale-95
                                ${isDark
                                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/20'
                                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/25'}
                            `}
                            onClick={onGenerate}
                            loading={isGenerating}
                        >
                            {isGenerating ? 'Creating...' : 'Generate Token'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateMatchToken;
