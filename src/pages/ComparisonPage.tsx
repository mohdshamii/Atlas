import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeftRight, Download, Scale, Sparkles } from 'lucide-react';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import YearSelector from '@/components/common/YearSelector';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import { ALL_DISTRICTS, findDistrict } from '@/data/districts';
import { INDICATORS, findIndicator } from '@/config/indicators';
import { DEFAULT_YEAR, isValidYear } from '@/config/years';
import { compareDistricts } from '@/services/dataService';
import { formatChangePct, formatMetricValue } from '@/utils/format';
import DistrictBenchmarkRadar from '@/components/intelligence/DistrictBenchmarkRadar';

export default function ComparisonPage() {
  const [params, setParams] = useSearchParams();
  const districtA = params.get('a') || 'lucknow';
  const districtB = params.get('b') || 'kanpur-nagar';
  const indicatorSlug = params.get('indicator') || INDICATORS[0].slug;
  const yearParam = Number(params.get('year'));
  const year = isValidYear(yearParam) ? yearParam : DEFAULT_YEAR;

  const indicator = findIndicator(indicatorSlug) ?? INDICATORS[0];
  const dA = findDistrict(districtA);
  const dB = findDistrict(districtB);

  const update = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => next.set(k, v));
    setParams(next, { replace: true });
  };

  const rows = useMemo(
    () => (dA && dB ? compareDistricts(districtA, districtB, indicator.slug, year) : []),
    [dA, dB, districtA, districtB, indicator, year]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8 animate-fadeIn">
      <Breadcrumbs items={[{ label: 'India', to: '/' }, { label: 'Comparative Benchmarking Studio' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-gold-500/20 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-[11px] font-mono text-gold-300">
            <Scale size={12} />
            MULTILATERAL CIVIC BENCHMARK
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold text-base-100 gold-gradient-text">
            District Comparative Analysis
          </h1>
          <p className="mt-0.5 text-xs text-base-400">
            Compare any two districts in India across 11 key civic sectors and track relative performance over time.
          </p>
        </div>
      </div>

      {/* Control selectors */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl glass-panel p-4 border-gold-500/20 shadow-luxury">
        <Selector label="District A (Baseline)" value={districtA} onChange={(v) => update({ a: v })} />
        <Selector label="District B (Target / Peer)" value={districtB} onChange={(v) => update({ b: v })} />
        <div>
          <label className="mb-1 block text-xs font-mono text-base-400">Domain Indicator</label>
          <select
            value={indicator.slug}
            onChange={(e) => update({ indicator: e.target.value })}
            className="w-full rounded-xl border border-gold-500/30 bg-base-950 px-3 py-2 text-sm text-gold-300 focus:border-gold-500 focus:outline-none"
          >
            {INDICATORS.map((i) => (
              <option key={i.slug} value={i.slug}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-mono text-base-400">Observation Year</label>
          <YearSelector year={year} onChange={(y) => update({ year: String(y) })} compact />
        </div>
      </div>

      {/* 7-Pillar Benchmark Radar Section */}
      {dA && dB && (
        <DistrictBenchmarkRadar initialDistrictA={districtA} initialDistrictB={districtB} />
      )}

      {/* Detailed Indicator Comparison Table */}
      {!dA || !dB ? (
        <div className="mt-8">
          <EmptyState
            icon={ArrowLeftRight}
            title="Choose two valid districts"
            description="Select District A and District B above to see a comparison."
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl glass-panel border-gold-500/20 shadow-luxury">
          <div className="border-b border-base-800 p-4 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-base-100 flex items-center gap-2">
              <span className="text-gold-400">{indicator.name}</span> Detailed Breakdown ({year})
            </h3>
            <span className="text-xs font-mono text-base-400">
              {dA.name} vs {dB.name}
            </span>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-base-800 bg-base-950/90 text-left text-xs font-mono text-base-400">
                <th className="px-5 py-3 font-semibold">Metric</th>
                <th className="px-5 py-3 font-semibold text-gold-400">{dA.name}</th>
                <th className="px-5 py-3 font-semibold text-signal-teal">{dB.name}</th>
                <th className="px-5 py-3 font-semibold">Relative Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-800/60">
              {rows.map((row) => (
                <tr key={row.metric.key} className="hover:bg-base-900/50 transition-colors">
                  <td className="px-5 py-3.5 text-base-200 font-medium">{row.metric.label}</td>
                  <td className="px-5 py-3.5 tabular-nums text-base-100">
                    <div className="flex items-center gap-2 font-mono">
                      {formatMetricValue(row.a.value, row.metric.unit, row.metric.precision)}
                      <StatusBadge status={row.a.status} />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 tabular-nums text-base-100">
                    <div className="flex items-center gap-2 font-mono">
                      {formatMetricValue(row.b.value, row.metric.unit, row.metric.precision)}
                      <StatusBadge status={row.b.status} />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 tabular-nums font-mono text-xs">
                    {row.diff == null ? (
                      '—'
                    ) : (
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 font-bold ${
                          row.diff > 0
                            ? 'bg-signal-emerald/20 text-signal-emerald border border-signal-emerald/30'
                            : 'bg-signal-rose/20 text-signal-rose border border-signal-rose/30'
                        }`}
                      >
                        {row.diff > 0 ? '+' : ''}
                        {row.diff.toFixed(row.metric.precision)} ({formatChangePct(row.diffPct)})
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Selector({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-mono text-base-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-base-700 bg-base-950 px-3 py-2 text-sm font-semibold text-base-100 focus:border-gold-500 focus:outline-none"
      >
        {ALL_DISTRICTS.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name} ({d.stateId.replace('-', ' ')})
          </option>
        ))}
      </select>
    </div>
  );
}
