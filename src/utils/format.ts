export function formatNumber(value: number | null, precision = 1): string {
  if (value == null || Number.isNaN(value)) return '—';
  if (Math.abs(value) >= 10_000_000) return `${(value / 10_000_000).toFixed(2)} Cr`;
  if (Math.abs(value) >= 100_000) return `${(value / 100_000).toFixed(2)} L`;
  return value.toLocaleString('en-IN', { maximumFractionDigits: precision, minimumFractionDigits: 0 });
}

export function formatMetricValue(value: number | null, unit: string, precision = 1): string {
  if (value == null || Number.isNaN(value)) return 'No data';
  const formatted = value.toLocaleString('en-IN', {
    maximumFractionDigits: precision,
    minimumFractionDigits: precision > 0 ? Math.min(precision, 1) : 0,
  });
  if (unit === '%' || unit === '%/yr') return `${formatted}${unit === '%/yr' ? '%/yr' : '%'}`;
  return `${formatted} ${unit}`;
}

export function formatChangePct(pct: number | null): string {
  if (pct == null || Number.isNaN(pct)) return '—';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
