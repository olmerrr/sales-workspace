import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { createLead, getLeads } from '../../api';
import type { CreateLeadPayload, Lead, RequestError, RequestStatus } from '../../types';

interface LeadsState {
  items: Lead[];
  status: RequestStatus;
  error: string;
}

const initialState: LeadsState = {
  items: [],
  status: 'idle',
  error: '',
};

export const fetchLeads = createAsyncThunk<Lead[], void, { rejectValue: string }>(
  'leads/fetchLeads',
  async (_, { rejectWithValue }) => {
    try {
      return await getLeads();
    } catch (error) {
      return rejectWithValue((error as RequestError).message || 'Failed to load leads');
    }
  },
);

export const addLead = createAsyncThunk<Lead, CreateLeadPayload, { rejectValue: string }>(
  'leads/addLead',
  async (payload, { rejectWithValue }) => {
    try {
      return await createLead(payload);
    } catch (error) {
      return rejectWithValue((error as RequestError).message || 'Failed to create lead');
    }
  },
);

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    resetLeads(state) {
      state.items = [];
      state.status = 'idle';
      state.error = '';
    },
    clearLeadsError(state) {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load leads';
      })
      .addCase(addLead.pending, (state) => {
        state.error = '';
      })
      .addCase(addLead.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(addLead.rejected, (state, action) => {
        state.error = action.payload || 'Failed to create lead';
      });
  },
});

export const { resetLeads, clearLeadsError } = leadsSlice.actions;
export default leadsSlice.reducer;
