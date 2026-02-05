import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MatchService } from "../services/matchService";
import MatchCard from "../components/ui/ScoreCard";
import { PageLoader, ErrorDisplay, ScoreCardSkeleton } from "../components/ui/loading";
import { Stack } from "../components/ui/lib/Stack";
import { Box } from "../components/ui/lib/Box";
import Card from "../components/ui/lib/Card";
import type { MatchDetails } from "../types/scorecard";
import { Trophy, Calendar, TrendingUp, Users } from "lucide-react";
import { useBreadcrumbs } from "../context/BreadcrumbContext";

const MatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const { setPageMeta } = useBreadcrumbs();

  useEffect(() => {
    setPageMeta({
      description: "Manage your cricket matches and tournaments"
    });
  }, [setPageMeta]);

  const [matches, setMatches] = useState<MatchDetails[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [matchesError, setMatchesError] = useState<string | null>(null);

  const [tournaments, setTournaments] = useState<any[]>([]);
  const [tournamentsLoading, setTournamentsLoading] = useState(true);
  const [tournamentsError, setTournamentsError] = useState<string | null>(null);

  const fetchMatches = async () => {
    setMatchesLoading(true);
    setMatchesError(null);
    try {
      const response = await MatchService.getMatches(1, 10);
      if (response.data?.data) {
        setMatches(response.data.data);
      }
    } catch (err) {
      setMatchesError('Failed to load matches');
    } finally {
      setMatchesLoading(false);
    }
  };

  const fetchTournaments = async () => {
    setTournamentsLoading(true);
    setTournamentsError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTournaments([]);
    } catch (err) {
      setTournamentsError('Failed to load tournaments');
    } finally {
      setTournamentsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    fetchTournaments();
  }, []);

  const handleMatchClick = (matchId: string) => {
    navigate(`/matches/match/${matchId}/score`);
  };

  const stats = [
    { icon: Calendar, label: 'Total Matches', value: matches.length, color: 'cyan' },
    { icon: Trophy, label: 'Tournaments', value: tournaments.length, color: 'purple' },
    { icon: TrendingUp, label: 'Live Matches', value: matches.filter(m => m.meta.status === 'LIVE').length, color: 'green' },
    { icon: Users, label: 'Teams', value: matches.length * 2, color: 'orange' }
  ];

  const isLoading = matchesLoading && tournamentsLoading;

  if (isLoading) return <PageLoader />;

  return (
    <Box p="sm" className="max-w-7xl mx-auto">
      <Stack gap="md">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-3 sm:p-4">
              <Stack gap="xs">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-sm flex items-center justify-center ${stat.color === 'cyan' ? 'bg-cyan-100 dark:bg-cyan-900/20' :
                  stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20' :
                    stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                      'bg-orange-100 dark:bg-orange-900/20'
                  }`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color === 'cyan' ? 'text-cyan-600 dark:text-cyan-400' :
                    stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                      stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                        'text-orange-600 dark:text-orange-400'
                    }`} />
                </div>
                <div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {stat.label}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-[var(--text)]">
                    {stat.value}
                  </div>
                </div>
              </Stack>
            </Card>
          ))}
        </div>

        <Stack gap="sm">
          <Card className="p-3 sm:p-4">
            <Stack direction="row" justify="between" align="center" className="mb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[var(--text)]">
                  Recent Matches
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  {matches.length} matches found
                </p>
              </div>
              <button
                onClick={() => navigate('/admin/match-setup')}
                className="px-3 py-1.5 text-xs sm:text-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded-sm font-medium transition-colors"
              >
                New Match
              </button>
            </Stack>

            {matchesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                {[1, 2, 3, 4].map(i => <ScoreCardSkeleton key={i} />)}
              </div>
            ) : matchesError ? (
              <ErrorDisplay message={matchesError} onRetry={fetchMatches} />
            ) : matches.length === 0 ? (
              <Box p="lg" className="text-center">
                <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-[var(--text-secondary)]" />
                <div className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-[var(--text)]">
                  No matches yet
                </div>
                <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-[var(--text-secondary)]">
                  Create your first match to get started
                </p>
                <button
                  onClick={() => navigate('/admin/match-setup')}
                  className="px-4 py-2 text-xs sm:text-sm bg-cyan-600 hover:bg-cyan-700 text-white rounded-sm font-medium transition-colors"
                >
                  Create Match
                </button>
              </Box>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                {matches.map((match) => (
                  <MatchCard
                    key={match.meta.matchId}
                    match={match}
                    onClick={() => handleMatchClick(match.meta.matchId)}
                  />
                ))}
              </div>
            )}
          </Card>
        </Stack>

        <Stack gap="sm">
          <Card className="p-3 sm:p-4">
            <Stack direction="row" justify="between" align="center" className="mb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[var(--text)]">
                  Tournaments
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  {tournaments.length} tournaments active
                </p>
              </div>
              <button
                className="px-3 py-1.5 text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-sm font-medium transition-colors"
              >
                New Tournament
              </button>
            </Stack>

            {tournamentsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                {[1, 2].map(i => <ScoreCardSkeleton key={i} />)}
              </div>
            ) : tournamentsError ? (
              <ErrorDisplay message={tournamentsError} onRetry={fetchTournaments} />
            ) : tournaments.length === 0 ? (
              <Box p="lg" className="text-center">
                <Trophy className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-[var(--text-secondary)]" />
                <div className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-[var(--text)]">
                  No tournaments yet
                </div>
                <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-[var(--text-secondary)]">
                  Create your first tournament
                </p>
                <button
                  className="px-4 py-2 text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-sm font-medium transition-colors"
                >
                  Create Tournament
                </button>
              </Box>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                {tournaments.map((tournament) => (
                  <Card key={tournament.id} className="p-4">
                    <div className="text-sm font-semibold text-[var(--text)]">
                      {tournament.name}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
};

export default MatchesPage;
