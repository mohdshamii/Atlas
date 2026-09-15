import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import YearSelector from '@/components/common/YearSelector';
import EmptyState from '@/components/common/EmptyState';
import KpiCard from '@/components/common/KpiCard';
import TrendChart from '@/charts/TrendChart';
import ComparisonBarChart from '@/charts/ComparisonBarChart';
import DataTable from '@/charts/DataTable';
import UPDistrictMap from '@/maps/UPDistrictMap';
import MapLegend from '@/maps/MapLegend';
import { findDistrict, UP_DISTRICTS } from '@/data/districts';
import { findIndicator } from '@/config/indicators';
import { isValidYear } from '@/config/years';
import { getIndicatorTable, getKpiData, getMetricTrend } from '@/services/dataService';
import { getMetricAcrossDistricts } from '@/data/demoData';
import { getReferenceSource } from '@/data/sources';
import { Scale, ExternalLink } from 'lucide-react';

export default function IndicatorPage() {
  const { stateId = '', districtId = '', year: yearParam = '', indicator: indicatorSlug = '' } = useParams();
  const navigate = useNavigate();
  const year = Number(yearParam);

  const district = findDistrict(districtId);
  const indicator = findIndicator(indicatorSlug);
  const [activeMetricKey, setActiveMetricKey] = useState(indicator?.metrics[0]?.key);

  const invalid = !district || !indicator || !isValidYear(year);

  const kpis = useMemo(
    () => (!invalid ? getKpiData(districtId, indicator!.slug, year) : []),
    [invalid, districtId, indicator, year]
  );
  const tableRows = useMemo(
    () => (!invalid ? getIndicatorTable(districtId, indicator!.slug, year) : []),
    [invalid, districtId, indicator, year]
  );
  const metricKey = activeMetricKey ?? indicator?.metrics[0]?.key ?? '';
  const trend = useMemo(
    () => (!invalid ? getMetricTrend(districtId, indicator!.slug, metricKey) : []),
    [invalid, districtId, indicator, metricKey]
  );
  const acrossDistricts = useMemo(
    () => (!invalid ? getMetricAcrossDistricts(indicator!.slug, metricKey, year) : []),
    [invalid, indicator, metricKey, year]
  );

  const valueByDistrict = useMemo(() => {
    const map: Record<string, number | null> = {};
    acrossDistricts.forEach((v) => (map[v.districtId] = v.value));
    return map;
  }, [acrossDistricts]);

  const numeric = acrossDistricts.map((v) => v.value).filter((v): v is number => v != null);
  const min = numeric.length ? Math.min(...numeric) : 0;
  const max = numeric.length ? Math.max(...numeric) : 1;

  const neighborComparison = useMemo(() => {
    if (invalid) return [];
    const pool = UP_DISTRICTS.filter((d) => d.division === district!.division).slice(0, 8);
    const list = pool.length >= 4 ? pool : UP_DISTRICTS.slice(0, 8);
    return list.map((d) => {
      const v = acrossDistricts.find((a) => a.districtId === d.id);
      return { name: d.name, value: v?.value ?? null };
    });
  }, [invalid, district, acrossDistricts]);

  if (invalid) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          title="This dashboard view isn't available"
          description="The district, year, or indicator in this URL doesn't exist. Double-check the link or start again from Uttar Pradesh."
          actionLabel="Back to Uttar Pradesh"
          actionTo="/india/uttar-pradesh"
        />
      </div>
    );
  }

  const Icon = (Icons[indicator.icon as keyof typeof Icons] as LucideIcon) || Icons.CircleDot;
  const referenceSource = getReferenceSource(indicator.slug);
  const highlightIndex = neighborComparison.findIndex((d) => d.name === district.name);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: 'India', to: '/' },
          { label: 'Uttar Pradesh', to: `/india/${stateId}` },
          { label: district.name, to: `/india/${stateId}/${districtId}` },
          { label: String(year) },
          { label: indicator.name },
        ]}
      />

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm"
            style={{ backgroundColor: `${indicator.accent}1A`, color: indicator.accent }}
          >
            <Icon size={20} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold text-base-100">{indicator.name}</h1>
            <p className="mt-1 max-w-xl text-sm text-base-400">{indicator.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <YearSelector
            year={year}
            onChange={(y) => navigate(`/india/${stateId}/${districtId}/${y}/${indicatorSlug}`)}
            compact
          />
          <button
            onClick={() => navigate(`/compare?a=${districtId}&indicator=${indicatorSlug}&year=${year}`)}
            className="flex items-center gap-1.5 rounded-md border border-base-700 px-3 py-2 text-xs font-medium text-base-200 hover:border-base-500"
          >
            <Scale size={13} />
            Compare
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <button key={kpi.metric.key} onClick={() => setActiveMetricKey(kpi.metric.key)} className="text-left">
            <div className={metricKey === kpi.metric.key ? 'ring-1 ring-signal-amber/60 rounded-md' : ''}>
              <KpiCard kpi={kpi} accent={indicator.accent} />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Trend */}
        <div className="rounded-md border border-base-700 bg-base-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-base-100">
              {indicator.metrics.find((m) => m.key === metricKey)?.label} — trend, 2015–2024
            </h2>
          </div>
          <TrendChart data={trend} color={indicator.accent} unit={indicator.metrics.find((m) => m.key === metricKey)?.unit} />
        </div>

        {/* Division comparison */}
        <div className="rounded-md border border-base-700 bg-base-900 p-4">
          <h2 className="mb-3 text-sm font-medium text-base-100">
            District comparison — {district.division ?? 'Uttar Pradesh'} division
          </h2>
          <ComparisonBarChart
            data={neighborComparison}
            unit={indicator.metrics.find((m) => m.key === metricKey)?.unit}
            highlightIndex={highlightIndex}
            highlightColor={indicator.accent}
          />
        </div>
      </div>

      {/* Map */}
      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-base-100">All districts — {year}</h2>
          <MapLegend min={min} max={max} unit={indicator.metrics.find((m) => m.key === metricKey)?.unit ?? ''} accentHigh={indicator.accent} />
        </div>
        <UPDistrictMap
          valueByDistrict={valueByDistrict}
          min={min}
          max={max}
          accentHigh={indicator.accent}
          selectedDistrictId={districtId}
          onSelectDistrict={(id) => navigate(`/india/${stateId}/${id}/${year}/${indicatorSlug}`)}
        />
      </div>

      {/* Data table */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-medium text-base-100">All metrics — {district.name}, {year}</h2>
        <DataTable rows={tableRows} />
      </div>

      {/* Sources */}
      {referenceSource && (
        <div className="mt-6 rounded-md border border-base-700 bg-base-900 p-4 text-xs text-base-400">
          <p className="font-medium text-base-200">Where this indicator would typically come from</p>
          <p className="mt-1">
            {referenceSource.sourceName}
            {referenceSource.sourceUrl && (
              <a
                href={referenceSource.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-1.5 inline-flex items-center gap-1 text-signal-amber hover:underline"
              >
                Visit <ExternalLink size={11} />
              </a>
            )}
          </p>
          <p className="mt-1 text-base-500">{referenceSource.notes}</p>
          <p className="mt-2 text-base-500">
            Values above are demo/sample data for this build —{' '}
            <Link to="/data-sources" className="underline hover:text-base-300">
              see Data Sources
            </Link>{' '}
            for the full provenance policy.
          </p>
        </div>
      )}
    </div>
  );
}
