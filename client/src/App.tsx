import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from './app/hooks';
import AppShell from './components/AppShell';
import { logout } from './features/auth/authSlice';
import { resetLeads } from './features/leads/leadsSlice';
import { resetNotifications } from './features/notifications/notificationsSlice';
import { resetUsers } from './features/users/usersSlice';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProjectInfoPage from './pages/ProjectInfoPage';
import TeamPage from './pages/TeamPage';

const THEME_STORAGE_KEY = 'uiTheme';

function getInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(resetUsers());
    dispatch(resetLeads());
    dispatch(resetNotifications());
  };

  const onToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  if (!session) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage theme={theme} onToggleTheme={onToggleTheme} />} />
          <Route path="/about" element={<ProjectInfoPage theme={theme} onToggleTheme={onToggleTheme} />} />
          <Route path="/auth" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<AppShell onLogout={onLogout} currentUser={session.user} theme={theme} onToggleTheme={onToggleTheme} />}
        >
          <Route index element={<DashboardPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="/auth" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
