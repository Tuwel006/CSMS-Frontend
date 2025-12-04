import apiClient from '../utils/api';
import { ApiResponse } from '../types/api';
import { PaginatedData } from '../types/pagination';

export interface PlayerData {
  name: string;
  role?: string;
  location?: string;
}

export interface Player extends PlayerData {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerSearchQuery {
  name?: string;
  role?: string;
  location?: string;
}

export const PlayerService = {
  // Search players
  search: async (query: PlayerSearchQuery): Promise<ApiResponse<PaginatedData<Player>>> => {
    return apiClient.get<PaginatedData<Player>>('players/search', query);
  },

  // Get player by ID
  getById: async (id: number) => {
    return apiClient.get<Player>(`players/${id}`);
  },

  // Create player
  create: async (data: PlayerData) => {
    return apiClient.post<Player>('players', data);
  },

  // Update player
  update: async (id: number, data: Partial<PlayerData>) => {
    return apiClient.put<Player>(`players/${id}`, data);
  },

  // Delete player
  delete: async (id: number) => {
    return apiClient.delete<void>(`players/${id}`);
  }
};