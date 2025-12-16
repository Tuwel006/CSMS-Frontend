import apiClient from '../utils/api';
import { ApiResponse } from '../types/api';

export interface MatchData {
    team1_id: string;
    team2_id: string;
    venue: string;
    match_time: string;
    umpire?: string;
    date: string;
}

// Token Generation Response Interface
export interface MatchTokenResponse {
    id: string;
    is_active: boolean;
    tenant_id: number;
    team_a_id: string | null;
    team_b_id: string | null;
    match_date: string | null;
    format: string | null;
    venue: string | null;
    status: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface TeamSetupPayload {
    matchId?: string;
    team: {
        name: string;
        location: string;
        id?: number | null;
    };
    players: Array<{
        name: string;
        role: string;
        id?: number | null;
    }>;
}

export interface CurrentMatchResponse {
    id: string;
    match_date: string | null;
    format: string | null;
    venue: string | null;
    status: string | null;
    man_of_the_match: string | null;
    teamA: {
        id: number;
        name: string;
        short_name: string;
        players: Array<{
            id: number;
            name: string;
            role: string;
        }>;
    } | null;
    teamB: {
        id: number;
        name: string;
        short_name: string;
        players: Array<{
            id: number;
            name: string;
            role: string;
        }>;
    } | null;
}

export const MatchService = {
    // Generate Match Token
    generateToken: async (): Promise<ApiResponse<MatchTokenResponse>> => {
        return apiClient.post<MatchTokenResponse>('matches/generate-token', {});
    },

    // Delete Match Token
    deleteToken: async (tokenId: string): Promise<ApiResponse<any>> => {
        return apiClient.delete(`matches/delete-token/${tokenId}`);
    },

    // Team Setup
    teamSetup: async (payload: TeamSetupPayload): Promise<ApiResponse<any>> => {
        return apiClient.post('matches/team-setup', payload);
    },

    // Get Current Match
    getCurrentMatch: async (matchId: string): Promise<ApiResponse<CurrentMatchResponse>> => {
        return apiClient.get<CurrentMatchResponse>(`matches/current/${matchId}`);
    },

    // Update Team
    updateTeam: async (matchId: string, teamId: number, payload: { team: { id: number | null; name: string; location: string }; players: Array<{ id: number | null; name: string; role: string }> }): Promise<ApiResponse<any>> => {
        return apiClient.patch(`matches/team-setup/${matchId}/${teamId}`, payload);
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
