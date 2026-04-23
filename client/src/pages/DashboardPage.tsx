import { useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import StatCard from '../components/StatCard';
import { fetchLeads } from '../features/leads/leadsSlice';
import { fetchUsers } from '../features/users/usersSlice';
import type { LeadStatus } from '../types';

const leadStatuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'won', 'lost'];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string): string {
  if (!value) {
    return 'No date';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'No date';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.items);
  const usersStatus = useAppSelector((state) => state.users.status);
  const leads = useAppSelector((state) => state.leads.items);
  const leadsStatus = useAppSelector((state) => state.leads.status);

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
    if (leadsStatus === 'idle') {
      dispatch(fetchLeads());
    }
  }, [dispatch, usersStatus, leadsStatus]);

  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const totalLeads = leads.length;
    const wonCount = leads.filter((lead) => lead.status === 'won').length;
    const pipelineValue = leads.reduce((sum, lead) => sum + Number(lead.value || 0), 0);
    const wonValue = leads
      .filter((lead) => lead.status === 'won')
      .reduce((sum, lead) => sum + Number(lead.value || 0), 0);
    const averageDealValue = totalLeads ? Math.round(pipelineValue / totalLeads) : 0;
    const winRate = totalLeads ? Math.round((wonCount / totalLeads) * 100) : 0;
    return {
      totalUsers,
      totalLeads,
      wonCount,
      pipelineValue,
      wonValue,
      averageDealValue,
      winRate,
    };
  }, [users, leads]);

  const statusStats = useMemo(
    () =>
      leadStatuses.map((status) => {
        const items = leads.filter((lead) => lead.status === status);
        const count = items.length;
        const value = items.reduce((sum, lead) => sum + Number(lead.value || 0), 0);
        const ratio = leads.length ? Math.round((count / leads.length) * 100) : 0;
        return { status, count, value, ratio };
      }),
    [leads],
  );

  const sourceStats = useMemo(() => {
    const grouped = leads.reduce<Record<string, { count: number; value: number }>>((acc, lead) => {
      const source = lead.source || 'unknown';
      if (!acc[source]) {
        acc[source] = { count: 0, value: 0 };
      }
      acc[source].count += 1;
      acc[source].value += Number(lead.value || 0);
      return acc;
    }, {});
    return Object.entries(grouped)
      .map(([source, payload]) => ({ source, ...payload }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [leads]);

  return (
    <section className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Team members" value={metrics.totalUsers} caption="Users in workspace" />
        <StatCard label="Active leads" value={metrics.totalLeads} caption="Current funnel size" />
        <StatCard label="Closed won" value={metrics.wonCount} caption="Successful deals" />
        <StatCard label="Pipeline value" value={formatCurrency(metrics.pipelineValue)} caption="Potential revenue" />
        <StatCard label="Won revenue" value={formatCurrency(metrics.wonValue)} caption="Revenue from won leads" />
        <StatCard label="Win rate" value={`${metrics.winRate}%`} caption={`Avg deal ${formatCurrency(metrics.averageDealValue)}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
          <h3 className="text-lg font-semibold">Pipeline by status</h3>
          <ul className="mt-3 grid gap-2">
            {statusStats.map((entry) => (
              <li key={entry.status} className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium capitalize">{entry.status}</p>
                  <p className="text-xs text-slate-300">
                    {entry.count} leads · {formatCurrency(entry.value)}
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${entry.ratio}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
          <h3 className="text-lg font-semibold">Top lead sources</h3>
          <ul className="mt-3 grid gap-2">
            {sourceStats.map((entry) => (
              <li key={entry.source} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2">
                <div>
                  <p className="font-medium capitalize">{entry.source}</p>
                  <p className="text-xs text-slate-300">{entry.count} leads</p>
                </div>
                <p className="text-sm font-medium text-indigo-200">{formatCurrency(entry.value)}</p>
              </li>
            ))}
            {sourceStats.length === 0 && <li className="text-sm text-slate-300">No source data yet.</li>}
          </ul>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
          <h3 className="text-lg font-semibold">Recent users</h3>
          <ul className="mt-3 grid gap-2">
            {users.slice(0, 5).map((user) => (
              <li key={user.id} className="rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-slate-400">#{user.id}</p>
                </div>
                <p className="text-sm text-slate-300">{user.bio || 'No bio yet'}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {(user.role || 'user').toUpperCase()} · {user.email || 'No email'}
                </p>
              </li>
            ))}
            {users.length === 0 && <li className="text-sm text-slate-300">No users yet.</li>}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
          <h3 className="text-lg font-semibold">Recent leads</h3>
          <ul className="mt-3 grid gap-2">
            {leads.slice(0, 5).map((lead) => (
              <li key={lead.id} className="rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-xs text-slate-400">{formatDate(lead.createdAt)}</p>
                </div>
                <p className="text-sm text-slate-300">{lead.company}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {lead.status} · {lead.source} · {formatCurrency(Number(lead.value || 0))}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Owner: {lead.owner?.name || `#${lead.ownerId ?? 'unknown'}`}
                </p>
              </li>
            ))}
            {leads.length === 0 && <li className="text-sm text-slate-300">No leads yet.</li>}
          </ul>
        </section>
      </div>
    </section>
  );
}
