import type { User } from '../types';
import LogoutButton from './LogoutButton';
import ThemeToggle from './ThemeToggle';

interface AppHeaderProps {
  currentUser?: User;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function AppHeader({ currentUser, onLogout, theme, onToggleTheme }: AppHeaderProps) {
  return (
    <header className="mb-5 flex flex-col gap-4 rounded-2xl border border-indigo-500/30 bg-slate-900/70 p-4 shadow-xl shadow-indigo-950/40 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Sales Workspace</h1>
        <p className="mt-1 text-sm text-slate-300 sm:text-base">
          From first contact to closed deal in one place
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-xs text-slate-400">Signed in as</p>
          <p className="text-sm font-medium">{currentUser?.email}</p>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <LogoutButton onClick={onLogout} />
      </div>
    </header>
  );
}
