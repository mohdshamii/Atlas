import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import YearSelector from '@/components/common/YearSelector';
import EmptyState from '@/components/common/EmptyState';
import UPDistrictMap from '@/maps/UPDistrictMap';
import District3DElevationMap from '@/components/three/District3DElevationMap';
import MapLegend from '@/maps/MapLegend';
import { findState } from '@/services/dataService';
import { getMetricAcrossDistricts } from '@/data/demoData';
import { INDICATORS } from '@/config/indicators';
import { DEFAULT_YEAR } from '@/config/years';
import { MapPin, ArrowRight, Box, Layers, Brain, Sparkles } from 'lucide-react';

export default function StatePage() {
  const { stateId = '' } = useParams();
  const navigate = useNavigate();
  const state = findState(stateId);
  const [year, setYear] = useState<number>(DEFAULT_YEAR);
  const [indicatorSlug, setIndicatorSlug] = useState(INDICATORS[0].slug);
  const [search, setSearch] = useState('');
  const [mapMode, setMapMode] = useState<'3d' | '2d'>('3d');

  const indicator = INDICATORS.find((i) => i.slug === indicatorSlug)!;
  const metric = indicator.metrics[0];

  const values = useMemo(
    () => getMetricAcrossDistricts(indicatorSlug, metric.key, year, stateId),
    [indicatorSlug, metric.key, year, stateId]
  );
  const valueByDistrict = useMemo(() => {
    const map: Record<string, number | null> = {};
    values.forEach((v) => (map[v.districtId] = v.value));
    return map;
  }, [values]);
  const numeric = values.map((v) => v.value).filter((v): v is number => v != null);
  const min = numeric.length ? Math.min(...numeric) : 0;
  const max = numeric.length ? Math.max(...numeric) : 1;

  if (!state) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          title="State not found"
          description="This state isn't part of the atlas yet, or the URL is incorrect."
          actionLabel="Back to home"
          actionTo="/"
        />
      </div>
    );
  }

  if (state.status === 'coming-soon') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={MapPin}
          title={`${state.name} is coming soon`}
          description="This state will be added to the live atlas soon."
          actionLabel="Explore Uttar Pradesh"
          actionTo="/india/uttar-pradesh"
        />
      </div>
    );
  }

  const filteredDistricts = state.districts.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6 animate-fadeIn">
      <Breadcrumbs items={[{ label: 'India', to: '/' }, { label: state.name }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-gold-500/20 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-[10px] font-mono text-gold-300">
            <Sparkles size={11} />
            State Observatory · {state.districts.length} Districts
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold text-base-100 gold-gradient-text">
            {state.name}
          </h1>
          <p className="mt-0.5 text-xs text-base-400">
            Capital: <span className="text-base-200 font-semibold">{state.capital}</span> · Sub-district Telemetry & Metrics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <YearSelector year={year} onChange={setYear} compact />

          <div className="flex rounded-xl border border-gold-500/30 bg-base-950 p-0.5 shadow-panel">
            <button
              onClick={() => setMapMode('3d')}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                mapMode === '3d'
                  ? 'bg-gold-500 text-base-950 shadow-gold'
                  : 'text-base-400 hover:text-base-200'
              }`}
            >
              <Box size={13} />
              3D Matrix
            </button>
            <button
              onClick={() => setMapMode('2d')}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                mapMode === '2d'
                  ? 'bg-gold-500 text-base-950 shadow-gold'
                  : 'text-base-400 hover:text-base-200'
              }`}
            >
              <Layers size={13} />
              2D Map
            </button>
          </div>
        </div>
      </div>

      {/* Indicator Pills */}
      <div className="flex flex-wrap gap-2">
        {INDICATORS.map((i) => (
          <button
            key={i.slug}
            onClick={() => setIndicatorSlug(i.slug)}
            className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all ${
              i.slug === indicatorSlug
                ? 'border-gold-500 bg-gold-500/20 text-gold-700 shadow-gold'
                : 'border-base-700 bg-base-900/60 text-base-400 hover:text-base-100'
            }`}
          >
            {i.name}
          </button>
        ))}
      </div>

      {/* Map & District List Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <div>
          {mapMode === '3d' ? (
            <District3DElevationMap stateId={state.id} initialIndicator={indicatorSlug} height={480} year={year} />
          ) : (
            <div className="rounded-2xl glass-panel p-3 border-gold-500/20">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-mono text-gold-400">
                  {metric.label} ({metric.unit})
                </p>
                <MapLegend min={min} max={max} unit={metric.unit} accentHigh={indicator.accent} />
              </div>
              <UPDistrictMap
                valueByDistrict={valueByDistrict}
                min={min}
                max={max}
                accentHigh={indicator.accent}
                onSelectDistrict={(id) => navigate(`/india/${state.id}/${id}`)}
              />
            </div>
          )}
        </div>

        {/* District Search & Directory Drawer */}
        <div className="rounded-2xl glass-panel p-4 border-gold-500/20 shadow-luxury flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-gold-400 uppercase font-semibold">Districts Directory</span>
              <span className="text-xs font-mono text-base-400">{filteredDistricts.length}</span>
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search district in state..."
              className="mb-3 w-full rounded-xl border border-base-700 bg-base-950 px-3.5 py-2 text-xs text-base-100 placeholder:text-base-500 focus:border-gold-500 focus:outline-none"
            />

            <div className="max-h-[380px] overflow-y-auto space-y-1 pr-1">
              {filteredDistricts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => navigate(`/india/${state.id}/${d.id}`)}
                  className="flex w-full items-center justify-between rounded-lg p-2.5 text-left text-xs hover:bg-base-900/80 transition-colors group"
                >
                  <span className="text-base-200 group-hover:text-gold-300 font-medium">{d.name}</span>
                  <ArrowRight size={13} className="text-base-500 group-hover:text-gold-400 transition-colors" />
                </button>
              ))}
              {filteredDistricts.length === 0 && (
                <p className="px-3 py-4 text-xs text-base-400 text-center">No districts match "{search}".</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-base-800">
            <button
              onClick={() => navigate('/intelligence')}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-gold-500/30 bg-gold-500/10 py-2.5 text-xs font-semibold text-gold-300 hover:border-gold-500 transition-all"
            >
              <Brain size={13} />
              Open State AI Policy Copilot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
