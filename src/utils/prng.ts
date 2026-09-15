/**
 * Small deterministic PRNG utilities. Using a seeded generator (rather than
 * Math.random()) means the same district/year/metric always produces the
 * same demo value across reloads and across server/client, which matters
 * for shareable URLs and stable chart rendering.
 */

export function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Mulberry32 PRNG — fast, tiny, deterministic given a 32-bit seed. */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededRandom(...parts: (string | number)[]): number {
  const rng = mulberry32(hashString(parts.join('|')));
  return rng();
}

/** Deterministic random in [min, max]. */
export function seededRange(min: number, max: number, ...parts: (string | number)[]): number {
  return min + seededRandom(...parts) * (max - min);
}
