export interface Team {
  id: number;
  name: string;
  short: string;
}

export interface Score {
  r: number;
  w: number;
  o: string;
  b: number;
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
  b: number;
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
  r: number | string;
}

export interface CurrentOver {
  bowlerId: number;
  o: number;
  isOverComplete: boolean;
  illegalBallsCount: number;
  balls: Ball[];
}

export interface Innings {
  i: number;
  is_innings_over?: boolean;
  is_completed?: boolean;
  innings_number?: number;
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
  extras: number;
  runRate?: string;
  didNotBat?: string[];
}

export interface Meta {
  matchId: string;
  currentInningsId: number;
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

export interface RecordBallPayload {
  matchId: string;
  innings_id: number;
  ball_type: 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE' | 'NORMAL' | string;
  runs: number;
  batsman_id: number;
  bowler_id: number;
  is_wicket?: boolean;
  is_boundary?: boolean;
  extras_enabled?: boolean;
  by_runs?: number;
  wicket?: {
    wicket_type: string;
    out_batsman_id: number;
    filder_id?: number;
  };
}