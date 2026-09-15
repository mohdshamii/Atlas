import React, { useState, useMemo } from 'react';
import { ALL_DISTRICTS } from '@/data/districts';
import { INDICATORS } from '@/config/indicators';
import { getMetricValue } from '@/data/demoData';
import { DEFAULT_YEAR } from '@/config/years';
import { formatMetricValue } from '@/utils/format';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Flame,
  Radio,
  Sparkles,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

interface AnomalyItem {
  districtId: string;
  districtName: string;
  stateId: string;
  indicatorSlug: string;
  indicatorName: string;
  metricKey: string;
  metricLabel: string;
  type: 'distress' | 'breakthrough';
  currentVal: number;
  prevVal: number;
  deltaPct: number;
  unit: string;
  severity: 'critical' | 'moderate' | 'high';
  rationale: string;
}

export default function AnomalyDetectionRadar() {
  const [filterType, setFilterType] = useState<'all' | 'distress' | 'breakthrough'>('all');
  const [selectedState, setSelectedState] = useState<string>('all');

  // Compute anomalies deterministically across districts
  const anomalies = useMemo(() => {
    const list: AnomalyItem[] = [];
    const targetDistricts = selectedState === 'all' ? ALL_DISTRICTS.slice(0, 30) : ALL_DISTRICTS.filter((d) => d.stateId === selectedState);

    targetDistricts.forEach((d) => {
      // Check Crime
      const crimeCurr = getMetricValue(d.id, 'crime', 'total_crime_cases', DEFAULT_YEAR);
      const crimePrev = getMetricValue(d.id, 'crime', 'total_crime_cases', DEFAULT_YEAR - 1);
      if (crimeCurr.value && crimePrev.value) {
        const delta = ((crimeCurr.value - crimePrev.value) / crimePrev.value) * 100;
        if (delta > 8.0) {
          list.push({
            districtId: d.id,
            districtName: d.name,
            stateId: d.stateId,
            indicatorSlug: 'crime',
            indicatorName: 'Crime',
            metricKey: 'total_crime_cases',
            metricLabel: 'Total Crime Cases',
            type: 'distress',
            currentVal: crimeCurr.value,
            prevVal: crimePrev.value,
            deltaPct: Math.round(delta * 10) / 10,
            unit: 'cases',
            severity: delta > 12 ? 'critical' : 'moderate',
            rationale: `Sharp YoY spike in cognizable crime cases (+${delta.toFixed(1)}%). Urgent policing audit recommended.`,
          });
        }
      }

      // Check Healthcare IMR
      const imrCurr = getMetricValue(d.id, 'healthcare', 'infant_mortality_rate', DEFAULT_YEAR);
      const imrPrev = getMetricValue(d.id, 'healthcare', 'infant_mortality_rate', DEFAULT_YEAR - 1);
      if (imrCurr.value && imrPrev.value) {
        const delta = ((imrCurr.value - imrPrev.value) / imrPrev.value) * 100;
        if (delta > 6.0) {
          list.push({
            districtId: d.id,
            districtName: d.name,
            stateId: d.stateId,
            indicatorSlug: 'healthcare',
            indicatorName: 'Healthcare',
            metricKey: 'infant_mortality_rate',
            metricLabel: 'Infant Mortality Rate',
            type: 'distress',
            currentVal: imrCurr.value,
            prevVal: imrPrev.value,
            deltaPct: Math.round(delta * 10) / 10,
            unit: 'per 1,000 live births',
            severity: 'critical',
            rationale: `Reversal in child mortality (+${delta.toFixed(1)}%). Requires immediate maternal immunization intervention.`,
          });
        }
      }

      // Check Piped Water (Breakthrough)
      const waterCurr = getMetricValue(d.id, 'water', 'piped_water_coverage', DEFAULT_YEAR);
      const waterPrev = getMetricValue(d.id, 'water', 'piped_water_coverage', DEFAULT_YEAR - 2);
      if (waterCurr.value && waterPrev.value) {
        const delta = ((waterCurr.value - waterPrev.value) / waterPrev.value) * 100;
        if (delta > 18.0) {
          list.push({
            districtId: d.id,
            districtName: d.name,
            stateId: d.stateId,
            indicatorSlug: 'water',
            indicatorName: 'Water',
            metricKey: 'piped_water_coverage',
            metricLabel: 'Piped Water Coverage',
            type: 'breakthrough',
            currentVal: waterCurr.value,
            prevVal: waterPrev.value,
            deltaPct: Math.round(delta * 10) / 10,
            unit: '%',
            severity: 'high',
            rationale: `Rapid acceleration in tap water connections (+${delta.toFixed(1)}% over 2 yrs). Benchmark execution.`,
          });
        }
      }

      // Check Literacy (Breakthrough)
      const litCurr = getMetricValue(d.id, 'education', 'literacy_rate', DEFAULT_YEAR);
      const litPrev = getMetricValue(d.id, 'education', 'literacy_rate', DEFAULT_YEAR - 3);
      if (litCurr.value && litPrev.value) {
        const delta = ((litCurr.value - litPrev.value) / litPrev.value) * 100;
        if (delta > 8.0) {
          list.push({
            districtId: d.id,
            districtName: d.name,
            stateId: d.stateId,
            indicatorSlug: 'education',
            indicatorName: 'Education',
            metricKey: 'literacy_rate',
            metricLabel: 'Literacy Rate',
            type: 'breakthrough',
            currentVal: litCurr.value,
            prevVal: litPrev.value,
            deltaPct: Math.round(delta * 10) / 10,
            unit: '%',
            severity: 'high',
            rationale: `Exceptional literacy acceleration (+${delta.toFixed(1)}%). Effective primary schooling drive.`,
          });
        }
      }
    });

    return list.sort((a, b) => Math.abs(b.deltaPct) - Math.abs(a.deltaPct));
  }, [selectedState]);

  const filtered = useMemo(() => {
    return anomalies.filter((a) => {
      if (filterType !== 'all' && a.type !== filterType) return false;
      return true;
    });
  }, [anomalies, filterType]);

  const distressCount = anomalies.filter((a) => a.type === 'distress').length;
  const breakthroughCount = anomalies.filter((a) => a.type === 'breakthrough').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl glass-panel p-6 shadow-luxury">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-base-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-signal-rose/40 bg-signal-rose/10 px-2.5 py-0.5 text-[11px] font-mono text-signal-rose">
              <Radio size={12} className="animate-pulse" />
              LIVE CIVIC EARLY WARNING RADAR
            </div>
            <h2 className="mt-1 font-display text-xl font-bold text-base-100">
              Civic Distress Alerts & Breakthrough Tracker
            </h2>
            <p className="mt-0.5 text-xs text-base-400">
              Statistical anomaly detection engine identifying sudden negative distress spikes and high-velocity positive breakthroughs across Indian districts.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                filterType === 'all'
                  ? 'border-gold-500 bg-gold-500/15 text-gold-300 shadow-gold'
                  : 'border-base-700 bg-base-950 text-base-400 hover:text-base-200'
              }`}
            >
              All Signals ({anomalies.length})
            </button>
            <button
              onClick={() => setFilterType('distress')}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                filterType === 'distress'
                  ? 'border-signal-rose bg-signal-rose/20 text-signal-rose shadow-sm'
                  : 'border-base-700 bg-base-950 text-base-400 hover:text-base-200'
              }`}
            >
              <AlertTriangle size={13} />
              Distress Alerts ({distressCount})
            </button>
            <button
              onClick={() => setFilterType('breakthrough')}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                filterType === 'breakthrough'
                  ? 'border-signal-emerald bg-signal-emerald/20 text-signal-emerald shadow-glowEmerald'
                  : 'border-base-700 bg-base-950 text-base-400 hover:text-base-200'
              }`}
            >
              <Sparkles size={13} />
              Breakthroughs ({breakthroughCount})
            </button>
          </div>
        </div>

        {/* Anomaly Cards Grid */}
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, idx) => (
            <div
              key={`${item.districtId}-${item.metricKey}-${idx}`}
              className={`rounded-xl border p-4.5 transition-all glass-panel-hover ${
                item.type === 'distress'
                  ? 'border-signal-rose/30 bg-gradient-to-b from-signal-rose/5 to-transparent'
                  : 'border-signal-emerald/30 bg-gradient-to-b from-signal-emerald/5 to-transparent'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      item.type === 'distress' ? 'bg-signal-rose/20 text-signal-rose' : 'bg-signal-emerald/20 text-signal-emerald'
                    }`}
                  >
                    {item.type === 'distress' ? <AlertTriangle size={14} /> : <TrendingUp size={14} />}
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm text-base-100 font-sans">{item.districtName}</h4>
                    <span className="text-[10px] font-mono text-base-400 uppercase tracking-wider">
                      {item.stateId.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                    item.type === 'distress'
                      ? 'bg-signal-rose/20 text-signal-rose border border-signal-rose/30'
                      : 'bg-signal-emerald/20 text-signal-emerald border border-signal-emerald/30'
                  }`}
                >
                  {item.deltaPct > 0 ? `+${item.deltaPct}%` : `${item.deltaPct}%`}
                </span>
              </div>

              <div className="mt-3 border-t border-base-800/80 pt-2.5">
                <p className="text-xs font-medium text-base-200">{item.metricLabel}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-base font-bold text-base-100 tabular-nums">
                    {formatMetricValue(item.currentVal, item.unit)}
                  </span>
                  <span className="text-xs text-base-400 line-through tabular-nums">
                    {formatMetricValue(item.prevVal, item.unit)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-base-400 leading-relaxed font-sans">{item.rationale}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-base-800/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-gold-400 uppercase">
                  {item.type === 'distress' ? 'Immediate Action' : 'Case Study Model'}
                </span>
                <Link
                  to={`/india/${item.stateId}/${item.districtId}/${DEFAULT_YEAR}/${item.indicatorSlug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gold-300 hover:text-gold-100"
                >
                  Inspect metric <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
