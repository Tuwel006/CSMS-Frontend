import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Calendar, Clipboard, User, MapPin, AlertCircle } from 'lucide-react';
import { MatchService } from '../services/matchService';
import { showToast } from '../utils/toast';
import Button from '../components/ui/Button';
import { Box, Stack, Card as LibCard, Grid, Text } from '../components/ui/lib';
import { useBreadcrumbs } from '../context/BreadcrumbContext';
import Modal from '../components/ui/Modal';

interface UserType {
  id: number;
  username: string;
  email: string;
}

interface MatchTokenItem {
  id: string;
  status: string;
  match_date: string | null;
  venue: string | null;
  teamA?: { name: string };
  teamB?: { name: string };
  user?: UserType;
}

const MatchSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setPageMeta } = useBreadcrumbs();

  const [matches, setMatches] = useState<MatchTokenItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Modal State
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  // Set Page Meta
  useEffect(() => {
    setPageMeta({
      description: "Manage your fixtures & scoring tokens"
    });
  }, [setPageMeta]);

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
          teamB: m.teamB,
          user: m.user
        }));
        setMatches(sortedMatches);
      }
    } catch (error: any) {
      console.error('Error fetching matches:', error);
      showToast.error(error?.response?.data?.message || 'Failed to load match sessions');
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
      showToast.handleResponse(toastId, response);
      if (response.data && response.data.id) {
        navigate(`/admin/match-setup/${response.data.id}`);
      }
    } catch (error) {
      console.error('Error generating token:', error);
      showToast.handleResponse(toastId, error);
    } finally {
      setIsGenerating(false);
    }
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;

    const tokenId = sessionToDelete;
    setSessionToDelete(null); // Close modal

    const toastId = showToast.loading("Deleting Session...");
    try {
      const response = await MatchService.deleteToken(tokenId);
      showToast.handleResponse(toastId, response);
      if (response.status >= 200 && response.status < 300) {
        setMatches(prev => prev.filter(m => m.id !== tokenId));
      }
    } catch (error) {
      showToast.handleResponse(toastId, error);
    }
  };

  const handleDeleteToken = (e: React.MouseEvent, tokenId: string) => {
    e.stopPropagation();
    setSessionToDelete(tokenId);
  };

  return (
    <Box className="max-w-7xl mx-auto p-4 space-y-6 animate-in fade-in duration-700 bg-transparent">

      {/* Small Refined Header */}
      <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-gray-200 dark:border-white/5">
        <div>
          <h2 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-[var(--text)]">
            Active Sessions
          </h2>
        </div>
        <Button
          variant="primary"
          onClick={handleGenerateToken}
          disabled={isGenerating}
          className="h-7 md:h-8 px-3 md:px-4 text-[8px] md:text-[10px] font-black uppercase tracking-wider bg-cyan-600 hover:bg-cyan-700 text-white rounded shadow-sm flex items-center gap-1.5 md:gap-2 transition-all"
        >
          <Plus size={14} strokeWidth={3} className="w-3 h-3 md:w-3.5 md:h-3.5" />
          {isGenerating ? 'Generating...' : 'Create Session'}
        </Button>
      </div>

      {isLoading ? (
        <Grid cols={{ default: 1, sm: 2, md: 3, lg: 4, xl: 5 }} gap={3}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-32 rounded-sm bg-[var(--card-bg)] border border-[var(--card-border)] animate-pulse" />
          ))}
        </Grid>
      ) : matches.length === 0 ? (
        <LibCard className="py-12 text-center border-dashed">
          <Stack align="center" justify="center" gap="sm">
            <Box className="w-10 h-10 rounded-sm bg-cyan-100 dark:bg-cyan-900/20 flex items-center justify-center">
              <Clipboard size={18} className="text-cyan-600 dark:text-cyan-400" />
            </Box>
            <div>
              <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-tight">No Active Sessions</h3>
              <Text className="text-[10px] text-[var(--text-secondary)] font-medium mt-0.5">Generate a new token to begin setup</Text>
            </div>
          </Stack>
        </LibCard>
      ) : (
        <Grid cols={{ default: 1, sm: 2, md: 3, lg: 4, xl: 5 }} gap={3}>
          {matches.map((match) => (
            <LibCard
              key={match.id}
              onClick={() => navigate(`/admin/match-setup/${match.id}`)}
              className="group cursor-pointer border border-[var(--card-border)] hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 relative overflow-hidden"
              p="sm"
            >
              {/* Subtle top indicator based on status */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] opacity-70 ${match.status.toUpperCase() === 'LIVE' ? 'bg-red-500' :
                match.status.toUpperCase() === 'SCHEDULED' ? 'bg-green-500' : 'bg-cyan-500'
                }`} />

              <Stack gap="xs">
                {/* Header: Status & Delete */}
                <div className="flex items-center justify-between gap-2">
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${match.status.toUpperCase() === 'LIVE'
                    ? 'bg-red-500/10 text-red-500'
                    : match.status.toUpperCase() === 'SCHEDULED'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-cyan-500/10 text-cyan-500'
                    }`}>
                    <span className={`w-1 h-1 rounded-full ${match.status.toUpperCase() === 'LIVE' ? 'bg-red-500 animate-pulse' :
                      match.status.toUpperCase() === 'SCHEDULED' ? 'bg-green-500' : 'bg-cyan-500'
                      }`} />
                    {match.status}
                  </div>
                  <button
                    onClick={(e) => handleDeleteToken(e, match.id)}
                    className="text-gray-300 hover:text-red-500 hover:bg-red-500/10 p-1 rounded-sm transition-all"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>

                {/* Body: Teams VS */}
                <div className="relative py-2 px-1 flex items-center justify-between">
                  {/* Team A */}
                  <div className="flex flex-col items-center flex-1 min-w-0 z-10">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-1 shadow-sm group-hover:border-cyan-500/30 transition-colors">
                      <span className="text-xs font-black text-gray-400 group-hover:text-cyan-600 transition-colors">
                        {match.teamA?.name?.[0] || 'A'}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-[var(--text)] truncate w-full text-center uppercase tracking-tighter leading-none">
                      {match.teamA?.name || 'TEAM A'}
                    </span>
                  </div>

                  {/* VS Badge */}
                  <div className="flex flex-col items-center px-1 z-10">
                    <div className="px-1.5 py-0.5 rounded-sm bg-white dark:bg-black border border-gray-100 dark:border-white/5 shadow-sm">
                      <span className="text-[7px] font-black italic text-gray-400">VS</span>
                    </div>
                  </div>

                  {/* Team B */}
                  <div className="flex flex-col items-center flex-1 min-w-0 z-10">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-1 shadow-sm group-hover:border-cyan-500/30 transition-colors">
                      <span className="text-xs font-black text-gray-400 group-hover:text-cyan-600 transition-colors">
                        {match.teamB?.name?.[0] || 'B'}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-[var(--text)] truncate w-full text-center uppercase tracking-tighter leading-none">
                      {match.teamB?.name || 'TEAM B'}
                    </span>
                  </div>
                </div>

                {/* Details: Venue & Date */}
                <div className="mt-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-sm bg-gray-50 dark:bg-white/5">
                      <MapPin size={10} className="text-cyan-500" />
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 truncate tracking-tight">
                      {match.venue || 'Venue TBD'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-sm bg-gray-50 dark:bg-white/5">
                      <Calendar size={10} className="text-blue-500" />
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 truncate tracking-tight">
                      {match.match_date ? new Date(match.match_date).toLocaleDateString(undefined, {
                        weekday: 'short', month: 'short', day: 'numeric'
                      }) : 'Date Pending'}
                    </span>
                  </div>
                </div>

                {/* Footer: User & ID */}
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-cyan-600/10 flex items-center justify-center">
                      <User size={8} className="text-cyan-600" />
                    </div>
                    <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 truncate max-w-[60px]">
                      {match.user?.username || 'System'}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-gray-400 dark:text-gray-600 uppercase tracking-tight">
                    #{match.id.toUpperCase()}
                  </span>
                </div>
              </Stack>
            </LibCard>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!sessionToDelete}
        onClose={() => setSessionToDelete(null)}
        title="Delete Session"
        maxWidth="sm"
        footer={
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 font-bold uppercase tracking-widest text-[10px]"
              onClick={() => setSessionToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1 font-bold uppercase tracking-widest text-[10px]"
              onClick={confirmDelete}
              leftIcon={<Trash2 size={14} />}
            >
              Delete Session
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center py-4 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h3 className="text-base font-bold text-[var(--text)] uppercase tracking-wider">Permanent Action</h3>
          <p className="text-[var(--text-secondary)] text-xs mt-2 leading-relaxed">
            Are you sure you want to delete this match session? This will permanently remove all associated tokens and setup progress.
          </p>
          {sessionToDelete && (
            <div className="mt-4 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-sm border border-gray-100 dark:border-white/5">
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-500">
                {sessionToDelete.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </Modal>
    </Box>
  );
};

export default MatchSetupPage;