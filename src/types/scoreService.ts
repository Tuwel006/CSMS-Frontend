export interface Team {
  id: number;
  name: string;
  short: string;
}

export interface Score {
  r: number;
  w: number;
  o: string;
}

export interface Batsman {
  name: string;
  runs: number;
  balls: number;
  onStrike: boolean;
  status: string;
}

export interface Bowler {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  isCurrent: boolean;
}

export interface Ball {
  outcome: string;
}

export interface CurrentOver {
  o: number;
  balls: Ball[];
}

export interface Innings {
  i: number;
  battingTeam: string;
  bowlingTeam: string;
  score: Score;
  batting: Batsman[];
  dismissed: any[];
  bowling: Bowler[];
  currentOver: CurrentOver;
}

export interface Meta {
  matchId: string;
  format: string;
  status: string;
  lastUpdated: string;
}

export interface Commentary {
  initial: string;
  latest: string;
}

export interface MatchScoreResponse {
  success: boolean;
  meta: Meta;
  commentary: Commentary;
  teams: {
    A: Team;
    B: Team;
  };
  innings: Innings[];
}