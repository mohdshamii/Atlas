import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import YearSelector from '@/components/common/YearSelector';
import EmptyState from '@/components/common/EmptyState';
import StatusBadge from '@/components/common/StatusBadge';
import { findDistrict } from '@/data/districts';
import { getAllIndicatorHeadlinesForDistrict } from '@/data/demoData';
import { DEFAULT_YEAR } from '@/config/years';
import { formatMetricValue } from '@/utils/format';
import { Box, Brain, Scale, Sparkles, ArrowRight } from 'lucide-react';
import District3DElevationMap from '@/components/three/District3DElevationMap';

export default function DistrictPage() {
  const { stateId = '', districtId = '' } = useParams();
  const navigate = useNavigate();
  const district = findDistrict(districtId);
  const [year, setYear] = useState<number>(DEFAULT_YEAR);
  const [show3D, setShow3D] = useState(false);

  if (!district) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          title="District not found"
          description="Check the URL, or search for a district by name."
          actionLabel="Back to Home"
          actionTo="/"
        />
      </div>
    );
  }

  const stateName = district.stateId
    ? district.stateId.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'India';

  const headlines = getAllIndicatorHeadlinesForDistrict(districtId, year);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6 animate-fadeIn">
      <Breadcrumbs
        items={[
          { label: 'India', to: '/' },
          { label: stateName, to: `/india/${district.stateId}` },
          { label: district.name },
        ]}
      />

      {/* Luxury District Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-gold-500/20 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-[10px] font-mono text-gold-300">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-emerald animate-ping" />
            District Profile · {stateName}
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold text-base-100 gold-gradient-text">
            {district.name}
          </h1>
          <p className="mt-0.5 text-xs text-base-400">
            {stateName}{district.division ? ` · ${district.division} Division` : ''} · Coordinate Node: [{district.centroid ? `${district.centroid[0]}°N, ${district.centroid[1]}°E` : ''}]
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <YearSelector year={year} onChange={setYear} compact />

          <button
            onClick={() => setShow3D(!show3D)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
              show3D
                ? 'border-gold-500 bg-gold-500 text-base-950 shadow-gold'
                : 'border-gold-500/30 bg-base-950 text-gold-300 hover:border-gold-500'
            }`}
          >
            <Box size={14} />
            {show3D ? 'Hide 3D Matrix' : '3D Elevation Matrix'}
          </button>

          <button
            onClick={() => navigate(`/intelligence`)}
            className="flex items-center gap-1.5 rounded-xl border border-gold-500/30 bg-gradient-to-r from-gold-500/20 to-gold-950/40 px-3.5 py-2 text-xs font-semibold text-gold-300 hover:border-gold-500 shadow-panel"
          >
            <Brain size={14} />
            AI Policy Copilot
          </button>

          <button
            onClick={() => navigate(`/compare?a=${districtId}&year=${year}`)}
            className="flex items-center gap-1.5 rounded-xl border border-base-700 bg-base-950 px-3 py-2 text-xs font-semibold text-base-200 hover:border-base-500"
          >
            <Scale size={14} />
            Compare
          </button>
        </div>
      </div>

      {/* Optional 3D View */}
      {show3D && (
        <div className="animate-fadeIn">
          <District3DElevationMap stateId={district.stateId} height={460} />
        </div>
      )}

      {/* Indicator Headline KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {headlines.map(({ indicator, headline }) => {
          const Icon = (Icons[indicator.icon as keyof typeof Icons] as LucideIcon) || Icons.CircleDot;
          return (
            <Link
              key={indicator.slug}
              to={`/india/${district.stateId}/${districtId}/${year}/${indicator.slug}`}
              className="group rounded-2xl glass-panel p-5 glass-panel-hover border-gold-500/15 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl shadow-panel"
                    style={{ backgroundColor: `${indicator.accent}1F`, color: indicator.accent, border: `1px solid ${indicator.accent}33` }}
                  >
                    <Icon size={18} />
                  </span>
                  {headline && <StatusBadge status={headline.status} />}
                </div>
                <p className="mt-4 text-sm font-semibold text-base-100 group-hover:text-gold-300 transition-colors">
                  {indicator.name}
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-base-100 font-display">
                  {headline ? formatMetricValue(headline.value, headline.unit) : '—'}
                </p>
              </div>

              <div className="mt-4 border-t border-base-800/80 pt-3 flex items-center justify-between">
                <span className="text-xs text-base-400 truncate max-w-[180px]">{indicator.metrics[0]?.label}</span>
                <span className="text-xs font-semibold text-gold-400 group-hover:translate-x-0.5 transition-transform">
                  Inspect →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
