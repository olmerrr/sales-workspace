import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../../api';
import type { Notification, RequestError, RequestStatus } from '../../types';

interface NotificationsState {
  items: Notification[];
  status: RequestStatus;
  error: string;
}

const initialState: NotificationsState = {
  items: [],
  status: 'idle',
  error: '',
};

export const fetchNotifications = createAsyncThunk<Notification[], void, { rejectValue: string }>(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      return await getNotifications();
    } catch (error) {
      return rejectWithValue((error as RequestError).message || 'Failed to load notifications');
    }
  },
);

export const readNotification = createAsyncThunk<string, string, { rejectValue: string }>(
  'notifications/readNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await markNotificationAsRead(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue((error as RequestError).message || 'Failed to update notification');
    }
  },
);

export const readAllNotifications = createAsyncThunk<void, void, { rejectValue: string }>(
  'notifications/readAllNotifications',
  async (_, { rejectWithValue }) => {
    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      return rejectWithValue((error as RequestError).message || 'Failed to update notifications');
    }
  },
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    resetNotifications(state) {
      state.items = [];
      state.status = 'idle';
      state.error = '';
    },
    clearNotificationsError(state) {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load notifications';
      })
      .addCase(readNotification.fulfilled, (state, action) => {
        const item = state.items.find((notification) => notification.id === action.payload);
        if (item && !item.readAt) {
          item.readAt = new Date().toISOString();
        }
      })
      .addCase(readNotification.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update notification';
      })
      .addCase(readAllNotifications.fulfilled, (state) => {
        const now = new Date().toISOString();
        state.items = state.items.map((notification) =>
          notification.readAt ? notification : { ...notification, readAt: now },
        );
      })
      .addCase(readAllNotifications.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update notifications';
      });
  },
});

export const { resetNotifications, clearNotificationsError } = notificationsSlice.actions;
export default notificationsSlice.reducer;
