import type { LucideIcon } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}

export default function EmptyState({ icon: Icon = AlertTriangle, title, description, actionLabel, actionTo }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-base-700 bg-base-900/50 px-6 py-14 text-center">
      <Icon size={28} className="mb-3 text-base-500" />
      <h3 className="text-base font-medium text-base-100">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-base-400">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-4 rounded-md border border-base-600 px-3 py-1.5 text-sm text-base-100 hover:border-signal-amber hover:text-signal-amber"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
