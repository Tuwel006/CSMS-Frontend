import { LiveScorePayload } from "./liveScoreTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient, { routes } from "@/utils/api";
import { updateInningsScore, setConnectionStatus } from "./liveScoreSlice";

// Shared reference to the current SSE connection for cleanup
let activeStream: { close: () => void } | null = null;

/**
 * Subscribe to SSE live score updates
 */
const subscribeLiveScore = createAsyncThunk<
    void,
    { matchId: string },
    { rejectValue: string }
>(
    "liveScore/subscribeLiveScore",
    async ({ matchId }, { dispatch, rejectWithValue }) => {
        try {
            // Close any existing stream
            if (activeStream) {
                activeStream.close();
            }

            const stream = apiClient.event<LiveScorePayload>(
                routes.sse.liveScore(matchId),
                {
                    onMessage: (data) => {
                        console.log('SSE Message Received:', data);
                        // Directly dispatch to Redux store
                        dispatch(updateInningsScore(data));
                    },
                    onError: (error) => {
                        console.error('SSE Error for match:', matchId, error.message);
                        dispatch(setConnectionStatus(false));
                    },
                    onOpen: () => {
                        console.log('SSE Connection opened for match:', matchId);
                        dispatch(setConnectionStatus(true));
                    },
                    onComplete: () => {
                        console.log('SSE Connection completed for match:', matchId);
                        dispatch(setConnectionStatus(false));
                    }
                }
            );

            activeStream = { close: stream.close };
            return;
        } catch (error: any) {
            return rejectWithValue(error?.message || 'Failed to subscribe to live score');
        }
    }
);

/**
 * Manual cleanup for the live score stream
 */
export const unsubscribeLiveScore = () => {
    if (activeStream) {
        activeStream.close();
        activeStream = null;
    }
};

export { subscribeLiveScore };
