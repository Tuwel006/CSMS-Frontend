import apiClient from '../utils/api';
import { ApiResponse } from '../types/api';
import { ScheduleMatchPayload, ScheduleMatchResponse } from '../types/matchSchedule';
import { MatchData, MatchTokenResponse, TeamSetupPayload, TeamSetupResponse, CurrentMatchResponse, DeleteTokenResponse, UpdateTeamPayload, StartMatchPayload, StartMatchResponse } from '../types/matchService';
import { MatchScoreResponse, RecordBallPayload } from '../types/scoreService';
import { MatchDetails } from '../types/scorecard';
import { PaginatedData } from '../types/pagination';

export const MatchService = {
    // Get Matches
    getMatches: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedData<MatchDetails>>> => {
        return apiClient.get(`matches?page=${page}&limit=${limit}`);
    },

    // Get All Matches
    getAllMatches: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedData<MatchDetails>>> => {
        return apiClient.get(`matches/all?page=${page}&limit=${limit}`);
    },

    // Get Tenant Matches (Sessions)
    getTenantMatches: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedData<any>>> => {
        return apiClient.get(`matches/tenant?page=${page}&limit=${limit}&sorted=createdAt&sorted_order=DESC`);
    },

    // Generate Match Token
    generateToken: async (): Promise<ApiResponse<MatchTokenResponse>> => {
        return apiClient.post<MatchTokenResponse>('matches/generate-token', {});
    },

    // Delete Match Token
    deleteToken: async (tokenId: string): Promise<ApiResponse<DeleteTokenResponse>> => {
        return apiClient.delete(`matches/delete-token/${tokenId}`);
    },

    // Team Setup
    teamSetup: async (payload: TeamSetupPayload): Promise<ApiResponse<TeamSetupResponse>> => {
        return apiClient.post('matches/team-setup', payload);
    },

    // Get Current Match
    getCurrentMatch: async (matchId: string): Promise<ApiResponse<CurrentMatchResponse>> => {
        return apiClient.get<CurrentMatchResponse>(`matches/current/${matchId}`);
    },

    // Get Match Score
    getMatchScore: async (matchId: string): Promise<ApiResponse<MatchScoreResponse>> => {
        return apiClient.get(`matches/${matchId}/score`);
    },

    // Set Batsman
    setBatsman: async (matchId: string, payload: any): Promise<ApiResponse<any>> => {
        return apiClient.post(`matches/${matchId}/set-batsman`, payload);
    },

    // Get Available Batsmen
    getAvailableBatsmen: async (matchId: string, inningsNumber: number): Promise<ApiResponse<any>> => {
        return apiClient.get(`matches/${matchId}/innings/${inningsNumber}/available-batsmen`);
    },

    // Set Bowler
    setBowler: async (matchId: string, payload: any): Promise<ApiResponse<any>> => {
        return apiClient.post(`matches/${matchId}/set-bowler`, payload);
    },

    // Get Bowling Team
    getBowlingTeam: async (matchId: string, inningsNumber: number): Promise<ApiResponse<any>> => {
        return apiClient.get(`matches/${matchId}/innings/${inningsNumber}/bowling-team`);
    },

    // Update Team
    updateTeam: async (matchId: string, teamId: number, payload: UpdateTeamPayload): Promise<ApiResponse<TeamSetupResponse>> => {
        return apiClient.patch(`matches/team-setup/${matchId}/${teamId}`, payload);
    },

    // Schedule Match
    scheduleMatch: async (matchId: string, payload: ScheduleMatchPayload): Promise<ApiResponse<ScheduleMatchResponse>> => {
        console.log('Scheduling match with payload:',);
        return apiClient.patch(`matches/schedule/${matchId}`, payload);
    },

    // Start Match
    startMatch: async (matchId: string, payload: StartMatchPayload): Promise<ApiResponse<StartMatchResponse>> => {
        return apiClient.patch(`matches/start/${matchId}`, payload);
    },

    // Record Ball
    recordBall: async ({ matchId, ...payload }: RecordBallPayload): Promise<ApiResponse<any>> => {
        return apiClient.post(`matches/${matchId}/record-ball`, payload);
    },

    create: async (data: MatchData) => {
        // TODO: Replace with actual API endpoint
        // return apiClient.post('matches', data);

        // Mock response for now
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        ...data,
                        id: Math.floor(Math.random() * 1000),
                        status: 'scheduled'
                    }
                });
            }, 1000);
        });
    },

    // ============================================
    // EVENT STREAM METHODS
    // ============================================

    /**
     * Subscribe to live match score updates
     * @param matchId - The match ID to subscribe to
     * @param callbacks - Event handlers for the stream
     * @returns Object with close method to terminate the stream
     * 
     * @example
     * const stream = MatchService.subscribeLiveScore('match-123', {
     *   onMessage: (score) => console.log('Score update:', score),
     *   onError: (error) => console.error('Error:', error)
     * });
     * 
     * // Later, close the stream
     * stream.close();
     */
    subscribeLiveScore: (
        matchId: string,
        callbacks: {
            onMessage?: (data: MatchScoreResponse, rawEvent?: MessageEvent) => void;
            onError?: (error: { message: string; event?: Event }) => void;
            onComplete?: () => void;
            onOpen?: () => void;
        }
    ) => {
        return apiClient.event<MatchScoreResponse>(
            `matches/${matchId}/live-score`,
            callbacks
        );
    },

    /**
     * Subscribe to live match events (ball-by-ball updates)
     * @param matchId - The match ID to subscribe to
     * @param callbacks - Event handlers for the stream
     * @returns Object with close method to terminate the stream
     */
    subscribeLiveEvents: (
        matchId: string,
        callbacks: {
            onMessage?: (data: any, rawEvent?: MessageEvent) => void;
            onError?: (error: { message: string; event?: Event }) => void;
            onComplete?: () => void;
            onOpen?: () => void;
        }
    ) => {
        return apiClient.event(
            `matches/${matchId}/live-events`,
            callbacks
        );
    },

    /**
     * Subscribe to match commentary updates
     * @param matchId - The match ID to subscribe to
     * @param callbacks - Event handlers for the stream
     * @returns Object with close method to terminate the stream
     */
    subscribeCommentary: (
        matchId: string,
        callbacks: {
            onMessage?: (data: any, rawEvent?: MessageEvent) => void;
            onError?: (error: { message: string; event?: Event }) => void;
            onComplete?: () => void;
            onOpen?: () => void;
        }
    ) => {
        return apiClient.event(
            `matches/${matchId}/commentary`,
            callbacks
        );
    },

    /**
     * Subscribe to match status updates
     * @param matchId - The match ID to subscribe to
     * @param callbacks - Event handlers for the stream
     * @returns Object with close method to terminate the stream
     */
    subscribeMatchStatus: (
        matchId: string,
        callbacks: {
            onMessage?: (data: any, rawEvent?: MessageEvent) => void;
            onError?: (error: { message: string; event?: Event }) => void;
            onComplete?: () => void;
            onOpen?: () => void;
        }
    ) => {
        return apiClient.event(
            `matches/${matchId}/status`,
            callbacks
        );
    },
};

