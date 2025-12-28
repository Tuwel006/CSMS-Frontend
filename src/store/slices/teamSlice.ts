import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Team } from '../../types/match';
import type { Player } from '../../types/player';

interface TeamState {
  teams: { [key: string]: Team };
  loading: boolean;
  error: string | null;
}

const loadFromStorage = (): { [key: string]: Team } => {
  const data = localStorage.getItem('cricket_teams');
  return data ? JSON.parse(data) : {};
};

const saveToStorage = (teams: { [key: string]: Team }) => {
  localStorage.setItem('cricket_teams', JSON.stringify(teams));
};

const initialState: TeamState = {
  teams: loadFromStorage(),
  loading: false,
  error: null
};

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setTeam: (state, action: PayloadAction<{ name: string; value: string }>) => {
      const { name, value } = action.payload;
      if (!state.teams[name]) {
        state.teams[name] = {
          id: Date.now(),
          name: value,
          players: [],
          playing11: [],
          battingOrder: []
        };
      } else {
        state.teams[name].name = value;
      }
      saveToStorage(state.teams);
    },
    
    setPlayer: (state, action: PayloadAction<{ teamName: string; player: Player }>) => {
      const { teamName, player } = action.payload;
      if (state.teams[teamName]) {
        const existingIndex = state.teams[teamName].players.findIndex(p => p.id === player.id);
        if (existingIndex >= 0) {
          if (player.id !== null) {
            state.teams[teamName].players[existingIndex] = { 
              ...player, 
              id: player.id,
              role: player.role as 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper'
            };
          }
        } else {
          if (player.id !== null) {
            state.teams[teamName].players.push({ 
              ...player, 
              id: player.id,
              role: player.role as 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper'
            });
          }
        }
        saveToStorage(state.teams);
      }
    },

    updateTeam: (state, action: PayloadAction<{ name: string; team: Partial<Team> }>) => {
      const { name, team } = action.payload;
      if (state.teams[name]) {
        state.teams[name] = { ...state.teams[name], ...team };
        saveToStorage(state.teams);
      }
    },

    deleteTeam: (state, action: PayloadAction<string>) => {
      const teamName = action.payload;
      delete state.teams[teamName];
      saveToStorage(state.teams);
    },

    deletePlayer: (state, action: PayloadAction<{ teamName: string; playerId: string }>) => {
      const { teamName, playerId } = action.payload;
      if (state.teams[teamName]) {
        state.teams[teamName].players = state.teams[teamName].players.filter(p => p.id !== null && p.id !== Number(playerId));
        state.teams[teamName].playing11 = state.teams[teamName].playing11.filter(id => id !== Number(playerId));
        state.teams[teamName].battingOrder = state.teams[teamName].battingOrder.filter(id => id !== Number(playerId));
        saveToStorage(state.teams);
      }
    },

    clearTeam: (state, action: PayloadAction<string>) => {
      const teamName = action.payload;
      if (state.teams[teamName]) {
        state.teams[teamName].players = [];
        state.teams[teamName].playing11 = [];
        state.teams[teamName].battingOrder = [];
        saveToStorage(state.teams);
      }
    },

    clearPlayers: (state, action: PayloadAction<string>) => {
      const teamName = action.payload;
      if (state.teams[teamName]) {
        state.teams[teamName].players = [];
        state.teams[teamName].playing11 = [];
        state.teams[teamName].battingOrder = [];
        saveToStorage(state.teams);
      }
    },

    clearAllTeams: (state) => {
      state.teams = {};
      localStorage.removeItem('cricket_teams');
    },

    loadTeams: (state) => {
      state.teams = loadFromStorage();
    }
  }
});

export const {
  setTeam,
  setPlayer,
  updateTeam,
  deleteTeam,
  deletePlayer,
  clearTeam,
  clearPlayers,
  clearAllTeams,
  loadTeams
} = teamSlice.actions;

export default teamSlice.reducer;