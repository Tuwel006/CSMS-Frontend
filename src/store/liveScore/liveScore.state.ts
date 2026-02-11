import { MatchScoreResponse } from "@/types/scoreService";

export interface LiveScoreState {
    loading: boolean;
    error: string | null;
    data: MatchScoreResponse | null;
    isConnected: boolean;
}
