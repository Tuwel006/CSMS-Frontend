import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { MatchService } from '../services/matchService';
import MatchCard from '../components/ui/ScoreCard';
import { PageLoader, ErrorDisplay, ScoreCardSkeleton } from '../components/ui/loading';
import { Stack } from '../components/ui/lib/Stack';
import { Box } from '../components/ui/lib/Box';
import Card from '../components/ui/lib/Card';
import type { MatchDetails } from '../types/scorecard';

const PublicHome = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  
  const [matches, setMatches] = useState<MatchDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await MatchService.getAllMatches(1, 20);
      if (response.data?.data) {
        setMatches(response.data.data);
      }
    } catch (err) {
      setError('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleMatchClick = (matchId: string) => {
    navigate(`/matches/match/${matchId}/score`);
  };

  if (loading) return <PageLoader />;

  return (
    <div className={cn('min-h-screen', isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-white')}>
      <Box p="sm" className="max-w-7xl mx-auto">
        <Stack gap="md">
          <Box p="xs">
            <h1 className={cn('text-xl sm:text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
              Recent Matches
            </h1>
            <p className={cn('text-xs sm:text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
              Watch live cricket matches and scores
            </p>
          </Box>

          <Card className="p-3 sm:p-4">
            <Stack direction="row" justify="between" align="center" className="mb-3">
              <div>
                <h2 className={cn('text-base sm:text-lg font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                  All Matches
                </h2>
                <p className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  {matches.length} matches available
                </p>
              </div>
            </Stack>

            {error ? (
              <ErrorDisplay message={error} onRetry={fetchMatches} />
            ) : matches.length === 0 ? (
              <Box p="lg" className="text-center">
                <Calendar className={cn('w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4', isDark ? 'text-gray-600' : 'text-gray-400')} />
                <div className={cn('text-sm sm:text-base font-semibold mb-1 sm:mb-2', isDark ? 'text-gray-200' : 'text-gray-900')}>
                  No matches available
                </div>
                <p className={cn('text-xs sm:text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  Check back later for upcoming matches
                </p>
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
      </Box>
    </div>
  );
};

export default PublicHome;
