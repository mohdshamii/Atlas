function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Interpolates between a low and high color across [min, max]. Used for
 * choropleth shading — low values render closer to `lowColor`, high values
 * closer to `highColor`.
 */
export function scaleColor(value: number, min: number, max: number, lowColor: string, highColor: string): string {
  if (max === min) return lowColor;
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const lo = hexToRgb(lowColor);
  const hi = hexToRgb(highColor);
  const mixed: [number, number, number] = [
    lo[0] + (hi[0] - lo[0]) * t,
    lo[1] + (hi[1] - lo[1]) * t,
    lo[2] + (hi[2] - lo[2]) * t,
  ];
  return rgbToHex(mixed);
}
