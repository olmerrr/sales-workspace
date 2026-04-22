interface LogoutButtonProps {
  onClick: () => void;
}

export default function LogoutButton({ onClick }: LogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-slate-600 px-4 py-2 text-sm transition hover:border-indigo-400 hover:bg-indigo-500/20"
    >
      Logout
    </button>
  );
}
