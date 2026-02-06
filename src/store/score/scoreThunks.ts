import { MatchService } from "@/services/matchService";
import { RecordBallPayload } from "@/types/scoreService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BallEvent } from "./scoreTypes";

const recordBall = createAsyncThunk<{ data: BallEvent, message: string }, RecordBallPayload, { rejectValue: string }>(
    "score/recordBall",
    async (payload: RecordBallPayload, { rejectWithValue }) => {
        try {
            const res = await MatchService.recordBall(payload);
            return {
                data: res.data as BallEvent,
                message: res.message
            };
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to record ball');
        }
    });

export { recordBall };