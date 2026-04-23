import { type FormEvent, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import AlertBanner from '../components/AlertBanner';
import { addUser, clearUsersError, fetchUsers } from '../features/users/usersSlice';
import type { CreateUserPayload, UserRole } from '../types';

const initialForm: CreateUserPayload = {
  name: '',
  bio: '',
  role: 'user',
};

const roles: UserRole[] = ['user', 'admin'];

export default function TeamPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.items);
  const status = useAppSelector((state) => state.users.status);
  const error = useAppSelector((state) => state.users.error);
  const [form, setForm] = useState<CreateUserPayload>(initialForm);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (!error && !success) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setSuccess('');
      dispatch(clearUsersError());
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, success, dispatch]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess('');
    const result = await dispatch(addUser(form));
    if (result.meta.requestStatus === 'fulfilled') {
      setForm(initialForm);
      setSuccess('User created.');
    }
  };

  const withBioCount = users.filter((user) => user.bio && user.bio.trim().length > 0).length;
  const withEmailCount = users.filter((user) => user.email && user.email.trim().length > 0).length;
  const adminsCount = users.filter((user) => user.role === 'admin').length;

  return (
    <section className="grid gap-4 lg:grid-cols-5">
      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 lg:col-span-2">
        <h2 className="mb-4 text-lg font-semibold">Add team member</h2>
        <AlertBanner type="error" message={error} />
        <AlertBanner type="success" message={success} />
        <form onSubmit={onSubmit} className="grid gap-3">
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Name"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-indigo-400 focus:ring"
            required
          />
          <textarea
            value={form.bio}
            onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
            placeholder="Bio"
            className="min-h-28 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-indigo-400 focus:ring"
            required
          />
          <select
            value={form.role}
            onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-indigo-400 focus:ring"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Saving...' : 'Create user'}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 lg:col-span-3">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Team list ({users.length})</h2>
          <button
            type="button"
            onClick={() => dispatch(fetchUsers())}
            className="rounded-xl border border-slate-600 px-3 py-2 text-sm transition hover:border-indigo-400 hover:bg-indigo-500/20"
          >
            Refresh
          </button>
        </div>
        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2">
            <p className="text-xs text-slate-400">Profiles with bio</p>
            <p className="text-sm font-semibold">{withBioCount}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2">
            <p className="text-xs text-slate-400">Profiles with email</p>
            <p className="text-sm font-semibold">{withEmailCount}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2">
            <p className="text-xs text-slate-400">Admins</p>
            <p className="text-sm font-semibold">{adminsCount}</p>
          </div>
        </div>
        <ul className="grid gap-2">
          {users.map((user) => (
            <li key={user.id} className="flex items-start justify-between rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{user.name}</p>
                  <span className="rounded-full border border-slate-600 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                    {user.role || 'user'}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{user.bio || 'No bio yet'}</p>
                <p className="mt-1 text-xs text-slate-400">{user.email || 'No email'}</p>
              </div>
              <span className="text-xs text-slate-400">#{user.id}</span>
            </li>
          ))}
          {users.length === 0 && <li className="text-sm text-slate-300">No users yet.</li>}
        </ul>
      </section>
    </section>
  );
}
