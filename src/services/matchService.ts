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

export const MatchService = {
    // Generate Match Token
    generateToken: async (): Promise<ApiResponse<MatchTokenResponse>> => {
        return apiClient.post<MatchTokenResponse>('matches/generate-token', {});
    },

    // Delete Match Token
    deleteToken: async (tokenId: string): Promise<ApiResponse<any>> => {
        return apiClient.delete(`matches/delete-token/${tokenId}`);
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
