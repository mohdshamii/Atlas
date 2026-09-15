import type { IndicatorSlug, MetricValue } from '@/types';
import { INDICATORS, findIndicator } from '@/config/indicators';
import { UP_DISTRICTS, ALL_DISTRICTS, findDistrict, getDistrictsForState } from '@/data/districts';
import { seededRandom, seededRange } from '@/utils/prng';
import { DEMO_SOURCE, UNAVAILABLE_SOURCE } from '@/data/sources';
import { YEAR_RANGE } from '@/config/years';

/**
 * ============================================================================
 * DEMO DATA GENERATOR — READ THIS BEFORE TOUCHING
 * ============================================================================
 * No verified government statistics are hardcoded here. Every value is
 * derived deterministically from (district, indicator, metric, year) using a
 * seeded PRNG, so it is stable across reloads but is NOT a real observation.
 * Every returned MetricValue carries status: 'demo' (or 'unavailable' for a
 * deliberately-simulated small fraction of cells, to exercise empty states).
 *
 * TO INTEGRATE REAL DATA: replace the body of `getMetricValue` with a lookup
 * against your verified dataset (CSV/JSON/API), keeping the same return
 * shape. Nothing else in the app needs to change — see README.md → data
 * architecture.
 * ============================================================================
 */

// Plausible value ranges per metric, used only to keep demo numbers in a
// realistic order of magnitude. Not derived from any real dataset.
const METRIC_RANGES: Record<string, [number, number]> = {
  population: [800000, 5200000],
  population_growth: [0.4, 2.6],
  population_density: [400, 1900],
  sex_ratio: [858, 985],
  urban_population: [10, 55],
  rural_population: [45, 90],

  literacy_rate: [54, 86],
  school_enrollment: [70, 99],
  schools: [1200, 4600],
  student_teacher_ratio: [20, 55],
  higher_ed_institutions: [10, 120],

  hospitals: [15, 120],
  phcs: [20, 150],
  doctors: [2, 12],
  hospital_beds: [3, 20],
  infant_mortality_rate: [24, 68],
  institutional_deliveries: [55, 98],

  workforce_participation: [35, 55],
  employment_rate: [88, 97],
  unemployment_rate: [3, 12],
  agriculture_workers: [30, 65],
  industry_workers: [10, 30],
  services_workers: [15, 40],

  total_crime_cases: [2000, 15000],
  crime_rate: [100, 500],
  violent_crime_share: [10, 30],
  property_crime_share: [20, 45],
  crime_yoy_change: [-15, 15],

  total_road_length: [2000, 9000],
  road_density: [80, 220],
  rural_roads: [1500, 7000],
  urban_roads: [300, 2000],
  villages_connected: [70, 99],

  gross_cropped_area: [150, 500],
  crop_production: [400, 1800],
  irrigation_coverage: [55, 95],
  agricultural_productivity: [1800, 3200],
  farm_holdings: [150, 600],

  drinking_water_access: [70, 99],
  piped_water_coverage: [30, 90],
  groundwater_level: [5, 25],
  groundwater_extraction: [50, 130],
  water_bodies_rejuvenated: [5, 80],

  household_electrification: [75, 100],
  new_connections: [5, 60],
  power_availability: [14, 23],
  per_capita_consumption: [400, 1400],
  transmission_losses: [10, 30],

  scheme_beneficiaries: [50000, 800000],
  scheme_coverage: [40, 95],
  scheme_expenditure: [20, 500],
  active_schemes: [8, 30],

  forest_cover: [2, 20],
  air_quality_index: [90, 250],
  waste_processed: [30, 90],
  water_quality_index: [40, 85],
  tree_cover_change: [-1, 2],
};

// Metrics that should trend upward over 2015-2024 regardless of "polarity"
// (e.g. population grows even though growth rate itself is polarity-neutral).
const FORCE_UPWARD_TREND = new Set([
  'population',
  'population_density',
  'per_capita_consumption',
  'scheme_expenditure',
  'scheme_beneficiaries',
  'crop_production',
  'new_connections',
  'water_bodies_rejuvenated',
  'forest_cover',
  'urban_population',
]);

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function getMetricDef(indicatorSlug: IndicatorSlug, metricKey: string) {
  const indicator = findIndicator(indicatorSlug);
  return indicator?.metrics.find((m) => m.key === metricKey);
}

/**
 * Deterministically decides whether a given cell is simulated as
 * "unavailable" (roughly 4% of cells), to exercise missing-data UI states.
 */
function isSimulatedUnavailable(districtId: string, indicatorSlug: string, metricKey: string, year: number): boolean {
  return seededRandom(districtId, indicatorSlug, metricKey, year, 'availability') < 0.04;
}

