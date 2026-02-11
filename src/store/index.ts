import { configureStore } from '@reduxjs/toolkit';
import teamSlice from './slices/teamSlice';
import teamManagementReducer from './slices/teamManagementSlice';
import scoreReducer from './score/scoreSlice';
import liveScoreReducer from './liveScore/liveScoreSlice';

export const store = configureStore({
  reducer: {
    teams: teamSlice,
    teamManagement: teamManagementReducer,
    score: scoreReducer,
    liveScore: liveScoreReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;