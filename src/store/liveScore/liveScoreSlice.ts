import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LiveScoreState } from "./liveScore.state";
import { subscribeLiveScore } from "./liveScoreThunks";
import { MatchScoreResponse } from "@/types/scoreService";
import { LiveScorePayload } from "./liveScoreTypes";
import { mergeLiveScoreIntoMatch } from "./mergeLiveScore";

const initialState: LiveScoreState = {
    loading: false,
    error: null,
    data: null,
    isConnected: false,
};

export const liveScoreSlice = createSlice({
    name: "liveScore",
    initialState,
    reducers: {
        // Set initial match score data
        setMatchScore(state, action: PayloadAction<MatchScoreResponse>) {
            state.data = action.payload;
            state.error = null;
        },

        // Update specific innings data from SSE
        updateInningsScore(state, action: PayloadAction<LiveScorePayload>) {
            if (state.data) {
                state.data = mergeLiveScoreIntoMatch(state.data, action.payload);
            }
            state.error = null;
        },

        // Clear live score data
        clearLiveScore(state) {
            state.data = null;
            state.error = null;
            state.loading = false;
            state.isConnected = false;
        },

        // Set connection status
        setConnectionStatus(state, action: PayloadAction<boolean>) {
            state.isConnected = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // SSE subscription handlers
            .addCase(subscribeLiveScore.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(subscribeLiveScore.fulfilled, (state) => {
                state.loading = false;
                state.isConnected = true;
            })
            .addCase(subscribeLiveScore.rejected, (state, action) => {
                state.loading = false;
                state.isConnected = false;
                state.error = action.payload || 'Failed to subscribe to live score';
            });
    },
});

export const { setMatchScore, updateInningsScore, clearLiveScore, setConnectionStatus } = liveScoreSlice.actions;
export default liveScoreSlice.reducer;
