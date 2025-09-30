export interface Player {
  id: string;
  name: string;
  role: 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper';
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  playing11: string[];
  battingOrder: string[];
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  tossWinner: string;
  tossDecision: 'bat' | 'bowl';
  battingTeam: string;
  bowlingTeam: string;
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
  bowler: string;
  balls: BallData[];
}

export interface Innings {
  battingTeam: string;
  bowlingTeam: string;
  score: number;
  wickets: number;
  overs: Over[];
  currentBatsmen: [string, string];
  currentBowler: string;
}
