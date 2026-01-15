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
    illegalBallsCount: number;
    balls: Array<{
      b: number;
      t: string;
      r: number;
    }>;
  };
  timestamp: string;
}
