import type { LeadStatus } from '../types';

const styles: Record<LeadStatus, string> = {
  new: 'bg-sky-500/20 text-sky-200 border-sky-500/40',
  contacted: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40',
  qualified: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
  won: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  lost: 'bg-rose-500/20 text-rose-200 border-rose-500/40',
};

interface StatusBadgeProps {
  status: LeadStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const tone = styles[status];
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${tone}`}>
      {status}
    </span>
  );
}
