import apiClient from '../utils/api';

export interface TeamData {
  name: string;
  short_name: string;
  logo_url?: string;
  location?: string;
}

export interface Team extends TeamData {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  code: string;
  data?: T;
  error?: string;
}

export interface PaginatedData<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TeamsResponse extends PaginatedData<Team> {}

export interface TeamSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  searchBy?: string;
  sort?: 'ASC' | 'DESC';
  sortBy?: string;
}

export interface TeamSearchQuery {
  name?: string;
  location?: string;
}

export const TeamService = {
  // Create team
  create: async (data: TeamData) => {
    return apiClient.post<ApiResponse<Team>>('teams', data);
  },

  // Get all teams with pagination and filters
  getAll: async (params: TeamSearchParams = {}) => {
    return apiClient.get<ApiResponse<TeamsResponse>>('teams', params);
  },

  // Search teams
  search: async (query: TeamSearchQuery) => {
    return apiClient.get<ApiResponse<Team[]>>('teams/search', query);
  },

  // Get team by ID
  getById: async (id: number) => {
    return apiClient.get<ApiResponse<Team>>(`teams/${id}`);
  },

  // Update team
  update: async (id: number, data: Partial<TeamData>) => {
    return apiClient.put<ApiResponse<Team>>(`teams/${id}`, data);
  },

  // Delete team
  delete: async (id: number) => {
    return apiClient.delete<ApiResponse<void>>(`teams/${id}`);
  }
};