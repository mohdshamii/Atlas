import { scaleColor } from '@/utils/colorScale';

export default function MapLegend({
  min,
  max,
  unit,
  accentHigh = '#C58A2B',
}: {
  min: number;
  max: number;
  unit: string;
  accentHigh?: string;
}) {
  const steps = 6;
  return (
    <div className="flex items-center gap-2 text-xs text-base-400 font-sans">
      <span className="tabular-nums font-medium text-base-300">{min.toLocaleString('en-IN')}</span>
      <div className="flex h-2.5 w-32 overflow-hidden rounded-full border border-base-700">
        {Array.from({ length: steps }).map((_, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: scaleColor(min + ((max - min) * i) / (steps - 1), min, max, '#F4EFE3', accentHigh) }}
          />
        ))}
      </div>
      <span className="tabular-nums font-medium text-base-300">{max.toLocaleString('en-IN')}</span>
      <span className="text-base-500 font-mono text-[11px]">({unit})</span>
    </div>
  );
}
