/**
 * Core domain types for India Data Atlas.
 *
 * The hierarchy is: Country -> State -> District -> Year -> Indicator -> Metric.
 * These types are intentionally decoupled from any single data source (JSON file,
 * CSV, or future API) so the data-fetching layer (see src/services/dataService.ts)
 * can be swapped out without touching components.
 */

export type IndicatorSlug =
  | 'demographics'
  | 'education'
  | 'healthcare'
  | 'employment'
  | 'crime'
  | 'roads'
  | 'agriculture'
  | 'water'
  | 'electricity'
  | 'government-schemes'
  | 'environment';

export interface IndicatorDefinition {
  slug: IndicatorSlug;
  name: string;
  shortDescription: string;
  description: string;
  icon: string; // lucide-react icon name
  accent: string; // hex color used for charts/badges for this indicator
  metrics: MetricDefinition[];
  /**
   * Informational only: the kind of official source that would typically
   * publish this indicator in India (e.g. "Census of India"). This is
   * guidance for future data integration — it does NOT mean this app
   * currently sources data from there. Every value's actual provenance is
   * tracked per-value in MetricValue.source.
   */
  suggestedOfficialSource?: string;
}

export interface MetricDefinition {
  key: string;
  label: string;
  unit: string;
  description: string;
  /** Higher-is-better / lower-is-better / neutral, used for trend coloring */
  polarity: 'positive' | 'negative' | 'neutral';
  /** Number of decimal places to display */
  precision: number;
}

/** Data quality / provenance status shown alongside every displayed statistic. */
export type DataStatus = 'verified' | 'demo' | 'unavailable';

export interface SourceInfo {
  sourceName: string;
  sourceUrl: string;
  datasetName: string;
  year: number;
  coverage: string;
  updateDate: string;
  notes: string;
}

/** A single observed (or demo/placeholder) value for one metric, district, and year. */
export interface MetricValue {
  state: string;
  district: string;
  year: number;
  indicator: IndicatorSlug;
  metric: string;
  value: number | null;
  unit: string;
  status: DataStatus;
  source: SourceInfo;
}

export interface District {
  id: string; // slug, e.g. "moradabad"
  name: string;
  stateId: string;
  division?: string;
  /** Approximate centroid, used for map labels and non-choropleth markers. */
  centroid: [number, number]; // [lat, lng]
  headquarters?: string;
  areaSqKm?: number;
}

export interface StateDefinition {
  id: string; // slug, e.g. "uttar-pradesh"
  name: string;
  capital: string;
  centroid: [number, number];
  zoom: number;
  status: 'available' | 'coming-soon';
  districts: District[];
}

export interface YearOption {
  year: number;
  label: string;
}

export interface SearchResultItem {
  type: 'state' | 'district' | 'indicator' | 'metric';
  label: string;
  sublabel?: string;
  path: string;
}

export interface KpiDatum {
  metric: MetricDefinition;
  currentValue: MetricValue;
  previousValue: MetricValue | null;
  changeAbs: number | null;
  changePct: number | null;
  trend: 'up' | 'down' | 'flat' | 'unknown';
}