export function getMetricValue(
  districtId: string,
  indicatorSlug: IndicatorSlug,
  metricKey: string,
  year: number
): MetricValue {
  const district = findDistrict(districtId);
  const metric = getMetricDef(indicatorSlug, metricKey);
  const range = METRIC_RANGES[metricKey] ?? [0, 100];
  const [min, max] = range;
  const label = metric?.label ?? metricKey;

  const stateName = district?.stateId
    ? district.stateId.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'India';

  if (!district || !metric) {
    return {
      state: stateName,
      district: districtId,
      year,
      indicator: indicatorSlug,
      metric: metricKey,
      value: null,
      unit: '',
      status: 'unavailable',
      source: UNAVAILABLE_SOURCE(label, year),
    };
  }

  if (isSimulatedUnavailable(districtId, indicatorSlug, metricKey, year)) {
    return {
      state: stateName,
      district: district.name,
      year,
      indicator: indicatorSlug,
      metric: metricKey,
      value: null,
      unit: metric.unit,
      status: 'unavailable',
      source: UNAVAILABLE_SOURCE(label, year),
    };
  }

  // District-level baseline (stable across years for this district+metric)
  const base = seededRange(min, max, districtId, metricKey, 'base');

  // Trend direction: force-upward list wins; otherwise derive from polarity.
  let direction = 0;
  if (FORCE_UPWARD_TREND.has(metricKey)) direction = 1;
  else if (metric.polarity === 'positive') direction = 1;
  else if (metric.polarity === 'negative') direction = -1; // improving = decreasing

  const yearIndex = year - YEAR_RANGE.start;
  const span = max - min;
  const drift = direction * span * 0.028 * yearIndex;
  const noise = seededRange(-1, 1, districtId, metricKey, year, 'noise') * span * 0.025;

  const raw = base + drift + noise;
  const value = clamp(raw, min - span * 0.15, max + span * 0.15);

  return {
    state: stateName,
    district: district.name,
    year,
    indicator: indicatorSlug,
    metric: metricKey,
    value: Math.round(value * 10 ** metric.precision) / 10 ** metric.precision,
    unit: metric.unit,
    status: 'demo',
    source: DEMO_SOURCE(label, year),
  };
}

/** All metric values for one district, one indicator, one year. */
export function getIndicatorValuesForDistrict(
  districtId: string,
  indicatorSlug: IndicatorSlug,
  year: number
): MetricValue[] {
  const indicator = findIndicator(indicatorSlug);
  if (!indicator) return [];
  return indicator.metrics.map((m) => getMetricValue(districtId, indicatorSlug, m.key, year));
}

/** Trend series for one metric across the full supported year range. */
export function getTrendSeries(
  districtId: string,
  indicatorSlug: IndicatorSlug,
  metricKey: string
): { year: number; value: number | null }[] {
  const years = [];
  for (let y = YEAR_RANGE.start; y <= YEAR_RANGE.end; y++) {
    const mv = getMetricValue(districtId, indicatorSlug, metricKey, y);
    years.push({ year: y, value: mv.value });
  }
  return years;
}

/** One metric's value across every district in a state (or UP by default), for a given year. */
export function getMetricAcrossDistricts(
  indicatorSlug: IndicatorSlug,
  metricKey: string,
  year: number,
  stateId: string = 'uttar-pradesh'
): { districtId: string; districtName: string; value: number | null; status: MetricValue['status'] }[] {
  const stateDistricts = stateId === 'all'
    ? UP_DISTRICTS
    : (findDistrict(stateId) ? UP_DISTRICTS : (getDistrictsForState ? getDistrictsForState(stateId) : UP_DISTRICTS));
  const targetDistricts = stateDistricts.length > 0 ? stateDistricts : UP_DISTRICTS;

  return targetDistricts.map((d) => {
    const mv = getMetricValue(d.id, indicatorSlug, metricKey, year);
    return { districtId: d.id, districtName: d.name, value: mv.value, status: mv.status };
  });
}

/** A single headline metric value per indicator, for district overview cards. */
export function getDistrictIndicatorHeadline(
  districtId: string,
  indicatorSlug: IndicatorSlug,
  year: number
): MetricValue | null {
  const indicator = findIndicator(indicatorSlug);
  if (!indicator || indicator.metrics.length === 0) return null;
  return getMetricValue(districtId, indicatorSlug, indicator.metrics[0].key, year);
}

export function getAllIndicatorHeadlinesForDistrict(districtId: string, year: number) {
  return INDICATORS.map((indicator) => ({
    indicator,
    headline: getDistrictIndicatorHeadline(districtId, indicator.slug, year),
  }));
}
