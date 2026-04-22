import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  to: string;
  end?: boolean;
  children: ReactNode;
}

function navClass({ isActive }: { isActive: boolean }) {
  const base = 'rounded-lg px-3 py-2 text-sm transition';
  return isActive
    ? `${base} bg-indigo-600 text-white`
    : `${base} text-slate-300 hover:bg-slate-800 hover:text-white`;
}

export default function NavItem({ to, end = false, children }: NavItemProps) {
  return (
    <NavLink to={to} end={end} className={navClass}>
      {children}
    </NavLink>
  );
}
