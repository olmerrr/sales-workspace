import NavItem from './NavItem';

interface NavConfig {
  to: string;
  label: string;
  end?: boolean;
}

const navItems: NavConfig[] = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/team', label: 'Team' },
  { to: '/leads', label: 'Leads' },
];

export default function AppNavigation() {
  return (
    <nav className="mb-5 flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-2">
      {navItems.map((item) => (
        <NavItem key={item.to} to={item.to} end={item.end}>
          {item.label}
        </NavItem>
      ))}
    </nav>
  );
}
