import { Commentary, Meta, Innings, Team } from "@/types/scoreService";

export interface ScoreType {
  success: boolean;
  meta: Meta;
  commentary: Commentary;
  teams: {
    A: Team;
    B: Team;
  };
  innings: Innings[];
}

export interface BallEvent {
  innings: number;
  is_match_completed?: boolean;
  is_innings_over?: boolean;
  totalRuns: number;
  totalWickets: number;
  totalBalls: number;
  totalExtras: number;
  runsAdded: number;
  batsmanRuns: number;
  bowlerRuns: number;
  byRuns: number;
  extraRuns: number;
  isLegalBall: boolean;
  isWicket: boolean;
  isOverComplete: boolean;
  shouldFlipStrike: boolean;
  overNumber: number;
  ballNumber: number;
  currentOver?: {
    o: number;
    isOverComplete: boolean;
    bowlerId: number;
    ballsCount: number;
    isInLegalBall: boolean;
    ball: {
      b: number;
      t: string;
      r: number | string;
    };
  };
  timestamp: string;
}
