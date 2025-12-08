import { configureStore } from '@reduxjs/toolkit';
import teamSlice from './slices/teamSlice';
import teamManagementReducer from './slices/teamManagementSlice';

export const store = configureStore({
  reducer: {
    teams: teamSlice,
    teamManagement: teamManagementReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;