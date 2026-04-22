import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { API_DOCS_URL } from '../config';

interface ProjectInfoPageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function ProjectInfoPage({ theme, onToggleTheme }: ProjectInfoPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-xl shadow-indigo-950/30 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-semibold sm:text-4xl">Sales Workspace</h1>
            <div className="flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              <Link
                to="/"
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
              >
                Open login
              </Link>
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-slate-300">
            One workspace for your team, customers, and deals - clear, fast, and focused.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
              <h2 className="text-lg font-semibold">Authentication</h2>
              <ul className="mt-2 grid gap-1 text-sm text-slate-300">
                <li>Register and login flow</li>
                <li>JWT access and refresh tokens</li>
                <li>Auto-refresh on protected requests</li>
              </ul>
            </section>

            <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
              <h2 className="text-lg font-semibold">Team and users</h2>
              <ul className="mt-2 grid gap-1 text-sm text-slate-300">
                <li>User directory with profiles</li>
                <li>Create new team members</li>
                <li>Workspace stats in dashboard</li>
              </ul>
            </section>

            <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
              <h2 className="text-lg font-semibold">Leads pipeline</h2>
              <ul className="mt-2 grid gap-1 text-sm text-slate-300">
                <li>Lead status funnel and value</li>
                <li>Source analytics and recent leads</li>
                <li>Quick add form for sales flow</li>
              </ul>
            </section>
          </div>

          <div className="mt-6 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
            <p className="text-sm text-slate-200">
              API docs: <span className="font-semibold">{API_DOCS_URL}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
