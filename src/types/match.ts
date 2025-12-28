export interface MatchPlayer {
  id: number;
  name: string;
  role: 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper';
}

export interface Team {
  id: number;
  name: string;
  players: MatchPlayer[];
  playing11: number[];
  battingOrder: number[];
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  tossWinner: number;
  tossDecision: 'bat' | 'bowl';
  battingTeam: number;
  bowlingTeam: number;
  overs: number;
  currentInnings: 1 | 2;
  status: 'setup' | 'live' | 'completed';
}

export interface BallData {
  runs: number;
  ballType: 'normal' | 'wide' | 'noBall' | 'legBye' | 'bye' | 'wicket' | 'penalty';
  extraRuns?: number;
  wicketType?: string;
  fielder?: string;
  batsmanOut?: string;
  newBatsman?: string;
}

export interface Over {
  overNumber: number;
  bowler: number;
  balls: BallData[];
}

export interface Innings {
  battingTeam: number;
  bowlingTeam: number;
  score: number;
  wickets: number;
  overs: Over[];
  currentBatsmen: [number, number];
  currentBowler: number;
}
