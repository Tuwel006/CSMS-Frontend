export interface MatchTeam {
  id: number;
  name: string;
  short: string;
}

export interface InningsScore {
  r: number;
  w: number;
  b: number;
}

export interface MatchInnings {
  i: number;
  battingTeam: string;
  bowlingTeam: string;
  score: InningsScore;
}

export interface MatchMeta {
  matchId: string;
  format: string;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  lastUpdated: string;
}

export interface MatchDetails {
  meta: MatchMeta;
  teams: {
    A: MatchTeam;
    B: MatchTeam;
  };
  innings: MatchInnings[];
}

export interface MatchResponse {
  success: boolean;
  data: MatchDetails;
}
