import { configureStore } from '@reduxjs/toolkit';
import teamSlice from './slices/teamSlice';

export const store = configureStore({
  reducer: {
    teams: teamSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;