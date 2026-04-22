import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import leadsReducer from '../features/leads/leadsSlice';
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
