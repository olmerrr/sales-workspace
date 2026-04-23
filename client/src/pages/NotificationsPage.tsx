import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import AlertBanner from '../components/AlertBanner';
import {
  clearNotificationsError,
  fetchNotifications,
  readAllNotifications,
  readNotification,
} from '../features/notifications/notificationsSlice';

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications.items);
  const status = useAppSelector((state) => state.notifications.status);
  const error = useAppSelector((state) => state.notifications.error);
  const unreadCount = notifications.filter((notification) => !notification.readAt).length;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchNotifications());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (!error) {
      return undefined;
    }
    const timer = setTimeout(() => {
      dispatch(clearNotificationsError());
    }, 3000);
    return () => clearTimeout(timer);
  }, [dispatch, error]);

  return (
    <section className="grid gap-4">
      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Notifications ({notifications.length})</h2>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-slate-600 px-2 py-1 text-xs text-slate-300">
              Unread: {unreadCount}
            </span>
            <button
              type="button"
              onClick={() => dispatch(readAllNotifications())}
              className="rounded-xl border border-slate-600 px-3 py-2 text-sm transition hover:border-indigo-400 hover:bg-indigo-500/20"
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
            <button
              type="button"
              onClick={() => dispatch(fetchNotifications())}
              className="rounded-xl border border-slate-600 px-3 py-2 text-sm transition hover:border-indigo-400 hover:bg-indigo-500/20"
            >
              Refresh
            </button>
          </div>
        </div>
        <AlertBanner type="error" message={error} />
        <ul className="grid gap-2">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`rounded-xl border px-3 py-3 ${
                notification.readAt
                  ? 'border-slate-700 bg-slate-950/50'
                  : 'border-indigo-500/40 bg-indigo-500/10'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{notification.title}</p>
                <p className="text-xs text-slate-400">{formatDate(notification.createdAt)}</p>
              </div>
              <p className="mt-1 text-sm text-slate-300">{notification.message}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full border border-slate-600 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                  {notification.type}
                </span>
                {!notification.readAt && (
                  <button
                    type="button"
                    onClick={() => dispatch(readNotification(notification.id))}
                    className="rounded-lg border border-slate-600 px-2 py-1 text-xs transition hover:border-indigo-400 hover:bg-indigo-500/20"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </li>
          ))}
          {notifications.length === 0 && <li className="text-sm text-slate-300">No notifications yet.</li>}
        </ul>
      </section>
    </section>
  );
}
