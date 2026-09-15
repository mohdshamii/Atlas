import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { INDICATORS } from '@/config/indicators';

export default function IndicatorGrid({ basePath }: { basePath: string }) {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
      {INDICATORS.map((indicator) => {
        const Icon = (Icons[indicator.icon as keyof typeof Icons] as LucideIcon) || Icons.CircleDot;
        return (
          <Link
            key={indicator.slug}
            to={`${basePath}/${indicator.slug}`}
            className="group flex flex-col justify-between gap-3 rounded-2xl glass-panel p-4.5 glass-panel-hover border-gold-500/15 transition-all shadow-panel"
          >
            <div className="flex items-center justify-between">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl shadow-panel"
                style={{ backgroundColor: `${indicator.accent}1F`, color: indicator.accent, border: `1px solid ${indicator.accent}33` }}
              >
                <Icon size={18} />
              </span>
              <span className="text-[10px] font-mono text-base-500 uppercase">{indicator.metrics.length} metrics</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-base-100 group-hover:text-gold-300 transition-colors font-sans">{indicator.name}</p>
              <p className="mt-1 text-xs leading-snug text-base-400">{indicator.shortDescription}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
