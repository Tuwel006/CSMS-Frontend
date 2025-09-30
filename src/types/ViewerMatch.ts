// src/types/match.ts
export type TeamInfo = {
  name?: string;
  shortname?: string;
  img?: string;
};

export type ScoreEntry = {
  r?: number | string;
  w?: number | string;
  o?: number | string;
  inning?: string;
  // optionally other fields from API
  [k: string]: any;
};

export type Match = {
  id: string;
  name: string;
  matchType?: string;
  status?: string;
  venue?: string;
  date?: string;
  dateTimeGMT?: string;
  teams?: string[];
  teamInfo?: TeamInfo[];
  score?: ScoreEntry[];
  // ...
  [k: string]: any;
};

// Detailed structures for match details page:
export type PlayerBat = {
  id?: string;
  name: string;
  runs?: number;
  balls?: number;
  fours?: number;
  sixes?: number;
  sr?: number | string;
  dismissal?: string;
};

export type PlayerBowl = {
  id?: string;
  name: string;
  overs?: number | string;
  maidens?: number | string;
  runs?: number | string;
  wickets?: number | string;
  econ?: number | string;
};

export type Innings = {
  inningLabel?: string; // e.g., "India Inning 1"
  runs?: number | string;
  wickets?: number | string;
  overs?: number | string;
  batting?: PlayerBat[];
  bowling?: PlayerBowl[];
  extras?: string;
  [k: string]: any;
};

export type MatchDetails = {
  id: string;
  match: Match;
  innings?: Innings[];
  commentaryUrl?: string;
  scorecardUpdatedAt?: string;
  // other metadata...
};
