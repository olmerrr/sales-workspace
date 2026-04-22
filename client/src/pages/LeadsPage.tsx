import { type FormEvent, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import AlertBanner from '../components/AlertBanner';
import StatusBadge from '../components/StatusBadge';
import { addLead, clearLeadsError, fetchLeads } from '../features/leads/leadsSlice';
import type { CreateLeadPayload, LeadStatus } from '../types';

const initialForm: CreateLeadPayload = {
  name: '',
  company: '',
  status: 'new',
  value: 0,
  source: '',
};

const statuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'won', 'lost'];

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

export default function LeadsPage() {
  const dispatch = useAppDispatch();
  const leads = useAppSelector((state) => state.leads.items);
  const status = useAppSelector((state) => state.leads.status);
  const error = useAppSelector((state) => state.leads.error);
  const [form, setForm] = useState<CreateLeadPayload>(initialForm);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLeads());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (!error && !success) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setSuccess('');
      dispatch(clearLeadsError());
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, success, dispatch]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess('');
    const result = await dispatch(addLead({ ...form, value: Number(form.value) }));
    if (result.meta.requestStatus === 'fulfilled') {
      setForm(initialForm);
      setSuccess('Lead created.');
    }
  };

  const totalValue = leads.reduce((sum, lead) => sum + Number(lead.value || 0), 0);
  const wonCount = leads.filter((lead) => lead.status === 'won').length;
  const newCount = leads.filter((lead) => lead.status === 'new').length;
  const statusCounts = statuses.map((item) => ({
    status: item,
    count: leads.filter((lead) => lead.status === item).length,
  }));

  return (
    <section className="grid gap-4 lg:grid-cols-5">
      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 lg:col-span-2">
        <h2 className="mb-4 text-lg font-semibold">Add lead</h2>
        <AlertBanner type="error" message={error} />
        <AlertBanner type="success" message={success} />
        <form onSubmit={onSubmit} className="grid gap-3">
          <input
            type="text"
            placeholder="Contact name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-indigo-400 focus:ring"
            required
          />
          <input
            type="text"
            placeholder="Company"
            value={form.company}
            onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-indigo-400 focus:ring"
            required
          />
          <input
            type="number"
            min="0"
            placeholder="Deal value"
            value={form.value}
            onChange={(event) => setForm((prev) => ({ ...prev, value: Number(event.target.value) }))}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-indigo-400 focus:ring"
            required
          />
          <input
            type="text"
            placeholder="Source"
            value={form.source}
            onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value }))}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-indigo-400 focus:ring"
            required
          />
          <select
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as LeadStatus }))}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-indigo-400 focus:ring"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Saving...' : 'Create lead'}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 lg:col-span-3">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Pipeline ({leads.length})</h2>
          <button
            type="button"
            onClick={() => dispatch(fetchLeads())}
            className="rounded-xl border border-slate-600 px-3 py-2 text-sm transition hover:border-indigo-400 hover:bg-indigo-500/20"
          >
            Refresh
          </button>
        </div>
        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2">
            <p className="text-xs text-slate-400">Total value</p>
            <p className="text-sm font-semibold">{formatCurrency(totalValue)}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2">
            <p className="text-xs text-slate-400">Closed won</p>
            <p className="text-sm font-semibold">{wonCount}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2">
            <p className="text-xs text-slate-400">New leads</p>
            <p className="text-sm font-semibold">{newCount}</p>
          </div>
        </div>
        <ul className="mb-4 flex flex-wrap gap-2">
          {statusCounts.map((item) => (
            <li key={item.status} className="rounded-full border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300">
              <span className="capitalize">{item.status}</span>: {item.count}
            </li>
          ))}
        </ul>
        <ul className="grid gap-2">
          {leads.map((lead) => (
            <li key={lead.id} className="flex flex-col gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{lead.name}</p>
                  <span className="text-xs text-slate-400">#{lead.id}</span>
                </div>
                <p className="text-sm text-slate-300">{lead.company}</p>
                <p className="text-xs text-slate-400">
                  {formatCurrency(Number(lead.value || 0))} · {lead.source} · {formatDate(lead.createdAt)}
                </p>
              </div>
              <StatusBadge status={lead.status} />
            </li>
          ))}
          {leads.length === 0 && <li className="text-sm text-slate-300">No leads yet.</li>}
        </ul>
      </section>
    </section>
  );
}
