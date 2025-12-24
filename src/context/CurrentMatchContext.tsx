// src/context/MatchContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';
import axios from 'axios';
import DefaultMatches from '@/utils/DefaultMatchesData.json';

export interface TeamInfo {
  name: string;
  shortname: string;
  short: string;
  img: string;
}

export interface Score {
  r: string | number;  // Runs
  w: string | number;  // Wickets
  o: string | number;  // Overs
  inning?: string;     // Optional, for compatibility
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
  score: Score[]; // Now supports both string and number types
  series_id: string;
  fantasyEnabled: boolean;
  bbbEnabled: boolean;
  hasSquad: boolean;
  matchStarted: boolean;
  matchEnded: boolean;
  toss_winner_team_id?: number;
  batting_first_team_id?: number;
}


interface MatchContextType {
  matches: Match[];
  loading: boolean;
  error: string | null;
  fetchMatches: () => Promise<void>;
}

const CurrentMatchContext = createContext<MatchContextType | undefined>(undefined);

const getApiKey = () => import.meta.env.VITE_CRICKET_API_KEY;
const API_URL = 'https://api.cricapi.com/v1/currentMatches';

export const CurrentMatchProvider = ({ children }: { children: ReactNode }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('API key not configured');
      }
      const res = await axios.get<{ data: Match[] }>(API_URL, {
        params: { apikey: apiKey },
      });
      const apiMatches = res?.data?.data;
      if (Array.isArray(apiMatches) && apiMatches.length > 0) {
        setMatches(apiMatches);
        setError(null);
      } else if (Array.isArray(DefaultMatches) && DefaultMatches.length > 0) {
        setMatches(DefaultMatches as Match[]);
        setError(null);
      } else {
        setMatches([]);
        setError('No matches available');
      }
    } catch (err) {
      if (Array.isArray(DefaultMatches) && DefaultMatches.length > 0) {
        setMatches(DefaultMatches as Match[]);
      } else {
        setMatches([]);
      }
      console.error('Failed to fetch matches:', err);
      setError('Failed to load live matches');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CurrentMatchContext.Provider value={{ matches, loading, error, fetchMatches }}>
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
