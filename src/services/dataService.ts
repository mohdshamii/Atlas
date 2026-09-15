import type { IndicatorSlug, KpiDatum, MetricValue, SearchResultItem } from '@/types';
import { INDICATORS, findIndicator } from '@/config/indicators';
import { STATES, findState } from '@/config/states';
import { findDistrict, ALL_DISTRICTS, UP_DISTRICTS, getDistrictsForState } from '@/data/districts';
import {
  getIndicatorValuesForDistrict,
  getMetricAcrossDistricts,
  getMetricValue,
  getTrendSeries,
} from '@/data/demoData';
import { isValidYear } from '@/config/years';

/**
 * This module is the single seam between UI components and the underlying
 * data source. Today it reads from the deterministic demo generator in
 * src/data/demoData.ts. To connect a real backend (PostgreSQL + REST/GraphQL
 * API, or a verified static dataset), reimplement the functions in this file
 * — component code that calls `dataService.*` does not need to change.
 */

export function isValidDistrict(districtId: string): boolean {
  return !!findDistrict(districtId);
}

export function isValidIndicator(slug: string): slug is IndicatorSlug {
  return !!findIndicator(slug);
}

export { isValidYear };

/** Builds KPI cards (current value, previous year, change, trend) for an indicator dashboard. */
export function getKpiData(districtId: string, indicatorSlug: IndicatorSlug, year: number): KpiDatum[] {
  const indicator = findIndicator(indicatorSlug);
  if (!indicator) return [];

  return indicator.metrics.map((metric) => {
    const currentValue = getMetricValue(districtId, indicatorSlug, metric.key, year);
    const previousValue =
      year > 2015 ? getMetricValue(districtId, indicatorSlug, metric.key, year - 1) : null;

    let changeAbs: number | null = null;
    let changePct: number | null = null;
    let trend: KpiDatum['trend'] = 'unknown';

    if (currentValue.value != null && previousValue?.value != null) {
      changeAbs = currentValue.value - previousValue.value;
      changePct = previousValue.value !== 0 ? (changeAbs / previousValue.value) * 100 : null;
      if (Math.abs(changeAbs) < 10 ** -metric.precision) trend = 'flat';
      else trend = changeAbs > 0 ? 'up' : 'down';
    }

    return { metric, currentValue, previousValue, changeAbs, changePct, trend };
  });
}

export function getIndicatorTable(districtId: string, indicatorSlug: IndicatorSlug, year: number): MetricValue[] {
  return getIndicatorValuesForDistrict(districtId, indicatorSlug, year);
}

export function getMetricTrend(districtId: string, indicatorSlug: IndicatorSlug, metricKey: string) {
  return getTrendSeries(districtId, indicatorSlug, metricKey);
}

export function getDistrictRanking(indicatorSlug: IndicatorSlug, metricKey: string, year: number, stateId: string = 'uttar-pradesh') {
  const rows = getMetricAcrossDistricts(indicatorSlug, metricKey, year, stateId);
  const withValues = rows.filter((r) => r.value != null) as { districtId: string; districtName: string; value: number; status: MetricValue['status'] }[];
  const metric = findIndicator(indicatorSlug)?.metrics.find((m) => m.key === metricKey);
  const sorted = [...withValues].sort((a, b) =>
    metric?.polarity === 'negative' ? a.value - b.value : b.value - a.value
  );
  return { ranked: sorted, missing: rows.filter((r) => r.value == null) };
}

/** Compare two districts across every metric of one indicator, for one year. */
export function compareDistricts(
  districtIdA: string,
  districtIdB: string,
  indicatorSlug: IndicatorSlug,
  year: number
) {
  const indicator = findIndicator(indicatorSlug);
  if (!indicator) return [];
  return indicator.metrics.map((metric) => {
    const a = getMetricValue(districtIdA, indicatorSlug, metric.key, year);
    const b = getMetricValue(districtIdB, indicatorSlug, metric.key, year);
    let diff: number | null = null;
    let diffPct: number | null = null;
    if (a.value != null && b.value != null) {
      diff = a.value - b.value;
      diffPct = b.value !== 0 ? (diff / b.value) * 100 : null;
    }
    return { metric, a, b, diff, diffPct };
  });
}

/** Global search across states, districts, indicators, and metrics. */
export function search(query: string): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResultItem[] = [];

  for (const state of STATES) {
    if (state.name.toLowerCase().includes(q)) {
      results.push({ type: 'state', label: state.name, sublabel: state.status === 'available' ? 'State' : 'Coming soon', path: `/india/${state.id}` });
    }
  }

  for (const d of ALL_DISTRICTS) {
    if (d.name.toLowerCase().includes(q)) {
      const stateName = d.stateId.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      results.push({ type: 'district', label: d.name, sublabel: `${stateName} · District`, path: `/india/${d.stateId}/${d.id}` });
    }
  }

  for (const indicator of INDICATORS) {
    if (indicator.name.toLowerCase().includes(q)) {
      results.push({ type: 'indicator', label: indicator.name, sublabel: 'Indicator', path: `/india/uttar-pradesh/lucknow/2024/${indicator.slug}` });
    }
    for (const metric of indicator.metrics) {
      if (metric.label.toLowerCase().includes(q)) {
        results.push({
          type: 'metric',
          label: metric.label,
          sublabel: `${indicator.name} · Metric`,
          path: `/india/uttar-pradesh/lucknow/2024/${indicator.slug}`,
        });
      }
    }
  }

  return results.slice(0, 25);
}

export { findState, findDistrict, getDistrictsForState, ALL_DISTRICTS, findIndicator };
