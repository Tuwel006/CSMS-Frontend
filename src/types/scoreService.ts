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
  id: number;
  n: string;
  r: number;
  b: number;
  sr: string;
  onStrike?: boolean;
  status?: string;
  '4s'?: number;
  '6s'?: number;
  order?: number;
  dismissal?: {
    type: string;
    bowler?: string;
    fielder?: string;
  };
}

export interface Bowler {
  id: number;
  n: string;
  o: string | number;
  m?: number;
  r: number;
  w: number;
  eco?: string;
  isCurrent?: boolean;
  '4s'?: number;
  '6s'?: number;
  extras?: number;
}

export interface Ball {
  b: number;
  t: string;
  r: number;
}

export interface CurrentOver {
  bowlerId: number;
  o: number;
  balls: Ball[];
}

export interface Innings {
  i: number;
  battingTeam: string;
  bowlingTeam: string;
  score: Score;
  batting: {
    striker: Batsman;
    nonStriker: Batsman;
  }
  dismissed: any[];
  bowling: Bowler[];
  currentOver: CurrentOver;
  extras?: string;
  runRate?: string;
  didNotBat?: string[];
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