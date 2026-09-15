import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  to?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={13} className="text-base-600" />}
          {item.to ? (
            <Link to={item.to} className="text-base-400 hover:text-signal-amber">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-base-100">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
