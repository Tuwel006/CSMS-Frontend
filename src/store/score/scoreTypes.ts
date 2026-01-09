import { Team } from "@/types";
import { Commentary, Meta } from "@/types/scoreService";
import { Innings } from "@/types/ViewerMatch";

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

  runsAdded: number;
  batsmanRuns: number;
  byRuns: number;
  extraRuns: number;

  isLegalBall: boolean;
  isWicket: boolean;
  isOverComplete: boolean;
  shouldFlipStrike: boolean;

  overNumber: number;
  ballNumber: number;

  timestamp: string;
}
