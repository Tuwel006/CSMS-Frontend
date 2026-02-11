import { RootState } from "../index";

export const selectLiveScoreData = (state: RootState) => state.liveScore.data;
export const selectLiveScoreLoading = (state: RootState) => state.liveScore.loading;
export const selectLiveScoreError = (state: RootState) => state.liveScore.error;
export const selectLiveScoreConnectionStatus = (state: RootState) => state.liveScore.isConnected;
