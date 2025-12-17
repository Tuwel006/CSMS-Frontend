import apiClient from '../utils/api';
import { ApiResponse } from '../types/api';
import { ScheduleMatchPayload, ScheduleMatchResponse } from '../types/matchSchedule';
import { MatchData, MatchTokenResponse, TeamSetupPayload, TeamSetupResponse, CurrentMatchResponse, DeleteTokenResponse, UpdateTeamPayload } from '../types/matchService';



export const MatchService = {
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

    // Update Team
    updateTeam: async (matchId: string, teamId: number, payload: UpdateTeamPayload): Promise<ApiResponse<TeamSetupResponse>> => {
        return apiClient.patch(`matches/team-setup/${matchId}/${teamId}`, payload);
    },

    // Schedule Match
    scheduleMatch: async (matchId: string, payload: ScheduleMatchPayload): Promise<ApiResponse<ScheduleMatchResponse>> => {
        console.log('Scheduling match with payload:',);
        return apiClient.patch(`matches/schedule/${matchId}`, payload);
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
    }
};
