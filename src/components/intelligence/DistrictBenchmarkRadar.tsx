import React, { useState, useMemo } from 'react';
import { ALL_DISTRICTS } from '@/data/districts';
import { INDICATORS } from '@/config/indicators';
import { getMetricValue } from '@/data/demoData';
import { DEFAULT_YEAR } from '@/config/years';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import { ArrowRight, Compass, Scale, Sparkles, TrendingUp } from 'lucide-react';
import { formatMetricValue } from '@/utils/format';

interface DistrictBenchmarkRadarProps {
  initialDistrictA?: string;
  initialDistrictB?: string;
}

export default function DistrictBenchmarkRadar({
  initialDistrictA = 'lucknow',
  initialDistrictB = 'varanasi',
}: DistrictBenchmarkRadarProps) {
  const [districtAId, setDistrictAId] = useState(initialDistrictA);
  const [districtBId, setDistrictBId] = useState(initialDistrictB);
  const [year, setYear] = useState(DEFAULT_YEAR);

  const dA = useMemo(() => ALL_DISTRICTS.find((d) => d.id === districtAId) || ALL_DISTRICTS[0], [districtAId]);
  const dB = useMemo(() => ALL_DISTRICTS.find((d) => d.id === districtBId) || ALL_DISTRICTS[1], [districtBId]);

  // Selected key metrics for radar comparison
  const benchmarkDimensions = [
    { name: 'Literacy Rate', indicator: 'education', key: 'literacy_rate', max: 100, min: 40 },
    { name: 'Health Coverage', indicator: 'healthcare', key: 'institutional_deliveries', max: 100, min: 40 },
    { name: 'Piped Water', indicator: 'water', key: 'piped_water_coverage', max: 100, min: 20 },
    { name: 'Power Availability', indicator: 'electricity', key: 'power_availability', max: 24, min: 10 },
    { name: 'Road Connectivity', indicator: 'roads', key: 'villages_connected', max: 100, min: 40 },
    { name: 'Safety Index', indicator: 'crime', key: 'crime_rate', max: 600, min: 100, invert: true },
    { name: 'Forest Cover', indicator: 'environment', key: 'forest_cover', max: 30, min: 1 },
  ];

  const radarData = useMemo(() => {
    return benchmarkDimensions.map((dim) => {
      const valA = getMetricValue(dA.id, dim.indicator as any, dim.key, year).value ?? dim.min;
      const valB = getMetricValue(dB.id, dim.indicator as any, dim.key, year).value ?? dim.min;

      // Normalize 0-100
      let scoreA = Math.max(0, Math.min(100, ((valA - dim.min) / (dim.max - dim.min)) * 100));
      let scoreB = Math.max(0, Math.min(100, ((valB - dim.min) / (dim.max - dim.min)) * 100));

      if (dim.invert) {
        scoreA = 100 - scoreA;
        scoreB = 100 - scoreB;
      }

      return {
        dimension: dim.name,
        [dA.name]: Math.round(scoreA),
        [dB.name]: Math.round(scoreB),
        rawA: valA,
        rawB: valB,
      };
    });
  }, [dA, dB, year]);

  return (
    <div className="rounded-2xl glass-panel p-6 shadow-luxury">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-base-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-[11px] font-mono text-gold-300">
            <Scale size={12} />
            MULTI-DIMENSIONAL BENCHMARK RADAR
          </div>
          <h3 className="mt-1 font-display text-lg font-bold text-base-100">
            Head-to-Head District Diagnostic Radar
          </h3>
          <p className="mt-0.5 text-xs text-base-400">
            Normalized 7-pillar developmental radar comparing capacity across civic services.
          </p>
        </div>

        {/* Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-gold-400">A:</span>
            <select
              value={districtAId}
              onChange={(e) => setDistrictAId(e.target.value)}
              className="rounded-lg border border-gold-500/40 bg-base-950 px-2.5 py-1.5 text-xs font-semibold text-gold-300 focus:outline-none"
            >
              {ALL_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-signal-teal">B:</span>
            <select
              value={districtBId}
              onChange={(e) => setDistrictBId(e.target.value)}
              className="rounded-lg border border-signal-teal/40 bg-base-950 px-2.5 py-1.5 text-xs font-semibold text-signal-teal focus:outline-none"
            >
              {ALL_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr,1fr] items-center">
        {/* Radar Visual */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#23304B" />
              <PolarAngleAxis dataKey="dimension" stroke="#AEC0DC" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4E6491" />
              <Radar
                name={dA.name}
                dataKey={dA.name}
                stroke="#D4AF37"
                fill="#D4AF37"
                fillOpacity={0.4}
                strokeWidth={2}
              />
              <Radar
                name={dB.name}
                dataKey={dB.name}
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B0F19',
                  borderColor: '#D4AF37',
                  borderRadius: '10px',
                  color: '#F4F7FC',
                  fontSize: '12px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Trajectory & Gap Analysis Breakdown */}
        <div className="rounded-xl border border-base-800 bg-base-950/70 p-4 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-gold-400 font-semibold">
            Gap-Closing Diagnostic Insights
          </span>

          {radarData.slice(0, 4).map((r) => {
            const valA = Number(r[dA.name]) || 0;
            const valB = Number(r[dB.name]) || 0;
            const diff = valA - valB;
            const leader = diff > 0 ? dA.name : dB.name;
            const absoluteGap = Math.abs(diff);

            return (
              <div key={r.dimension} className="rounded-lg border border-base-800/80 bg-base-900/50 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-base-200">{r.dimension}</span>
                  <span
                    className={`font-mono font-bold ${
                      diff >= 0 ? 'text-gold-300' : 'text-signal-emerald'
                    }`}
                  >
                    {leader} leads by {absoluteGap} pts
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-base-400">
                  <span className="text-gold-400 font-mono font-semibold">{dA.name}: {r.rawA}</span>
                  <span>vs</span>
                  <span className="text-signal-emerald font-mono font-semibold">{dB.name}: {r.rawB}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
