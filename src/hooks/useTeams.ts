import { useState, useEffect } from 'react';
import { TeamService, Team, TeamData, TeamSearchParams, TeamSearchQuery } from '../services/teamService';

interface UseTeamsReturn {
  teams: Team[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  createTeam: (data: TeamData) => Promise<Team>;
  updateTeam: (id: number, data: Partial<TeamData>) => Promise<Team>;
  deleteTeam: (id: number) => Promise<void>;
  getTeam: (id: number) => Promise<Team>;
  searchTeams: (query: string) => Promise<string[]>;
  getTeamSuggestions: (query: string) => Promise<string[]>;
  fetchTeams: (params?: TeamSearchParams) => Promise<void>;
  refetch: () => Promise<void>;
}

const useTeams = (initialParams: TeamSearchParams = {}): UseTeamsReturn => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialParams.page || 1);
  const [limit, setLimit] = useState(initialParams.limit || 10);
  const [currentParams, setCurrentParams] = useState(initialParams);

  const fetchTeams = async (params: TeamSearchParams = currentParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await TeamService.getAll(params);
      if (response.data) {
        setTeams(response.data.data);
        setTotal(response.data.meta.total);
        setPage(response.data.meta.page);
        setLimit(response.data.meta.limit);
      }
      setCurrentParams(params);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (data: TeamData): Promise<Team> => {
    try {
      setLoading(true);
      setError(null);
      const response = await TeamService.create(data);
      if (response.data) {
        setTeams(prev => [response.data!, ...prev]);
        setTotal(prev => prev + 1);
        return response.data;
      }
      throw new Error('No data returned');
    } catch (err: any) {
      setError(err.message || 'Failed to create team');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTeam = async (id: number, data: Partial<TeamData>): Promise<Team> => {
    try {
      setLoading(true);
      setError(null);
      const response = await TeamService.update(id, data);
      if (response.data) {
        setTeams(prev => prev.map(team => team.id === id ? response.data! : team));
        return response.data;
      }
      throw new Error('No data returned');
    } catch (err: any) {
      setError(err.message || 'Failed to update team');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await TeamService.delete(id);
      setTeams(prev => prev.filter(team => team.id !== id));
      setTotal(prev => prev - 1);
    } catch (err: any) {
      setError(err.message || 'Failed to delete team');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTeam = async (id: number): Promise<Team> => {
    try {
      setLoading(true);
      setError(null);
      const response = await TeamService.getById(id);
      if (response.data) {
        return response.data;
      }
      throw new Error('No data returned');
    } catch (err: any) {
      setError(err.message || 'Failed to get team');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchTeams = async (query: string): Promise<string[]> => {
    try {
      const response = await TeamService.search({ name: query });
      if (response.data) {
        return response.data.map((team: Team) => `${team.name} - ${team.location || 'Unknown'} - (${team.id})`);
      }
      return [];
    } catch (err: any) {
      console.error('Search failed:', err);
      return [];
    }
  };

  const getTeamSuggestions = async (query: string): Promise<string[]> => {
    // if (query.length < 2) return [];
    return await searchTeams(query);
  };

  const refetch = () => fetchTeams(currentParams);

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    loading,
    error,
    total,
    page,
    limit,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeam,
    searchTeams,
    getTeamSuggestions,
    fetchTeams,
    refetch
  };
};

export default useTeams;