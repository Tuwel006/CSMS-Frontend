export interface TournamentMatch {
  id: string;
  tournamentId: string;
  roundId: string;
  team1Id: string;
  team2Id: string;
  team1Name: string;
  team2Name: string;
  scheduledDate?: string;
  scheduledTime?: string;
  venue?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  matchNumber: number;
  groupId?: string;
  result?: {
    winnerId: string;
    winnerName: string;
    margin: string;
  };
}

export interface Round {
  id: string;
  tournamentId: string;
  name: string;
  roundNumber: number;
  type: 'group' | 'knockout' | 'league';
  matches: TournamentMatch[];
  startDate?: string;
  endDate?: string;
  status: 'pending' | 'active' | 'completed';
}

export interface Group {
  id: string;
  tournamentId: string;
  name: string;
  teamIds: string[];
  roundRobinMatches?: string[];
}

export interface TournamentRules {
  groupStage: boolean;
  numberOfGroups?: number;
  teamsPerGroup?: number;
  groupAssignment: 'auto' | 'manual';
  matchPairing: 'auto' | 'manual';
  pointsForWin: number;
  pointsForDraw: number;
  pointsForLoss: number;
  knockoutFormat?: 'single' | 'double';
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  format: string;
  teams: any[];
  maxTeams: number;
  status: 'draft' | 'active' | 'completed';
  rules: TournamentRules;
  rounds: Round[];
  groups?: Group[];
}
