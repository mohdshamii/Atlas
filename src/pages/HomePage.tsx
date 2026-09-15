import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
  Database,
  BarChart3,
  Box,
  Brain,
  Globe,
  Radio,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import IndiaMap from '@/maps/IndiaMap';
import India3DGlobe from '@/components/three/India3DGlobe';
import SearchBar from '@/components/common/SearchBar';
import IndicatorGrid from '@/components/common/IndicatorGrid';
import { ALL_DISTRICTS, UP_DISTRICTS } from '@/data/districts';
import { INDICATORS } from '@/config/indicators';
import { YEAR_RANGE } from '@/config/years';
import { STATES } from '@/config/states';

export default function HomePage() {
  const [mapMode, setMapMode] = useState<'3d' | '2d'>('3d');
  const availableStates = STATES.filter((s) => s.status === 'available');

  return (
    <div className="space-y-16 animate-fadeIn pb-16">
      {/* Luxury Hero */}
      <section className="relative overflow-hidden border-b border-gold-500/20 bg-gradient-to-b from-base-950 via-base-900/60 to-base-950 pt-6 pb-12 sm:pb-16">
        {/* Ambient Gold Glow Halo */}
        <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-gold-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -z-10 h-96 w-96 rounded-full bg-signal-indigo/5 blur-[120px] pointer-events-none" />

        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr,1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-mono text-gold-300 backdrop-blur-md shadow-gold">
              <Sparkles size={12} className="text-gold-400" />
              Pan-India Civic Intelligence & 3D Geospatial Engine
            </div>

            <h1 className="mt-4 font-display text-3xl sm:text-5xl font-extrabold leading-[1.15] text-base-100 tracking-tight">
              Sovereign District Data & <span className="gold-gradient-text">Civic Intelligence</span>
            </h1>

            <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-base-400">
              Transforming complex multi-year socioeconomic statistics into actionable policy intelligence, 3D geospatial visualizations, and predictive intervention modeling.
            </p>

            <div className="mt-6 max-w-md">
              <SearchBar variant="hero" />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/intelligence"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 px-5 py-3 text-sm font-bold text-base-950 shadow-gold hover:scale-[1.02] transition-transform"
              >
                <Brain size={16} />
                Open AI Policy Copilot
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/3d-visualizer"
                className="inline-flex items-center gap-2 rounded-xl border border-gold-500/30 bg-base-950/80 px-4 py-3 text-sm font-semibold text-gold-300 hover:border-gold-500 shadow-panel transition-all"
              >
                <Box size={16} />
                3D Hologram Studio
              </Link>
            </div>

            {/* Metric counters */}
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-gold-500/15 pt-6">
              <div className="rounded-xl glass-panel p-3 border-gold-500/15">
                <dt className="text-[11px] font-mono text-gold-400 uppercase">Districts Mapped</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-base-100 font-display">
                  {ALL_DISTRICTS.length}
                </dd>
              </div>
              <div className="rounded-xl glass-panel p-3 border-gold-500/15">
                <dt className="text-[11px] font-mono text-gold-400 uppercase">Civic Indicators</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-base-100 font-display">
                  {INDICATORS.length}
                </dd>
              </div>
              <div className="rounded-xl glass-panel p-3 border-gold-500/15">
                <dt className="text-[11px] font-mono text-gold-400 uppercase">Yearly Timeline</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-base-100 font-display">
                  {YEAR_RANGE.start}–{YEAR_RANGE.end}
                </dd>
              </div>
            </dl>
          </div>

          {/* Interactive Geospatial Stage with Mode Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gold-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-signal-emerald animate-ping" />
                Live Geospatial Canvas
              </span>

              <div className="flex rounded-lg border border-gold-500/30 bg-base-950 p-0.5 shadow-panel">
                <button
                  onClick={() => setMapMode('3d')}
                  className={`flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                    mapMode === '3d'
                      ? 'bg-gold-500 text-base-950 shadow-gold'
                      : 'text-base-400 hover:text-base-200'
                  }`}
                >
                  <Globe size={13} />
                  3D Hologram
                </button>
                <button
                  onClick={() => setMapMode('2d')}
                  className={`flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                    mapMode === '2d'
                      ? 'bg-gold-500 text-base-950 shadow-gold'
                      : 'text-base-400 hover:text-base-200'
                  }`}
                >
                  <Layers size={13} />
                  2D Cartography
                </button>
              </div>
            </div>

            {mapMode === '3d' ? (
              <India3DGlobe height={430} />
            ) : (
              <IndiaMap height={430} />
            )}
          </div>
        </div>
      </section>

      {/* Real-World Problem Solving: Civic AI & Intelligence Spotlight */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-[11px] font-mono text-gold-300">
              <ShieldCheck size={12} className="text-signal-emerald" />
              REAL-WORLD CIVIC PROBLEM SOLVING
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-base-100">
              Executive Civic Intelligence Engines
            </h2>
            <p className="mt-1 text-sm text-base-400 max-w-xl">
              Decision-support tools built for administrators, policy planners, and research institutions to tackle ground realities.
            </p>
          </div>

          <Link
            to="/intelligence"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-200 transition-colors"
          >
            Launch Full Intelligence Studio →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Card 1: AI Copilot */}
          <Link
            to="/intelligence"
            className="rounded-2xl glass-panel p-6 glass-panel-hover border-gold-500/20 group flex flex-col justify-between"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 shadow-gold group-hover:scale-110 transition-transform">
                <Brain size={20} />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-base-100 group-hover:text-gold-300 transition-colors">
                AI Policy Copilot & Budget Simulator
              </h3>
              <p className="mt-2 text-xs text-base-400 leading-relaxed">
                Diagnoses development bottlenecks and runs "What-If" fiscal simulations to project 5-year KPI improvements in healthcare, literacy, and piped water.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-gold-400">
              Run simulation <ArrowRight size={13} />
            </div>
          </Link>

          {/* Card 2: Vulnerability Index */}
          <Link
            to="/intelligence"
            className="rounded-2xl glass-panel p-6 glass-panel-hover border-gold-500/20 group flex flex-col justify-between"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-emerald/10 border border-signal-emerald/30 text-signal-emerald shadow-glowEmerald group-hover:scale-110 transition-transform">
                <Activity size={20} />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-base-100 group-hover:text-signal-emerald transition-colors">
                Vulnerability & Progress Index (VPI)
              </h3>
              <p className="mt-2 text-xs text-base-400 leading-relaxed">
                Multi-dimensional composite scoring matrix ranking 750+ districts. Identify high-distress priority intervention zones and model front-runners.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-signal-emerald">
              Explore ranking matrix <ArrowRight size={13} />
            </div>
          </Link>

          {/* Card 3: Distress Anomaly Radar */}
          <Link
            to="/intelligence"
            className="rounded-2xl glass-panel p-6 glass-panel-hover border-gold-500/20 group flex flex-col justify-between"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-rose/10 border border-signal-rose/30 text-signal-rose group-hover:scale-110 transition-transform">
                <Radio size={20} />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-base-100 group-hover:text-signal-rose transition-colors">
                Civic Distress Early Warning Radar
              </h3>
              <p className="mt-2 text-xs text-base-400 leading-relaxed">
                Statistical anomaly detector flagging critical negative spikes (crime surges, mortality reversals) and breakthrough achievements across districts.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-signal-rose">
              View live alerts <ArrowRight size={13} />
            </div>
          </Link>
        </div>
      </section>

      {/* State Quick Drilldown Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex items-end justify-between border-b border-gold-500/15 pb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-base-100">
              Explore Active State Atlases
            </h2>
            <p className="mt-1 text-xs text-base-400">
              Drill down into district telemetry across India's largest states.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableStates.map((state) => (
            <Link
              key={state.id}
              to={`/india/${state.id}`}
              className="rounded-xl glass-panel p-5 glass-panel-hover border-gold-500/20 group flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400">State Atlas</span>
                <h3 className="font-display text-lg font-bold text-base-100 group-hover:text-gold-300 transition-colors">
                  {state.name}
                </h3>
                <p className="text-xs text-base-400 mt-0.5">
                  Capital: <span className="text-base-200">{state.capital}</span> · {state.districts.length} Districts
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold-500/30 bg-gold-500/10 text-gold-400 group-hover:bg-gold-500 group-hover:text-base-950 transition-all">
                <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Indicators Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex items-end justify-between border-b border-gold-500/15 pb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-base-100">Browse by Domain Indicator</h2>
            <p className="mt-1 text-xs text-base-400">11 comprehensive domains tracking civic, demographic, economic, and environmental health.</p>
          </div>
        </div>
        <IndicatorGrid basePath={`/india/uttar-pradesh/lucknow/${YEAR_RANGE.end}`} />
      </section>
    </div>
  );
}

