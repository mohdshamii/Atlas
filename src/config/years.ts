import type { YearOption } from '@/types';

export const YEAR_RANGE = { start: 2015, end: 2024 } as const;

export const YEARS: YearOption[] = Array.from(
  { length: YEAR_RANGE.end - YEAR_RANGE.start + 1 },
  (_, i) => {
    const year = YEAR_RANGE.start + i;
    return { year, label: String(year) };
  }
);

export const DEFAULT_YEAR = YEAR_RANGE.end;

export const isValidYear = (year: number): boolean =>
  year >= YEAR_RANGE.start && year <= YEAR_RANGE.end;
