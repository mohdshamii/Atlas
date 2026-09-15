import { YEARS } from '@/config/years';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  year: number;
  onChange: (year: number) => void;
  compact?: boolean;
}

export default function YearSelector({ year, onChange, compact }: Props) {
  const idx = YEARS.findIndex((y) => y.year === year);

  const step = (delta: number) => {
    const nextIdx = Math.min(YEARS.length - 1, Math.max(0, idx + delta));
    onChange(YEARS[nextIdx].year);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1 rounded-md border border-base-700 bg-base-900 px-1 py-1">
        <button
          aria-label="Previous year"
          onClick={() => step(-1)}
          disabled={idx <= 0}
          className="rounded p-1 text-base-300 hover:bg-base-800 disabled:opacity-30"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="w-12 text-center text-sm font-medium tabular-nums text-base-100">{year}</span>
        <button
          aria-label="Next year"
          onClick={() => step(1)}
          disabled={idx >= YEARS.length - 1}
          className="rounded p-1 text-base-300 hover:bg-base-800 disabled:opacity-30"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs text-base-400">
        <span>Year</span>
        <span className="tabular-nums text-base-100">{year}</span>
      </div>
      <input
        type="range"
        min={YEARS[0].year}
        max={YEARS[YEARS.length - 1].year}
        step={1}
        value={year}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Select year"
        className="w-full accent-signal-amber"
      />
      <div className="mt-1 flex justify-between text-[10px] text-base-500">
        <span>{YEARS[0].year}</span>
        <span>{YEARS[YEARS.length - 1].year}</span>
      </div>
    </div>
  );
}
