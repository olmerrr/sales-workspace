import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { clearSession, getStoredSession, login, register } from '../../api';
import type { AuthSession, LoginPayload, RegisterPayload, RequestError, RequestStatus } from '../../types';

interface AuthState {
  session: AuthSession | null;
  status: RequestStatus;
  error: string;
}

const initialState: AuthState = {
  session: getStoredSession(),
  status: 'idle',
  error: '',
};

export const loginUser = createAsyncThunk<AuthSession, LoginPayload, { rejectValue: string }>(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      return await login(payload);
    } catch (error) {
      return rejectWithValue((error as RequestError).message || 'Login failed');
    }
  },
);

export const registerUser = createAsyncThunk<AuthSession, RegisterPayload, { rejectValue: string }>(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      return await register(payload);
    } catch (error) {
      return rejectWithValue((error as RequestError).message || 'Registration failed');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      clearSession();
      state.session = null;
      state.error = '';
      state.status = 'idle';
    },
    clearAuthError(state) {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.session = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.session = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
