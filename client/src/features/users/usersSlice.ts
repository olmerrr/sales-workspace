import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { createUser, getUsers } from '../../api';
import type { CreateUserPayload, RequestError, RequestStatus, User } from '../../types';

interface UsersState {
  items: User[];
  status: RequestStatus;
  error: string;
}

const initialState: UsersState = {
  items: [],
  status: 'idle',
  error: '',
};

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await getUsers();
    } catch (error) {
      return rejectWithValue((error as RequestError).message || 'Failed to load users');
    }
  },
);

export const addUser = createAsyncThunk<User, CreateUserPayload, { rejectValue: string }>(
  'users/addUser',
  async (payload, { rejectWithValue }) => {
    try {
      return await createUser(payload);
    } catch (error) {
      return rejectWithValue((error as RequestError).message || 'Failed to create user');
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUsers(state) {
      state.items = [];
      state.status = 'idle';
      state.error = '';
    },
    clearUsersError(state) {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load users';
      })
      .addCase(addUser.pending, (state) => {
        state.error = '';
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(addUser.rejected, (state, action) => {
        state.error = action.payload || 'Failed to create user';
      });
  },
});

export const { resetUsers, clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;
