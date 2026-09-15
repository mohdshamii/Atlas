import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import type { KpiDatum } from '@/types';
import { formatChangePct, formatMetricValue } from '@/utils/format';
import StatusBadge from './StatusBadge';

export default function KpiCard({ kpi, accent }: { kpi: KpiDatum; accent: string }) {
  const { metric, currentValue, changePct, trend } = kpi;

  const isGood =
    trend === 'up' ? metric.polarity === 'positive' : trend === 'down' ? metric.polarity === 'negative' : null;

  const trendColor =
    trend === 'unknown' || trend === 'flat' || isGood === null
      ? 'text-base-400'
      : isGood
      ? 'text-signal-emerald'
      : 'text-signal-rose';

  return (
    <div className="rounded-2xl glass-panel p-5 border-gold-500/15 shadow-luxury transition-all hover:border-gold-500/30">
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-base-300 font-sans">{metric.label}</span>
        <span className="h-2 w-2 shrink-0 rounded-full shadow-gold" style={{ backgroundColor: accent }} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tabular-nums text-base-100 font-display">
          {formatMetricValue(currentValue.value, currentValue.value != null ? '' : metric.unit, metric.precision)}
        </span>
        {currentValue.value != null && <span className="text-xs font-mono text-gold-400/80">{metric.unit}</span>}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-base-800/80 pt-2.5">
        <div className={`flex items-center gap-1 text-xs font-medium font-mono ${trendColor}`}>
          {trend === 'up' && <ArrowUp size={13} />}
          {trend === 'down' && <ArrowDown size={13} />}
          {trend === 'flat' && <Minus size={13} />}
          <span>{trend === 'unknown' ? 'No prior baseline' : `${formatChangePct(changePct)} vs Prev`}</span>
        </div>
        <StatusBadge status={currentValue.status} />
      </div>
    </div>
  );
}
