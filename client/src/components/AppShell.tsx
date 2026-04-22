import { Outlet } from 'react-router-dom';

import type { User } from '../types';
import AppHeader from './AppHeader';
import AppNavigation from './AppNavigation';

interface AppShellProps {
  onLogout: () => void;
  currentUser?: User;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function AppShell({ onLogout, currentUser, theme, onToggleTheme }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <AppHeader currentUser={currentUser} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} />
        <AppNavigation />

        <Outlet />
      </div>
    </div>
  );
}
