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
    console.log(isDark);
    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative group perspective-1000 w-full max-w-lg">
                {/* Outer Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                {/* Main Card Container with Explicit Theme Logic */}
                <div
                    className={`
            relative p-10 rounded-2xl shadow-xl backdrop-blur-xl border transition-all duration-300
            ${isDark
                            ? 'bg-[#0f172a] border-white/30 text-white'
                            : 'bg-white border-white/30 text-gray-900'}
          `}
                >

                    {/* Icon Circle */}
                    <div className={`
            relative w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-1 transition-all duration-500
            ${isDark
                            ? 'bg-white/30 ring-white/30'
                            : 'bg-cyan-50/50 ring-cyan-100'}
          `}>
                        <svg className={`w-12 h-12 drop-shadow-sm relative z-10 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <h2 className={`text-3xl font-black mb-4 tracking-tight ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            Initiate New Match
                        </h2>
                        <p className={`mb-10 text-lg leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-cyan-900/60'}`}>
                            Generate a secure, unique match ID to begin the official team setup and scheduling process.
                        </p>

                        <Button
                            size="lg"
                            variant="primary"
                            className="w-full h-14 text-base font-bold tracking-wide shadow-cyan-500/20 hover:shadow-cyan-500/40 border-none
                bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
                            onClick={onGenerate}
                            loading={isGenerating}
                        >
                            {isGenerating ? 'Creating Session...' : 'Generate Match ID'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateMatchToken;
