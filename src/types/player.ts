export interface Player {
  id: number | null;
  name: string;
  role: string;
}

export interface MatchPlayer {
  id: number;
  name: string;
  role: 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper';
}
