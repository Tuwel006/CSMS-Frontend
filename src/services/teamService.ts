import apiClient from '../utils/api';
import { ApiResponse } from '../types/api';
import { PaginatedData } from '../types/pagination';
import type { TeamData, Team, TeamSearchParams, TeamSearchQuery } from '../types/teamService';

export type { Team, TeamData, TeamSearchParams, TeamSearchQuery };

export const TeamService = {
  // Create team
  create: async (data: TeamData) => {
    return apiClient.post<Team>('teams', data);
  },

  // Get all teams with pagination and filters
  getAll: async (params: TeamSearchParams = {}): Promise<ApiResponse<PaginatedData<Team>>> => {
    return apiClient.get<PaginatedData<Team>>('teams', params);
  },

  // Search teams
  search: async (query: TeamSearchQuery): Promise<ApiResponse<PaginatedData<Team>>> => {
    return apiClient.get<PaginatedData<Team>>('teams/search', query);
  },

  // Get team by ID
  getById: async (id: number) => {
    return apiClient.get<Team>(`teams/${id}`);
  },

  // Update team
  update: async (id: number, data: Partial<TeamData>) => {
    return apiClient.put<Team>(`teams/${id}`, data);
  },

  // Delete team
  delete: async (id: number) => {
    return apiClient.delete<void>(`teams/${id}`);
  }
};