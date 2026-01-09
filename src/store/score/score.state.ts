import { ScoreType } from "./scoreTypes";

export interface ScoreState {
    loading: boolean;
    error: string | null;
    data: ScoreType | null;
}