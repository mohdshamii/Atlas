import type { SourceInfo } from '@/types';

/**
 * Every value shown in the app carries a SourceInfo. In this Version 1
 * build, no verified government dataset has actually been integrated yet,
 * so every value is honestly labeled as demo/sample data — see
 * src/data/demoData.ts. This file defines the SHAPE of source metadata and
 * a placeholder entry used everywhere, plus the reference list of
 * authoritative sources shown on the Data Sources page as "where this kind
 * of data would come from once verified data is integrated."
 */

export const DEMO_SOURCE = (datasetLabel: string, year: number): SourceInfo => ({
  sourceName: 'India Data Atlas — Demo Dataset',
  sourceUrl: '',
  datasetName: `${datasetLabel} (sample/demo)`,
  year,
  coverage: 'Uttar Pradesh, district-level',
  updateDate: '',
  notes:
    'This is clearly-labeled demo/sample data generated for illustration only. It is not sourced from an official survey and should not be used for research, reporting, or policy purposes.',
});

export const UNAVAILABLE_SOURCE = (datasetLabel: string, year: number): SourceInfo => ({
  sourceName: 'Not available',
  sourceUrl: '',
  datasetName: datasetLabel,
  year,
  coverage: 'Uttar Pradesh, district-level',
  updateDate: '',
  notes: 'No data (demo or verified) is currently available for this metric, district, and year.',
});

/** Reference list of official sources this platform is designed to integrate with. */
export interface ReferenceSource {
  indicatorSlug: string;
  sourceName: string;
  sourceUrl: string;
  notes: string;
}

export const REFERENCE_SOURCES: ReferenceSource[] = [
  { indicatorSlug: 'demographics', sourceName: 'Census of India, Office of the Registrar General & Census Commissioner', sourceUrl: 'https://censusindia.gov.in', notes: 'Decennial census; population projections in intercensal years.' },
  { indicatorSlug: 'education', sourceName: 'UDISE+ (Unified District Information System for Education Plus)', sourceUrl: 'https://udiseplus.gov.in', notes: 'Annual school-level data collected by the Ministry of Education.' },
  { indicatorSlug: 'healthcare', sourceName: 'Rural Health Statistics, Ministry of Health & Family Welfare', sourceUrl: 'https://main.mohfw.gov.in', notes: 'Annual infrastructure and staffing statistics for rural health facilities.' },
  { indicatorSlug: 'employment', sourceName: 'Periodic Labour Force Survey (PLFS), National Statistical Office', sourceUrl: 'https://mospi.gov.in', notes: 'Household survey on employment and unemployment, published periodically.' },
  { indicatorSlug: 'crime', sourceName: 'National Crime Records Bureau (NCRB), Ministry of Home Affairs', sourceUrl: 'https://ncrb.gov.in', notes: 'Annual "Crime in India" report with state and district data.' },
  { indicatorSlug: 'roads', sourceName: 'Ministry of Road Transport and Highways / PMGSY', sourceUrl: 'https://morth.nic.in', notes: 'Road length and rural connectivity statistics.' },
  { indicatorSlug: 'agriculture', sourceName: 'Directorate of Economics & Statistics, Dept. of Agriculture & Farmers Welfare', sourceUrl: 'https://eands.dacnet.nic.in', notes: 'District-level area, production, and yield statistics.' },
  { indicatorSlug: 'water', sourceName: 'Jal Jeevan Mission / Central Ground Water Board', sourceUrl: 'https://ejalshakti.gov.in', notes: 'Drinking water coverage and groundwater monitoring data.' },
  { indicatorSlug: 'electricity', sourceName: 'Central Electricity Authority', sourceUrl: 'https://cea.nic.in', notes: 'Electrification, supply, and consumption statistics.' },
  { indicatorSlug: 'government-schemes', sourceName: 'Respective scheme MIS dashboards (state & central government)', sourceUrl: '', notes: 'Coverage varies by scheme; each has its own reporting dashboard.' },
  { indicatorSlug: 'environment', sourceName: 'India State of Forest Report (FSI) / CPCB', sourceUrl: 'https://fsi.nic.in', notes: 'Biennial forest cover assessment; CPCB publishes air/water quality data.' },
];

export const getReferenceSource = (indicatorSlug: string): ReferenceSource | undefined =>
  REFERENCE_SOURCES.find((s) => s.indicatorSlug === indicatorSlug);
