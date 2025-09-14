// src/context/MatchContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';
import axios from 'axios';

interface TeamInfo {
  name: string;
  shortname: string;
  img: string;
}

interface Score {
  r: number;
  w: number;
  o: number;
  inning: string;
}

export interface Match {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo: TeamInfo[];
  score: Score[];
  series_id: string;
  fantasyEnabled: boolean;
  bbbEnabled: boolean;
  hasSquad: boolean;
  matchStarted: boolean;
  matchEnded: boolean;
}

interface MatchContextType {
  matches: Match[];
  loading: boolean;
  error: string | null;
}

const CurrentMatchContext = createContext<MatchContextType | undefined>(undefined);

const API_KEY = '74f14599-16d3-49d8-b32b-be5008bf741a';
const API_URL = 'https://api.cricapi.com/v1/currentMatches';

export const CurrentMatchProvider = ({ children }: { children: ReactNode }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await axios.get<{ data: Match[] }>(API_URL, {
        params: { apikey: API_KEY },
      });
      setMatches(res.data.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
      setError('Failed to load live matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30000); // Live update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <CurrentMatchContext.Provider value={{ matches, loading, error }}>
      {children}
    </CurrentMatchContext.Provider>
  );
};

export const useCurrentMatchContext = (): MatchContextType => {
  const context = useContext(CurrentMatchContext);
  if (!context)
    throw new Error('useMatchContext must be used within MatchProvider');
  return context;
};
