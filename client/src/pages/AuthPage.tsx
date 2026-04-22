import { type FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import AlertBanner from '../components/AlertBanner';
import ThemeToggle from '../components/ThemeToggle';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuthError, loginUser, registerUser } from '../features/auth/authSlice';
import type { RegisterPayload } from '../types';

interface AuthPageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const initialForm: RegisterPayload = {
  email: '',
  password: '',
  name: '',
  bio: '',
};

export default function AuthPage({ theme, onToggleTheme }: AuthPageProps) {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState<RegisterPayload>(initialForm);
  const [success, setSuccess] = useState('');
  const isRegister = mode === 'register';
  const isLoading = status === 'loading';

  useEffect(() => {
    if (!error && !success) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setSuccess('');
      dispatch(clearAuthError());
    }, 3500);

    return () => clearTimeout(timer);
  }, [error, success, dispatch]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess('');
    dispatch(clearAuthError());

    const action = isRegister
      ? registerUser(form)
      : loginUser({ email: form.email, password: form.password });
    const result = await dispatch(action);
    if (result.meta.requestStatus === 'fulfilled') {
      setForm(initialForm);
      setSuccess(isRegister ? 'Account created.' : 'Welcome back.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex justify-end gap-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <Link
            to="/about"
            className="rounded-xl border border-slate-600 px-3 py-2 text-sm text-slate-200 transition hover:border-indigo-400 hover:bg-indigo-500/20"
          >
            About project
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-indigo-500/30 bg-slate-900/70 p-6 shadow-xl shadow-indigo-950/40">
            <h1 className="text-3xl font-semibold">Sales Workspace</h1>
            <p className="mt-3 text-slate-300">
              Manage your team and sales pipeline in one clean workspace.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-slate-300">
              <li>Dashboard with metrics</li>
              <li>Team management section</li>
              <li>Leads pipeline section</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-xl sm:p-6">
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-950 p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-lg px-3 py-2 text-sm ${!isRegister ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`rounded-lg px-3 py-2 text-sm ${isRegister ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
              >
                Create account
              </button>
            </div>

            <AlertBanner type="error" message={error} />
            <AlertBanner type="success" message={success} />

            <form onSubmit={onSubmit} className="grid gap-4">
              <label className="text-sm">
                <span className="mb-1 block text-slate-300">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-indigo-400 focus:ring"
                  required
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-slate-300">Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-indigo-400 focus:ring"
                  required
                />
              </label>

              {isRegister && (
                <>
                  <label className="text-sm">
                    <span className="mb-1 block text-slate-300">Name</span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                      autoComplete="name"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-indigo-400 focus:ring"
                      required
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block text-slate-300">Bio</span>
                    <textarea
                      value={form.bio}
                      onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
                      className="min-h-24 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-indigo-400 focus:ring"
                      required
                    />
                  </label>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
