import type { DataStatus } from '@/types';

const CONFIG: Record<DataStatus, { label: string; className: string }> = {
  verified: { label: 'Verified', className: 'bg-signal-teal/15 text-signal-teal border-signal-teal/30' },
  demo: { label: 'Demo data', className: 'bg-signal-amber/15 text-signal-amber border-signal-amber/30' },
  unavailable: { label: 'No data', className: 'bg-base-700 text-base-400 border-base-600' },
};

export default function StatusBadge({ status, className = '' }: { status: DataStatus; className?: string }) {
  const cfg = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] font-medium leading-none ${cfg.className} ${className}`}
    >
      {cfg.label}
    </span>
  );
}
