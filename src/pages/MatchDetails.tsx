import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MatchService } from "../services/matchService";
import MatchCard from "../components/ui/ScoreCard";
import { PageLoader, ErrorDisplay, ScoreCardSkeleton } from "../components/ui/loading";
import { Stack } from "../components/ui/lib/Stack";
import { Box } from "../components/ui/lib/Box";
import { useTheme } from "../context/ThemeContext";
import type { MatchDetails } from "../types/scorecard";

const MatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
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
      // TODO: Replace with actual tournaments API
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

  const isLoading = matchesLoading && tournamentsLoading;

  if (isLoading) return <PageLoader />;

  return (
    <Box p="md" className="max-w-7xl mx-auto">
      <Stack gap="lg">
        {/* Matches Section */}
        <Stack gap="md">
          <Stack direction="row" justify="between" align="center">
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Matches
              </h2>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                View all your cricket matches
              </p>
            </div>
          </Stack>

          {matchesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => <ScoreCardSkeleton key={i} />)}
            </div>
          ) : matchesError ? (
            <ErrorDisplay message={matchesError} onRetry={fetchMatches} />
          ) : matches.length === 0 ? (
            <Box p="lg" className={`text-center ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-sm`}>
              <div className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                No matches found
              </div>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Start by creating a new match
              </p>
            </Box>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {matches.map((match) => (
                <MatchCard
                  key={match.meta.matchId}
                  match={match}
                  onClick={() => handleMatchClick(match.meta.matchId)}
                />
              ))}
            </div>
          )}
        </Stack>

        {/* Tournaments Section */}
        <Stack gap="md">
          <Stack direction="row" justify="between" align="center">
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Tournaments
              </h2>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage your cricket tournaments
              </p>
            </div>
          </Stack>

          {tournamentsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => <ScoreCardSkeleton key={i} />)}
            </div>
          ) : tournamentsError ? (
            <ErrorDisplay message={tournamentsError} onRetry={fetchTournaments} />
          ) : tournaments.length === 0 ? (
            <Box p="lg" className={`text-center ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-sm`}>
              <div className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                No tournaments found
              </div>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Create your first tournament
              </p>
            </Box>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {tournaments.map((tournament) => (
                <div key={tournament.id}>
                  {/* Tournament Card */}
                </div>
              ))}
            </div>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default MatchesPage;
