import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TeamData {
    id: string | null;
    name: string;
    location: string;
}

interface PlayerData {
    id: string | null;
    name: string;
}

interface TeamManagementState {
    team1: TeamData;
    team1Players: PlayerData[];
    team2: TeamData;
    team2Players: PlayerData[];
}

const loadState = (): TeamManagementState => {
    try {
        const serializedState = localStorage.getItem('teamManagementState');
        if (serializedState === null) {
            return {
                team1: { id: null, name: '', location: '' },
                team1Players: [],
                team2: { id: null, name: '', location: '' },
                team2Players: [],
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return {
            team1: { id: null, name: '', location: '' },
            team1Players: [],
            team2: { id: null, name: '', location: '' },
            team2Players: [],
        };
    }
};

const initialState: TeamManagementState = loadState();

const teamManagementSlice = createSlice({
    name: 'teamManagement',
    initialState,
    reducers: {
        setTeam1: (state, action: PayloadAction<Partial<TeamData>>) => {
            state.team1 = { ...state.team1, ...action.payload };
            localStorage.setItem('teamManagementState', JSON.stringify(state));
        },
        setTeam2: (state, action: PayloadAction<Partial<TeamData>>) => {
            state.team2 = { ...state.team2, ...action.payload };
            localStorage.setItem('teamManagementState', JSON.stringify(state));
        },
        addTeam1Player: (state, action: PayloadAction<PlayerData>) => {
            state.team1Players.push(action.payload);
            localStorage.setItem('teamManagementState', JSON.stringify(state));
        },
        addTeam2Player: (state, action: PayloadAction<PlayerData>) => {
            state.team2Players.push(action.payload);
            localStorage.setItem('teamManagementState', JSON.stringify(state));
        },
        resetTeam1: (state) => {
            state.team1 = { id: null, name: '', location: '' };
            localStorage.setItem('teamManagementState', JSON.stringify(state));
        },
        resetTeam2: (state) => {
            state.team2 = { id: null, name: '', location: '' };
            localStorage.setItem('teamManagementState', JSON.stringify(state));
        },
        resetTeam1Players: (state) => {
            state.team1Players = [];
            localStorage.setItem('teamManagementState', JSON.stringify(state));
        },
        resetTeam2Players: (state) => {
            state.team2Players = [];
            localStorage.setItem('teamManagementState', JSON.stringify(state));
        },
    },
});

export const {
    setTeam1,
    setTeam2,
    addTeam1Player,
    addTeam2Player,
    resetTeam1,
    resetTeam2,
    resetTeam1Players,
    resetTeam2Players,
} = teamManagementSlice.actions;

export default teamManagementSlice.reducer;
