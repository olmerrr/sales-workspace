interface StatCardProps {
  label: string;
  value: number | string;
  caption: string;
}

export default function StatCard({ label, value, caption }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <h3 className="mt-1 text-2xl font-semibold">{value}</h3>
      <p className="mt-1 text-sm text-slate-300">{caption}</p>
    </article>
  );
}
