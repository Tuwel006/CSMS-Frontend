import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Calendar, Clipboard, CheckCircle2 } from 'lucide-react';
import { MatchService } from '../services/matchService';
import { showToast } from '../utils/toast';
import Button from '../components/ui/Button';

interface MatchTokenItem {
  id: string;
  status: string;
  match_date: string | null;
  venue: string | null;
  teamA?: { name: string };
  teamB?: { name: string };
}

const MatchSetupPage: React.FC = () => {
  const navigate = useNavigate();

  const [matches, setMatches] = useState<MatchTokenItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const response = await MatchService.getTenantMatches(1, 100);
      if (response.data && response.data.data) {
        const sortedMatches = response.data.data.map((m: any) => ({
          id: m.id,
          status: m.status || 'INITIATED',
          match_date: m.match_date,
          venue: m.venue,
          teamA: m.teamA,
          teamB: m.teamB
        }));
        setMatches(sortedMatches);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      showToast.error('Failed to load match sessions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleGenerateToken = async () => {
    setIsGenerating(true);
    const toastId = showToast.loading("Generating New Match Token...");
    try {
      const response = await MatchService.generateToken();
      if (response.data && response.data.id) {
        showToast.success('Match token generated successfully!');
        navigate(`/admin/match-setup/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error generating token:', error);
      showToast.handleResponse(toastId, error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteToken = async (e: React.MouseEvent, tokenId: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this match session?')) return;

    const toastId = showToast.loading("Deleting Session...");
    try {
      const response = await MatchService.deleteToken(tokenId);
      if (response.status >= 200 && response.status < 300) {
        showToast.success('Session deleted');
        setMatches(prev => prev.filter(m => m.id !== tokenId));
      }
    } catch (error) {
      showToast.handleResponse(toastId, error);
    } finally {
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-3 space-y-4 animate-in fade-in duration-700 min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-gray-100 to-gray-200 dark:from-slate-900 dark:via-[#0a0a0a] dark:to-black">

      {/* Premium Header - Compact */}
      <div className="flex items-end justify-between pb-3 border-b border-gray-200/50 dark:border-white/5">
        <div>
          <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 tracking-tighter uppercase mb-0.5">
            Match Sessions
          </h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
            Manage your fixtures & scoring tokens
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleGenerateToken}
          disabled={isGenerating}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-4 h-8 rounded shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 hover:shadow-cyan-500/30"
        >
          <Plus size={14} strokeWidth={3} />
          Create Session
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-32 rounded-lg bg-white/50 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-white/5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center animate-bounce-slow">
            <Clipboard size={20} className="text-cyan-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-tight">No Active Sessions</h3>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Generate a new token to begin setup</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {matches.map((match) => (
            <div
              key={match.id}
              onClick={() => navigate(`/admin/match-setup/${match.id}`)}
              className="group relative cursor-pointer bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/5 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1"
            >
              {/* Decorative Elements - Scaled Down */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full -mr-6 -mt-6 blur-lg group-hover:bg-cyan-500/10 transition-all" />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent group-hover:via-cyan-500/50 transition-all" />

              <div className="p-3">
                {/* Card Top: Status & Delete */}
                <div className="flex justify-between items-start mb-3">
                  <div className={`text-[8px] font-black uppercase tracking-[0.15em] px-1.5 py-0.5 rounded bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 ${match.status.toUpperCase() === 'LIVE' ? 'text-red-500 border-red-500/20 bg-red-500/5' :
                      match.status.toUpperCase() === 'SCHEDULED' ? 'text-green-500 border-green-500/20 bg-green-500/5' :
                        'text-cyan-500'
                    }`}>
                    {match.status}
                  </div>
                  <button
                    onClick={(e) => handleDeleteToken(e, match.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Teams Display - Compact */}
                <div className="flex items-center justify-between gap-1.5 mb-3">
                  {/* Team A */}
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <div className="w-8 h-8 mb-1.5 rounded bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-inner">
                      <span className="text-xs font-black text-gray-400 dark:text-gray-500">
                        {match.teamA?.name?.[0] || 'A'}
                      </span>
                    </div>
                    <h3 className="text-[10px] font-bold text-[var(--text)] uppercase tracking-tight truncate w-full text-center leading-tight">
                      {match.teamA?.name || 'TBA'}
                    </h3>
                  </div>

                  {/* VS */}
                  <div className="flex flex-col items-center px-1">
                    <span className="text-[8px] font-black italic text-gray-300 dark:text-gray-700">VS</span>
                  </div>

                  {/* Team B */}
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <div className="w-8 h-8 mb-1.5 rounded bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-inner">
                      <span className="text-xs font-black text-gray-400 dark:text-gray-500">
                        {match.teamB?.name?.[0] || 'B'}
                      </span>
                    </div>
                    <h3 className="text-[10px] font-bold text-[var(--text)] uppercase tracking-tight truncate w-full text-center leading-tight">
                      {match.teamB?.name || 'TBA'}
                    </h3>
                  </div>
                </div>

                {/* Footer Info - Compact */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 group-hover:text-cyan-600 transition-colors">
                      <Calendar size={10} />
                      <span>{match.match_date ? new Date(match.match_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No Date'}</span>
                    </div>
                    <div className="text-[8px] font-mono text-gray-300 dark:text-gray-600 pl-3.5">
                      {match.id.substring(0, 8)}...
                    </div>
                  </div>

                  <div className="w-5 h-5 rounded-full bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                    <CheckCircle2 size={10} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchSetupPage;