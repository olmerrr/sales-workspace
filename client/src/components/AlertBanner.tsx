interface AlertBannerProps {
  type?: 'error' | 'success';
  message: string;
}

export default function AlertBanner({ type = 'error', message }: AlertBannerProps) {
  if (!message) {
    return null;
  }

  if (type === 'success') {
    return (
      <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100">
        {message}
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-xl border border-rose-500/50 bg-rose-500/15 px-4 py-3 text-sm text-rose-100">
      {message}
    </div>
  );
}
