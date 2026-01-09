import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BallEvent, ScoreType } from "./scoreTypes";
import { ScoreState } from "./score.state";
import { recordBall } from "./scoreThunks";
import { applyBallEvent } from "./applyBallEvent";

const initialState: ScoreState = {
    loading: false,
    error: null,
    data: null,
};

export const scoreSlice = createSlice({
    name: "score",
    initialState,
    reducers: {
        setScore(state, action: PayloadAction<ScoreType>) {
            state.data = action.payload;
        },

        clearScore(state) {
            state.data = null;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(recordBall.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(recordBall.fulfilled, (state, action: PayloadAction<BallEvent>) => {
                state.loading = false;
                if(state.data) {
                    applyBallEvent(state.data, action.payload);
                }
            })
            .addCase(recordBall.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to record ball';
            });
    },
});